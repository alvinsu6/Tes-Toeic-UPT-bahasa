import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { Button, Table, Form, Card, Modal } from 'react-bootstrap';
import { db } from '../API/fire';
import { FaBars, FaChartBar, FaUser, FaClipboardList, FaCertificate, FaSignOutAlt, FaBook } from 'react-icons/fa';
import 'chart.js/auto';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../public/navbar-brand.svg';
import './admin.css';

function AdminClass() {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [quota, setQuota] = useState('');
  const [schedule, setSchedule] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const classesCollectionRef = collection(db, 'classes');

  useEffect(() => {
    const getClasses = async () => {
      const data = await getDocs(classesCollectionRef);
      setClasses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getClasses();
  }, [classesCollectionRef]);

  const handleAddClass = async () => {
    try {
      await addDoc(classesCollectionRef, {
        name: className,
        description: classDescription,
        quota: parseInt(quota),
        schedule: schedule,
        whatsappLink: whatsappLink, // Menyimpan link WhatsApp saat menambah kelas baru
      });
      setClassName('');
      setClassDescription('');
      setQuota('');
      setSchedule('');
      setWhatsappLink('');
      setShowModal(false);
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  const confirmDeleteClass = (classId) => {
    setSelectedClassId(classId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteClass = async () => {
    try {
      await deleteDoc(doc(db, 'classes', selectedClassId));

      const pendaftaranRef = collection(db, 'pendaftaran');
      const queryPendaftaran = query(pendaftaranRef, where('classId', '==', selectedClassId));
      const querySnapshot = await getDocs(queryPendaftaran);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setClasses((prevClasses) => prevClasses.filter((classItem) => classItem.id !== selectedClassId));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting class: ', error);
    }
  };

  const handleEditQuota = async (classId, newQuota) => {
    try {
      await updateDoc(doc(db, 'classes', classId), {
        quota: parseInt(newQuota),
      });
      const updatedClasses = classes.map((classItem) =>
        classItem.id === classId ? { ...classItem, quota: parseInt(newQuota) } : classItem
      );
      setClasses(updatedClasses);
    } catch (error) {
      console.error('Error editing quota:', error);
    }
  };

  const handleEditSchedule = async (classId, newSchedule) => {
    try {
      await updateDoc(doc(db, 'classes', classId), {
        schedule: newSchedule,
      });
      const updatedClasses = classes.map((classItem) =>
        classItem.id === classId ? { ...classItem, schedule: newSchedule } : classItem
      );
      setClasses(updatedClasses);
    } catch (error) {
      console.error('Error editing schedule:', error);
    }
  };

  const handleEditDescription = async (classId, newDescription) => {
    try {
      await updateDoc(doc(db, 'classes', classId), {
        description: newDescription,
      });
      const updatedClasses = classes.map((classItem) =>
        classItem.id === classId ? { ...classItem, description: newDescription } : classItem
      );
      setClasses(updatedClasses);
    } catch (error) {
      console.error('Error editing description:', error);
    }
  };

  const handleEditWhatsappLink = async (classId, newLink) => {
    try {
      await updateDoc(doc(db, 'classes', classId), {
        whatsappLink: newLink,
      });
      const updatedClasses = classes.map((classItem) =>
        classItem.id === classId ? { ...classItem, whatsappLink: newLink } : classItem
      );
      setClasses(updatedClasses);
    } catch (error) {
      console.error('Error editing WhatsApp link:', error);
    }
  };

  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={`dashboard ${sidebarOpen ? '' : 'sidebar-closed'}`}>
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
            <Link to="/dashboard-admin">
              <FaChartBar />
              {sidebarOpen && ' Dashboard'}
            </Link>
          </li>
          <li>
            <Link to="/admin">
              <FaUser />
              {sidebarOpen && ' Users'}
            </Link>
          </li>
          <li>
            <Link to="/class-admin">
              <FaClipboardList />
              {sidebarOpen && ' Buat Kelas'}
            </Link>
          </li>
          <li>
            <Link to="/upload-sertifikat">
              <FaCertificate />
              {sidebarOpen && ' Upload Certificate'}
            </Link>
          </li>
          <li>
            <Link to="/jurusan">
              <FaBook />
              {sidebarOpen && ' Jurusan'}
            </Link>
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
        <div className='admin-body'>
          <Card className='card-class'>
            <br />
            <Button className='tambah-kelas' variant="primary" onClick={() => setShowModal(true)}>
              + kelas
            </Button>
            <Table striped bordered hover style={{ marginTop: '20px' }}>
              <thead style={{ backgroundColor: '#232858', textAlign: 'center' }}>
                <tr>
                  <th>Nama Class</th>
                  <th>Deskripsi</th>
                  <th>Kuota</th>
                  <th>Jadwal</th>
                  <th>WhatsApp</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((classItem) => (
                  <tr key={classItem.id}>
                    <td>{classItem.name}</td>
                    <td>
                      <Form.Control
                        type="text"
                        value={classItem.description}
                        onChange={(e) => handleEditDescription(classItem.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={classItem.quota}
                        onChange={(e) => handleEditQuota(classItem.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="date"
                        value={classItem.schedule}
                        onChange={(e) => handleEditSchedule(classItem.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={classItem.whatsappLink}
                        onChange={(e) => handleEditWhatsappLink(classItem.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <Button variant="danger" onClick={() => confirmDeleteClass(classItem.id)}>
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Tambah Class</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={(e) => { e.preventDefault(); handleAddClass(); }}>
                <Form.Group controlId="formClassName">
                  <Form.Label>Nama Class</Form.Label>
                  <Form.Control
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formClassDescription">
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control
                    type="text"
                    value={classDescription}
                    onChange={(e) => setClassDescription(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formClassQuota">
                  <Form.Label>Kuota</Form.Label>
                  <Form.Control
                    type="number"
                    value={quota}
                    onChange={(e) => setQuota(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formClassSchedule">
                  <Form.Label>Jadwal</Form.Label>
                  <Form.Control
                    type="date"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formClassWhatsapp">
                  <Form.Label>Link WhatsApp</Form.Label>
                  <Form.Control
                    type="text"
                    value={whatsappLink}
                    onChange={(e) => setWhatsappLink(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Tambah
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Konfirmasi Hapus Kelas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Jika kelas dihapus, semua peserta yang terdaftar dalam kelas ini akan kehilangan nilai kelasnya. Anda yakin ingin menghapus kelas ini?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Batal
              </Button>
              <Button variant="danger" onClick={handleDeleteClass}>
                Hapus
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default AdminClass;
