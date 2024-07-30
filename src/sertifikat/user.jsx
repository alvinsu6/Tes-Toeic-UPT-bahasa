import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../API/fire';
import { useNavigate } from 'react-router-dom';
import './CertificatePage.css'; // Import file CSS untuk styling

function CertificatePage() {
  const [certificates, setCertificates] = useState([]);
  const email = localStorage.getItem('username'); // Ambil email dari localStorage
  const navigate = useNavigate(); // Hook untuk navigasi

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!email) {
        console.error('No email found in localStorage');
        return;
      }

      try {
        const certificatesCollectionRef = collection(db, 'pendaftaran');
        const q = query(certificatesCollectionRef, where('email', '==', email));
        const snapshot = await getDocs(q);
        const certificatesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCertificates(certificatesData);
      } catch (error) {
        console.error('Error fetching certificates: ', error);
      }
    };

    fetchCertificates();
  }, [email]);

  const handleClose = () => {
    navigate('/pendaftaran');
  };

  return (
    <div className="certificate-page-container">
      <div className="certificate-container">
        <Button variant="link" className="close-button" onClick={handleClose}>
          <i className="fas fa-times"></i>
        </Button>
        <h2 className="certificate-title">Sertifikat</h2>
        <div className="certificate-list">
          {certificates.map(certificate => (
            <div key={certificate.id} className="certificate-item">
              <p className="certificate-name">{certificate.name}</p>
              {certificate.certificateUrl ? (
                <a href={certificate.certificateUrl} className="certificate-link" target="_blank"
                 rel="noopener noreferrer">Lihat Sertifikat</a>
              ) : (
                <span className="certificate-not-uploaded">Belum diunggah</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CertificatePage;
