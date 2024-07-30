import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { Button, Table, Modal, Form, Overlay, Popover, Container, Navbar } from 'react-bootstrap';
import { db, imageDB } from '../API/fire';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Logo from '../../public/navbar-brand.svg';
import { FaEye, FaCheck, FaTrash, FaBars, FaChartBar, FaUser, FaClipboardList, FaCertificate, FaSignOutAlt, FaBook } from 'react-icons/fa';
import './admin.css';

function Admin() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedProdi, setSelectedProdi] = useState('');
  const [showActionPopover, setShowActionPopover] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  const actionButtonRef = useRef(null);

  const usersCollectionRef = collection(db, 'pendaftaran');
  const classesCollectionRef = collection(db, 'classes');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const getData = async () => {
      const usersData = await getDocs(usersCollectionRef);
      const classesData = await getDocs(classesCollectionRef);

      const usersWithIds = usersData.docs.map((doc) => {
        const data = doc.data();
        const totalScore = (data.readingScore || 0) + (data.listeningScore || 0);
        return { ...data, id: doc.id, totalScore: totalScore };
      });

      const classesWithIds = classesData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const usersWithClassNames = usersWithIds.map((user) => {
        const userClass = classesWithIds.find((cls) => cls.id === user.classId);
        return { ...user, className: userClass ? userClass.name : 'Tidak terdaftar' };
      });

      setUsers(usersWithClassNames);
      setClasses(classesWithIds);
    };
    getData();
  }, []);

  const handleDelete = async (userId, imageId, certificateUrl) => {
    setLoading(true);
    setDeletingUser(userId);
    try {
      const userRef = doc(db, 'pendaftaran', userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      if (imageId) {
        const imageRef = ref(imageDB, `images/${imageId}`);
        try {
          await deleteObject(imageRef);
        } catch (error) {
          if (error.code !== 'storage/object-not-found') {
            throw error;
          }
        }
      }

      if (userData.certificateUrl) {
        const certificateRef = ref(imageDB, `certificates/${userId}`);
        try {
          await deleteObject(certificateRef);
        } catch (error) {
          if (error.code !== 'storage/object-not-found') {
            throw error;
          }
        }
      }

      await deleteDoc(userRef);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting document: ', error);
    } finally {
      setLoading(false);
      setDeletingUser(null);
    }
  };

  const confirmDelete = (user) => {
    setCurrentUser(user);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    if (currentUser) {
      await handleDelete(currentUser.id, currentUser.imageId, currentUser.certificateId);
      setShowDeleteConfirm(false);
      setCurrentUser(null);
    }
  };

  const lihatBuktiPembayaran = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const handleToggleVerified = async (userId, currentStatus) => {
    try {
      const userRef = doc(db, 'pendaftaran', userId);
      await updateDoc(userRef, {
        verified: !currentStatus
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, verified: !currentStatus } : user
        )
      );

      setCurrentUser((prevUser) =>
        prevUser ? { ...prevUser, verified: !currentStatus } : null
      );
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const filteredUsers = useMemo(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      (!selectedJurusan || user.jurusan === selectedJurusan) &&
      (!selectedClass || user.classId === selectedClass) &&
      (!selectedYear || user.registrationYear === selectedYear) &&
      (!selectedProdi || user.prodi === selectedProdi)
    );

    return filtered;
  }, [users, searchKeyword, selectedJurusan, selectedClass, selectedYear, selectedProdi]);

  const exportToExcel = useCallback(() => {
    const filteredUserData = filteredUsers.map(user => ({
      Nama: user.name,
      T_TglLahir:user.tempatTanggalLahir,
      NIM: user.nim,
      Prodi: user.prodi,
      Jurusan: user.jurusan,
      Kelas: user.className,
      Phone: user.phone,
      tgl_Bayar:user.tanggalPembayaran,
      tgl_Daftar:user.registrationDate,
      Reading: user.readingScore,
      Listening: user.listeningScore,
      TotalScore: user.totalScore
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredUserData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pendaftar');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Data_Pendaftar.xlsx';
    a.click();
  }, [filteredUsers]);

  const openActionPopover = (user, event) => {
    setCurrentUser(user);
    actionButtonRef.current = event.target;
    setShowActionPopover(true);
  };

  const closeActionPopover = () => {
    setShowActionPopover(false);
    setCurrentUser(null);
  };

  return (
    <div className={`admin-body dashboard ${sidebarOpen ? '' : 'sidebar-closed'}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <FaBars onClick={() => setSidebarOpen(!sidebarOpen)} />
          {sidebarOpen && (
            <img
              style={{ marginLeft: '10px', height: '25px' }}
              src={Logo}
              alt="Politeknik Negeri Banyuwangi"
            />
          )}
        </div>
        <ul className="list-unstyled components">
          <li>
            <a href="/dashboard-admin">
              <FaChartBar />
              {sidebarOpen && ' Dashboard'}
            </a>
          </li>
          <li>
            <a href="/admin">
              <FaUser />
              {sidebarOpen && ' Users'}
            </a>
          </li>
          <li>
            <a href="/class-admin">
              <FaClipboardList />
              {sidebarOpen && ' Buat Kelas'}
            </a>
          </li>
          <li>
            <a href="/upload-sertifikat">
              <FaCertificate />
              {sidebarOpen && ' Upload Certificate'}
            </a>
          </li>
          <li>
            <a href="/jurusan">
              <FaBook />
              {sidebarOpen && ' Jurusan'}
            </a>
          </li>
          <li>
            <a href="#logout" onClick={handleLogout}>
              <FaSignOutAlt />
              {sidebarOpen && ' Logout'}
            </a>
          </li>
        </ul>
      </div>
      <div className="main-content">
        <Navbar variant="dark" style={{ backgroundColor: '#232858' }}>
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <div style={{ display: 'flex', justifyContent: 'right', marginBottom: '10px', marginTop: '10px' }}>
                <input
                  style={{ borderRadius: '10px' }}
                  type='text'
                  placeholder='Cari berdasarkan nama'
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <Form.Select
                  style={{ marginLeft: '10px', borderRadius: '10px' }}
                  value={selectedJurusan}
                  onChange={(e) => setSelectedJurusan(e.target.value)}
                >
                  <option value="">Pilih Jurusan...</option>
                  {[...new Set(users.map(user => user.jurusan))].map((jurusan) => (
                    <option key={jurusan} value={jurusan}>{jurusan}</option>
                  ))}
                </Form.Select>

                <Form.Select
                  style={{ marginLeft: '10px', borderRadius: '10px' }}
                  value={selectedProdi}
                  onChange={(e) => setSelectedProdi(e.target.value)}
                >
                  <option value="">Pilih Prodi...</option>
                  {[...new Set(users.map(user => user.prodi))].map((prodi) => (
                    <option key={prodi} value={prodi}>{prodi}</option>
                  ))}
                </Form.Select>

                <Form.Select
                  style={{ marginLeft: '10px', borderRadius: '10px' }}
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">Pilih Kelas...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </Form.Select>

                <Form.Select
                  style={{ marginLeft: '10px', borderRadius: '10px' }}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Pilih Tahun...</option>
                  {[...new Set(users.map(user => user.registrationYear))].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Select>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Table className="table-centered">
          <thead>
            <tr>
              <th>Nama</th>
              <th>NIM</th>
              <th>Prodi</th>
              <th>Jurusan</th>
              <th>Kelas</th>
              <th>WA</th>
              <th>Tanggal daftar</th>
              <th>Tanggal Bayar</th>
              {/* <th>Reading</th>
              <th>Listening</th> */}
              <th>Total Nilai</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.nim}</td>
                <td>{user.prodi}</td>
                <td>{user.jurusan}</td>
                <td>{user.className}</td>
                <td>{user.phone}</td>
                <td>{user.registrationDate.split('T')[0]}</td> 
                <td>{user.tanggalPembayaran}</td>
                {/* <td>{user.readingScore}</td>
                <td>{user.listeningScore}</td> */}
                <td>{user.totalScore}</td>
                <td>
                  <Button 
                    ref={actionButtonRef} 
                    className='buttonAction' 
                    onClick={(e) => openActionPopover(user, e)}
                  >
                    Actions
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      
        <Overlay
          show={showActionPopover}
          target={actionButtonRef.current}
          placement="bottom"
          onHide={closeActionPopover}
          transition={false}
          rootClose={true}
        >
          {(props) => (
            <Popover id="popover-contained" {...props}>
              <Popover.Body>
                <Button 
                  onClick={() => handleToggleVerified(currentUser.id, currentUser.verified)}
                  style={{
                    backgroundColor: currentUser?.verified ? 'green' : 'gray',
                    borderColor: currentUser?.verified ? 'green' : 'gray'
                  }}
                >
                  {currentUser?.verified ? 'Unverify' : 'Verify'} <FaCheck />
                </Button>
                <Button onClick={() => lihatBuktiPembayaran(currentUser.imageUrl)}><FaEye /></Button>
                <Button 
                  onClick={() => confirmDelete(currentUser)}
                  style={{
                    backgroundColor: 'red',
                    borderColor: 'red'
                  }}
                >
                  <FaTrash />
                </Button>
              </Popover.Body>
            </Popover>
          )}
        </Overlay>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Bukti Pembayaran</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={selectedImage} alt="Bukti Pembayaran" style={{ width: '100%' }} />
          </Modal.Body>
        </Modal>

        <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi Hapus</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Apakah Anda yakin ingin menghapus data peserta ini? Semua data terkait, termasuk bukti pembayaran, sertifikat peserta, dan nilai, akan hilang.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Batal
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirmed}>
              Hapus
            </Button>
          </Modal.Footer>
        </Modal>

        <Button onClick={exportToExcel}>Export to Excel</Button>
      </div>
    </div>
  );
}

export default Admin;
