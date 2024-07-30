import React, { useState, useEffect } from 'react';
import { Button, Table, Card, Nav } from 'react-bootstrap';
import { doc, updateDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../API/fire';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../public/navbar-brand.svg';
import './Kelas.css'; // Import file CSS untuk menampung gaya khusus
import { Link, useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa'; // Import icon WhatsApp

function Kelas() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [activeTab, setActiveTab] = useState('detail'); // State untuk tab aktif
  const [isRegistered, setIsRegistered] = useState(false); // State untuk status pendaftaran
  const [whatsappLink, setWhatsappLink] = useState(''); // State untuk menyimpan link WhatsApp
  const [classExpired, setClassExpired] = useState(false); // State untuk menandai kelas sudah berakhir
  const [canRegister, setCanRegister] = useState(false); // State untuk menandai apakah user bisa daftar
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassData = async () => {
      // Mengambil data kelas dari local storage saat komponen dimuat
      const classData = JSON.parse(localStorage.getItem('selectedClass'));
      setSelectedClass(classData);
      if (classData) {
        fetchParticipants(classData.id);
        checkRegistrationStatus(classData.id);
        // Set link WhatsApp dari data kelas
        setWhatsappLink(classData.whatsappLink || ''); // Pastikan ada fallback jika whatsappLink kosong

        // Periksa apakah kelas sudah berakhir
        const currentDate = new Date();
        const endDate = new Date(classData.schedule); // Asumsikan schedule adalah tanggal batas

        if (currentDate > endDate) {
          setClassExpired(true);
        }
      }
    };

    fetchClassData();
  }, []);

  const fetchParticipants = async (classId) => {
    try {
      const pendaftaranCollectionRef = collection(db, 'pendaftaran');
      const q = query(pendaftaranCollectionRef, where('classId', '==', classId));
      const querySnapshot = await getDocs(q);
      const participantsList = querySnapshot.docs.map(doc => doc.data());
      setParticipants(participantsList);
    } catch (error) {
      toast.error(`Error fetching participants: ${error.message}`);
      console.error('Error fetching participants:', error.message);
    }
  };

  const checkRegistrationStatus = async (classId) => {
    try {
      const email = localStorage.getItem('username');
      const pendaftaranCollectionRef = collection(db, 'pendaftaran');
      const q = query(pendaftaranCollectionRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const registration = querySnapshot.docs[0].data();
        const registeredClassId = registration.classId;

        if (registeredClassId) {
          const classDocRef = doc(db, 'classes', registeredClassId);
          const classDoc = await getDoc(classDocRef);

          if (classDoc.exists()) {
            const classData = classDoc.data();
            const currentDate = new Date();
            const classEndDate = new Date(classData.schedule);

            if (currentDate > classEndDate) {
              setCanRegister(true); // Kelas sebelumnya sudah selesai
            } else {
              setCanRegister(false); // Kelas sebelumnya belum selesai
            }
          } else {
            setCanRegister(true); // Dokumen kelas tidak ditemukan, izinkan pendaftaran
          }
        } else {
          setCanRegister(true); // Tidak ada kelas yang terdaftar, izinkan pendaftaran
        }
      } else {
        setCanRegister(true); // Tidak ada pendaftaran sebelumnya, izinkan pendaftaran
      }
      
      setIsRegistered(querySnapshot.docs.some(doc => doc.data().classId === classId));
    } catch (error) {
      toast.error(`Error checking registration status: ${error.message}`);
      console.error('Error checking registration status:', error.message);
    }
  };

  const handleDaftarClick = async () => {
    try {
      // Jika data kelas tidak tersedia, beri pesan error
      if (!selectedClass) {
        throw new Error('Tidak ada kelas yang dipilih.');
      }

      // Mengambil email dari local storage
      const email = localStorage.getItem('username');

      // Periksa apakah kelas sudah berakhir
      const currentDate = new Date();
      const endDate = new Date(selectedClass.schedule); // Asumsikan schedule adalah tanggal batas

      if (currentDate > endDate) {
        throw new Error('Kelas ini sudah berakhir. Anda tidak dapat mendaftar lagi.');
      }

      // Menemukan dokumen yang sesuai dalam koleksi 'pendaftaran'
      const pendaftaranCollectionRef = collection(db, 'pendaftaran');
      const q = query(pendaftaranCollectionRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      // Memeriksa apakah dokumen ditemukan
      if (querySnapshot.empty) {
        throw new Error('Tidak ada dokumen yang ditemukan.');
      }

      // Mengambil id dokumen
      const docId = querySnapshot.docs[0].id;

      // Perbarui dokumen tersebut dengan menambahkan classId
      const pendaftaranDocRef = doc(pendaftaranCollectionRef, docId);
      await updateDoc(pendaftaranDocRef, {
        classId: selectedClass.id,
        // Anda bisa menambahkan data lain jika diperlukan
      });

      setIsRegistered(true); // Set tombol menjadi terdaftar
      toast.success('Anda berhasil mendaftar ke kelas.');
      fetchParticipants(selectedClass.id); // Refresh daftar peserta setelah pendaftaran
    } catch (error) {
      toast.error(`Error registering to class: ${error.message}`);
      console.error('Error updating document:', error.message);
    }
  };

  const handleClose = () => {
    navigate('/pendaftaran');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center position-relative">
      <Link to='/pendaftaran'>
        <img
          src={Logo}
          alt="Politeknik Negeri Banyuwangi"
          className='logo-class'
        />
      </Link>
      <Card className="custom-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
            <Nav.Item>
              <Nav.Link eventKey="detail">Detail Kelas</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="participants">Daftar Peserta</Nav.Link>
            </Nav.Item>
          </Nav>
          <Button variant="link" className="close-button" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </Button>
        </Card.Header>
        <Card.Body>
          {activeTab === 'detail' ? (
            <>
              {selectedClass && (
                <div className="class-details">
                  <p><strong>Nama Kelas:</strong> {selectedClass.name}</p>
                  <p><strong>Jadwal:</strong> {selectedClass.schedule}</p>
                  <p><strong>Deskripsi:</strong> {selectedClass.description}</p>
                  <p><strong>Quota:</strong> {selectedClass.quota}</p>
                </div>
              )}
              {!isRegistered && !classExpired && canRegister && (
                <Button className="register-button" onClick={handleDaftarClick}>Daftar</Button>
              )}
              {!isRegistered && classExpired && (
                <p className="text-danger">Kelas ini sudah berakhir. Anda tidak dapat mendaftar lagi.</p>
              )}
              {!isRegistered && !canRegister && (
                <p className="text-danger">Anda masih terdaftar di kelas lain yang belum berakhir.</p>
              )}
              {isRegistered && (
                <>
                  <Button className="registered-button" disabled>Telah Terdaftar</Button>
                  {whatsappLink && (
                    <Button
                      className="whatsapp-button"
                      variant="success"
                      onClick={() => window.open(whatsappLink, '_blank')}
                    >
                      <FaWhatsapp className="whatsapp-icon" /> Join WhatsApp Group
                    </Button>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {participants.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>NIM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant, index) => (
                      <tr key={index}>
                        <td>{participant.name}</td>
                        <td>{participant.nim}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>Belum ada peserta yang terdaftar di kelas ini.</p>
              )}
            </>
          )}
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
}

export default Kelas;
