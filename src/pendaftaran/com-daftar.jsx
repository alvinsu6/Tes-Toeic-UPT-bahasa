import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../API/fire';
import { Card, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Pendaftaran.css';

function User() {
  const [classes, setClasses] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [verifiedClass, setVerifiedClass] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesCollectionRef = collection(db, 'classes');
        const classesSnapshot = await getDocs(classesCollectionRef);
        const classesData = classesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setClasses(classesData);

        const pendaftaranCollectionRef = collection(db, 'pendaftaran');
        const registrationsSnapshot = await getDocs(pendaftaranCollectionRef);
        const registrationsData = {};
        let userVerifiedClass = null;

        registrationsSnapshot.forEach((doc) => {
          const registration = doc.data();
          if (!registrationsData[registration.classId]) {
            registrationsData[registration.classId] = { count: 1, verified: registration.verified };
          } else {
            registrationsData[registration.classId].count++;
            registrationsData[registration.classId].verified = registration.verified;
          }

          // Periksa apakah pengguna saat ini sudah terverifikasi
          const currentUser = localStorage.getItem('user_nim'); // Mengasumsikan user_nim disimpan di localStorage
          if (registration.nim === currentUser && registration.verified) {
            userVerifiedClass = registration.classId;
          }
        });

        setRegistrations(registrationsData);
        setVerifiedClass(userVerifiedClass);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCheckQuota = (classId, quota) => {
    const count = registrations[classId]?.count || 0;
    return count < quota;
  };

  const handleEnterClass = (kelas) => {
    localStorage.setItem('selectedClass', JSON.stringify(kelas));
    navigate(`/class/${kelas.id}`);
  };

  return (
    <div className='user-body' style={{ paddingLeft: '30px', paddingRight: '30px' }}>
      <h2 style={{ textAlign: 'center', fontFamily: 'sans-serif', fontSize: '35px', fontWeight: 'bold' }}>Daftar Kelas</h2>
      <p style={{ textAlign: 'center', fontFamily: 'sans-serif', fontSize: '16px', color:'grey' }}>Daftar kelas Test of English International Communication UPT Bahasa Politeknik Negeri Banyuwangi</p>
      <div className="row justify-content-center">
        {classes.map((kelas) => (
          <Col key={kelas.id} xs={12} md={6} lg={4} xl={3}>
            <Card className="card-hover" style={{ width: '100%' , marginTop:'20px', border: 'solid 1px grey'}}>
              <Card.Body>
                <Card.Header>
                  <Card.Title style={{ textAlign: 'center' }}>{kelas.name}</Card.Title>
                </Card.Header>
                <Card.Text>
                  <strong>Keterangan:</strong> {kelas.description}
                </Card.Text>
                <Card.Text>
                  <strong>Jumlah Pendaftar:</strong> {registrations[kelas.id]?.count || 0}
                </Card.Text>
                {!handleCheckQuota(kelas.id, kelas.quota) && !registrations[kelas.id]?.verified && verifiedClass !== kelas.id ? (
                  <div style={{ border: '5px', color: 'red' }}>Kelas Penuh</div>
                ) : (
                  <Button variant="primary" onClick={() => handleEnterClass(kelas)}>Masuk Kelas</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </div>
    </div>
  );
}

export default User;
