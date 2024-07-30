import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button, Table, Spinner, Form, Navbar, Container } from 'react-bootstrap';
import { db, imageDB } from '../API/fire';
import { ImFolderUpload } from "react-icons/im";
import { ToastContainer, toast } from 'react-toastify';
import { FaBars, FaChartBar, FaUser, FaClipboardList, FaCertificate, FaSignOutAlt, FaBook } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../public/navbar-brand.svg';
import './admin.css';

function UploadCertificateAdmin() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [scores, setScores] = useState({});
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingUser, setUploadingUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const usersCollectionRef = collection(db, 'pendaftaran');
  const classesCollectionRef = collection(db, 'classes');

  useEffect(() => {
    const getData = async () => {
      const usersData = await getDocs(usersCollectionRef);
      const classesData = await getDocs(classesCollectionRef);

      const usersWithIds = usersData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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

  const handleUploadCertificate = async (user) => {
    if (!user || !certificateFile || isNaN(scores[user.id]?.reading) || isNaN(scores[user.id]?.listening)) {
      return;
    }

    if (certificateFile.size > 1048576) { // 1MB = 1048576 bytes
      toast.error('Ukuran file maksimal adalah 1MB.');
      setCertificateFile(null);
      return;
    }

    setLoading(true);
    setUploadingUser(user.id);
    const storageRef = ref(imageDB, `certificates/${user.id}`);
    const uploadTask = uploadBytesResumable(storageRef, certificateFile);

    try {
      const snapshot = await uploadTask;
      const downloadUrl = await getDownloadURL(snapshot.ref);

      await updateDoc(doc(db, 'pendaftaran', user.id), {
        certificateUrl: downloadUrl,
        readingScore: parseFloat(scores[user.id]?.reading) || 0,
        listeningScore: parseFloat(scores[user.id]?.listening) || 0,
      });

      toast.success('Sertifikat dan nilai berhasil diupload!');
      setCertificateFile(null);
      setSelectedUser(null);
      setScores((prevScores) => ({
        ...prevScores,
        [user.id]: {
          reading: '',
          listening: '',
        },
      }));

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id
            ? { ...u, certificateUrl: downloadUrl, readingScore: parseFloat(scores[user.id]?.reading) || 0, listeningScore: parseFloat(scores[user.id]?.listening) || 0 }
            : u
        )
      );
    } catch (error) {
      toast.error('Gagal mengupload sertifikat dan nilai!');
      console.error('Error uploading certificate:', error);
    } finally {
      setLoading(false);
      setUploadingUser(null);
    }
  };

  const handleScoreChange = (userId, type, value) => {
    setScores((prevScores) => ({
      ...prevScores,
      [userId]: {
        ...prevScores[userId],
        [type]: value,
      },
    }));
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesName = user.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesJurusan = !selectedJurusan || user.jurusan === selectedJurusan;
      const matchesClass = !selectedClass || user.classId === selectedClass;
      const matchesYear = !selectedYear || user.registrationYear === selectedYear;
      return matchesName && matchesJurusan && matchesClass && matchesYear;
    });
  }, [users, searchKeyword, selectedJurusan, selectedClass, selectedYear]);

  const isFormValid = () => {
    return !!certificateFile && !!scores[selectedUser?.id]?.reading && !!scores[selectedUser?.id]?.listening;
  };

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
        <div className='admin-body'>
          <Table striped bordered hover style={{ margin: '10px' }}>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Jurusan</th>
                <th>Kelas</th>
                <th>Sertifikat</th>
                <th>Upload</th>
                <th>Reading Score</th>
                <th>Listening Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.jurusan}</td>
                  <td>{user.className}</td>
                  <td>
                    {user.certificateUrl && (
                      <a
                        href={user.certificateUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Lihat Sertifikat
                      </a>
                    )}
                  </td>
                  <td>
                    <input
                      type='file'
                      accept='application/pdf'
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && file.size > 1048576) {
                          toast.error('Ukuran file maksimal adalah 1MB.');
                          setCertificateFile(null);
                          e.target.value = null;
                        } else {
                          setCertificateFile(file);
                          setSelectedUser(user);
                        }
                      }}
                      disabled={!!user.certificateUrl}
                    />
                    <Button
                      variant='success'
                      onClick={() => handleUploadCertificate(user)}
                      disabled={loading || !isFormValid() || !!user.certificateUrl}
                    >
                      {loading && uploadingUser === user.id ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        <ImFolderUpload />
                      )}
                    </Button>
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={scores[user.id]?.reading || user.readingScore || ''}
                      onChange={(e) => handleScoreChange(user.id, 'reading', e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={scores[user.id]?.listening || user.listeningScore || ''}
                      onChange={(e) => handleScoreChange(user.id, 'listening', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
        </div>
      </div>
    </div>
  );
}

export default UploadCertificateAdmin;


// import React, { useState, useEffect, useMemo } from 'react';
// import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { Button, Table, Spinner, Form, Navbar, Container } from 'react-bootstrap';
// import { db, imageDB } from '../API/fire';
// import { ImFolderUpload } from "react-icons/im";
// import { ToastContainer, toast } from 'react-toastify';
// import { FaBars, FaChartBar, FaUser, FaClipboardList, FaCertificate, FaSignOutAlt, FaBook } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import Logo from '../../public/navbar-brand.svg';
// import { jsPDF } from "jspdf";
// import './admin.css';

// function UploadCertificateAdmin() {
//   const [users, setUsers] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [scores, setScores] = useState({});
//   const [searchKeyword, setSearchKeyword] = useState('');
//   const [selectedJurusan, setSelectedJurusan] = useState('');
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedYear, setSelectedYear] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [uploadingUser, setUploadingUser] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const navigate = useNavigate();
//   const usersCollectionRef = collection(db, 'pendaftaran');
//   const classesCollectionRef = collection(db, 'classes');

//   useEffect(() => {
//     const getData = async () => {
//       const usersData = await getDocs(usersCollectionRef);
//       const classesData = await getDocs(classesCollectionRef);

//       const usersWithIds = usersData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
//       const classesWithIds = classesData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

//       const usersWithClassNames = usersWithIds.map((user) => {
//         const userClass = classesWithIds.find((cls) => cls.id === user.classId);
//         return { ...user, className: userClass ? userClass.name : 'Tidak terdaftar' };
//       });

//       setUsers(usersWithClassNames);
//       setClasses(classesWithIds);
//     };
//     getData();
//   }, []);

//   const generateCertificate = async (user) => {
//     const doc = new jsPDF();
//     doc.text(`Certificate of Achievement`, 10, 10);
//     doc.text(`This is to certify that ${user.name} has achieved`, 10, 20);
//     doc.text(`Reading Score: ${scores[user.id]?.reading}`, 10, 30);
//     doc.text(`Listening Score: ${scores[user.id]?.listening}`, 10, 40);
//     return doc.output('blob');
//   };

//   const handleUploadCertificate = async (user) => {
//     if (!user || isNaN(scores[user.id]?.reading) || isNaN(scores[user.id]?.listening)) {
//       return;
//     }

//     setLoading(true);
//     setUploadingUser(user.id);

//     try {
//       const certificateBlob = await generateCertificate(user);
//       const storageRef = ref(imageDB, `certificates/${user.id}.pdf`);
//       const uploadTask = uploadBytesResumable(storageRef, certificateBlob);

//       const snapshot = await uploadTask;
//       const downloadUrl = await getDownloadURL(snapshot.ref);

//       await updateDoc(doc(db, 'pendaftaran', user.id), {
//         certificateUrl: downloadUrl,
//         readingScore: parseFloat(scores[user.id]?.reading) || 0,
//         listeningScore: parseFloat(scores[user.id]?.listening) || 0,
//       });

//       toast.success('Sertifikat dan nilai berhasil diupload!');
//       setSelectedUser(null);
//       setScores((prevScores) => ({
//         ...prevScores,
//         [user.id]: {
//           reading: '',
//           listening: '',
//         },
//       }));

//       setUsers((prevUsers) =>
//         prevUsers.map((u) =>
//           u.id === user.id
//             ? { ...u, certificateUrl: downloadUrl, readingScore: parseFloat(scores[user.id]?.reading) || 0, listeningScore: parseFloat(scores[user.id]?.listening) || 0 }
//             : u
//         )
//       );
//     } catch (error) {
//       toast.error('Gagal mengupload sertifikat dan nilai!');
//       console.error('Error uploading certificate:', error);
//     } finally {
//       setLoading(false);
//       setUploadingUser(null);
//     }
//   };

//   const handleScoreChange = (userId, type, value) => {
//     setScores((prevScores) => ({
//       ...prevScores,
//       [userId]: {
//         ...prevScores[userId],
//         [type]: value,
//       },
//     }));
//     setSelectedUser(users.find((user) => user.id === userId));
//   };

//   const filteredUsers = useMemo(() => {
//     return users.filter((user) => {
//       const matchesName = user.name.toLowerCase().includes(searchKeyword.toLowerCase());
//       const matchesJurusan = !selectedJurusan || user.jurusan === selectedJurusan;
//       const matchesClass = !selectedClass || user.classId === selectedClass;
//       const matchesYear = !selectedYear || user.registrationYear === selectedYear;
//       return matchesName && matchesJurusan && matchesClass && matchesYear;
//     });
//   }, [users, searchKeyword, selectedJurusan, selectedClass, selectedYear]);

//   const isFormValid = () => {
//     return !!selectedUser && !!scores[selectedUser?.id]?.reading && !!scores[selectedUser?.id]?.listening;
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <div className={`dashboard ${sidebarOpen ? '' : 'sidebar-closed'}`}>
//       <div className="sidebar">
//         <div className="sidebar-header">
//           <FaBars onClick={() => setSidebarOpen(!sidebarOpen)} />
//           {sidebarOpen && (
//             <img
//               style={{ marginLeft: '10px', height: '25px' }}
//               src={Logo}
//               alt="Politeknik Negeri Banyuwangi"
//             />
//           )}
//         </div>
//         <ul className="list-unstyled components">
//           <li>
//             <Link to="/dashboard-admin">
//               <FaChartBar />
//               {sidebarOpen && ' Dashboard'}
//             </Link>
//           </li>
//           <li>
//             <Link to="/admin">
//               <FaUser />
//               {sidebarOpen && ' Users'}
//             </Link>
//           </li>
//           <li>
//             <Link to="/class-admin">
//               <FaClipboardList />
//               {sidebarOpen && ' Buat Kelas'}
//             </Link>
//           </li>
//           <li>
//             <Link to="/upload-sertifikat">
//               <FaCertificate />
//               {sidebarOpen && ' Upload Certificate'}
//             </Link>
//           </li>
//           <li>
//             <Link to="/jurusan">
//               <FaBook />
//               {sidebarOpen && ' Jurusan'}
//             </Link>
//           </li>
//           <li>
//             <a href="#logout" onClick={handleLogout}>
//               <FaSignOutAlt />
//               {sidebarOpen && ' Logout'}
//             </a>
//           </li>
//         </ul>
//       </div>
//       <div className="main-content">
//         <Navbar variant="dark" style={{ backgroundColor: '#232858' }}>
//           <Container>
//             <Navbar.Toggle aria-controls="basic-navbar-nav" />
//             <Navbar.Collapse id="basic-navbar-nav">
//               <div style={{ display: 'flex', justifyContent: 'right', marginBottom: '10px', marginTop: '10px' }}>
//                 <input
//                   style={{ borderRadius: '10px' }}
//                   type='text'
//                   placeholder='Cari berdasarkan nama'
//                   value={searchKeyword}
//                   onChange={(e) => setSearchKeyword(e.target.value)}
//                 />
//                 <Form.Select
//                   style={{ marginLeft: '10px', borderRadius: '10px' }}
//                   value={selectedJurusan}
//                   onChange={(e) => setSelectedJurusan(e.target.value)}
//                 >
//                   <option value="">Pilih Jurusan...</option>
//                   {[...new Set(users.map(user => user.jurusan))].map((jurusan) => (
//                     <option key={jurusan} value={jurusan}>{jurusan}</option>
//                   ))}
//                 </Form.Select>

//                 <Form.Select
//                   style={{ marginLeft: '10px', borderRadius: '10px' }}
//                   value={selectedClass}
//                   onChange={(e) => setSelectedClass(e.target.value)}
//                 >
//                   <option value="">Pilih Kelas...</option>
//                   {classes.map((cls) => (
//                     <option key={cls.id} value={cls.id}>{cls.name}</option>
//                   ))}
//                 </Form.Select>

//                 <Form.Select
//                   style={{ marginLeft: '10px', borderRadius: '10px' }}
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(e.target.value)}
//                 >
//                   <option value="">Pilih Tahun...</option>
//                   {[...new Set(users.map(user => user.registrationYear))].map((year) => (
//                     <option key={year} value={year}>{year}</option>
//                   ))}
//                 </Form.Select>
//               </div>
//             </Navbar.Collapse>
//           </Container>
//         </Navbar>
//         <div className='admin-body'>
//           <Table striped bordered hover style={{ margin: '10px' }}>
//             <thead>
//               <tr>
//                 <th>Nama</th>
//                 <th>Jurusan</th>
//                 <th>Kelas</th>
//                 <th>Sertifikat</th>
//                 <th>Upload</th>
//                 <th>Reading Score</th>
//                 <th>Listening Score</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((user) => (
//                 <tr key={user.id}>
//                   <td>{user.name}</td>
//                   <td>{user.jurusan}</td>
//                   <td>{user.className}</td>
//                   <td>
//                     {user.certificateUrl && (
//                       <a
//                         href={user.certificateUrl}
//                         target='_blank'
//                         rel='noopener noreferrer'
//                       >
//                         Lihat Sertifikat
//                       </a>
//                     )}
//                   </td>
//                   <td>
//                     <Button
//                       variant='success'
//                       onClick={() => handleUploadCertificate(user)}
//                       disabled={loading || !isFormValid() || !!user.certificateUrl}
//                     >
//                       {loading && uploadingUser === user.id ? (
//                         <Spinner as="span" animation="border" size="sm" />
//                       ) : (
//                         <ImFolderUpload />
//                       )}
//                     </Button>
//                   </td>
//                   <td>
//                     <Form.Control
//                       type="number"
//                       value={scores[user.id]?.reading || user.readingScore || ''}
//                       onChange={(e) => handleScoreChange(user.id, 'reading', e.target.value)}
//                     />
//                   </td>
//                   <td>
//                     <Form.Control
//                       type="number"
//                       value={scores[user.id]?.listening || user.listeningScore || ''}
//                       onChange={(e) => handleScoreChange(user.id, 'listening', e.target.value)}
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UploadCertificateAdmin;
