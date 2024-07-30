import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faClock, faBars, faChartBar, faCertificate, faUserEdit, faCheckSquare, faMoneyCheckAlt, faFileAlt, faCheckCircle, faUserPlus, faEnvelope, faKey, faUserCheck, faSignInAlt, faArrowRight  } from '@fortawesome/free-solid-svg-icons'; 
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import './info.css';
import Button from 'react-bootstrap/Button';
import { Accordion } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Example({ handleShow, handleClose, show }) {
  return (
    <div>
      <Button variant="link" onClick={handleShow} className="burger-icon">
        <FontAwesomeIcon icon={faBars} style={{ fontSize: '26px' }} />
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="start" style={{ width: '250px' }}>
        <Offcanvas.Header closeButton>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <nav>
            <ul className="menu-list">
              <li><Link to="/" onClick={handleClose}><FontAwesomeIcon icon={faChartBar} style={{ color: 'black' }} />{' '}<span className="menu-text">Dashboard</span></Link></li>
              <li><Link to="/pendaftaran" onClick={handleClose}><FontAwesomeIcon icon={faUserPlus} style={{ color: 'black' }} />{' '}<span className="menu-text">Pendaftaran</span></Link></li>
              <li><Link to="/sertifikat" onClick={handleClose}><FontAwesomeIcon icon={faCertificate} style={{ color: 'black' }} />{' '}<span className="menu-text">Sertifikat</span></Link></li>
            </ul>
          </nav>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

function Dash() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = async () => {
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_nim');

    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('Logout successful');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className='info-body'>
      <div className="hero-container">
        
        <div className="hero-content">
          <h1>Selamat Datang di Sistem Pendaftaran TOEIC</h1>
          <p>Perjalanan Anda menuju kesuksesan dimulai di sini.</p>
          <Link to="/login">
            <Button variant="primary" className="custom-button">Daftar</Button>
          </Link>
        </div>
      </div>

      <div className="burger-container">
        <Example handleShow={handleShow} handleClose={handleClose} show={show} />
      </div>

      <div className="card-icon">
        <div className="arrow-icon">
          <Link to="/">
            <FontAwesomeIcon icon={faUserPlus} className="icon-spacing icon-size" />
          </Link>
          <Link to="/form-pendaftaran">
            <FontAwesomeIcon icon={faKey} className="icon-spacing icon-size" />
          </Link>
          <Link to="/">
            <FontAwesomeIcon icon={faUserCheck} className="icon-spacing icon-size" />
          </Link>
          <Link to="/form-pendaftaran">
            <FontAwesomeIcon icon={faMoneyCheckAlt} className="icon-spacing icon-size" />
          </Link>
          <Link to="/form-pendaftaran">
            <FontAwesomeIcon icon={faFileAlt} className="icon-spacing icon-size" />
          </Link>
          <Link to="/">
            <FontAwesomeIcon icon={faSignInAlt} className="icon-spacing icon-size" />
          </Link>
          <Link to="/form-pendaftaran">
            <FontAwesomeIcon icon={faCheckCircle} className="icon-spacing icon-size" />
          </Link>
        </div>
      </div>

      <div className="tentang-container">
        <div className="terms-content">
          <img src="https://poliwangi.ac.id/wp-content/uploads/brizy/imgs/poliwangi_img_1-677x451x75x68x555x370x1642688627.jpg" alt="Gambar TOEIC" />
        </div>
        <div className="tentang-right">
          <h2>Tentang Kami</h2>
          <p>
            Unit Pelaksana Teknis (UPT) Bahasa Politeknik Negeri Banyuwangi adalah lembaga yang berfokus pada pengembangan kemampuan bahasa mahasiswa untuk mendukung keberhasilan akademik dan profesional mereka di tingkat global. Kami menawarkan program pengajaran bahasa Inggris yang terintegrasi dengan kurikulum utama, mempersiapkan mahasiswa untuk menghadapi tuntutan dunia kerja yang semakin kompetitif. Melalui pendekatan yang inovatif dan berorientasi pada praktik, UPT Bahasa Politeknik Negeri Banyuwangi berkomitmen untuk menjadi mitra dalam perjalanan pendidikan mahasiswa, memastikan mereka siap menghadapi tantangan global dengan percaya diri dan keberanian.
          </p>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Visi</Accordion.Header>
              <Accordion.Body>
                TOEIC (Test of English for International Communication) adalah tes yang mengukur kemampuan bahasa Inggris sehari-hari orang-orang yang bekerja di lingkungan internasional.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Misi</Accordion.Header>
              <Accordion.Body>
                TOEIC (Test of English for International Communication) adalah tes yang mengukur kemampuan bahasa Inggris sehari-hari orang-orang yang bekerja di lingkungan internasional.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>

      <div className="masuk-container">
        <div className="masuk-right">
          <h2>Daftarkan Dirimu Sekarang</h2>
          <p>Untuk mengukur dan menilai kemampuan bahasa Inggris sehari-hari individu dalam konteks komunikasi internasional.</p>
          <Link to="/login">
            <Button variant="primary" className="masuk-button" style={{ width: '200px', height: '40px' }}>Daftar Peserta TOEIC</Button>
          </Link>
        </div>
        <div className="terms-content">
          <img src="https://informatika.poliwangi.ac.id/assets/frontend/assets/img/cta-new.svg" alt="Gambar TOEIC" />
        </div>
      </div>

      <div className="terms-container">
        <div className="terms-content">
          <img src="https://res.cloudinary.com/ddopxmo7q/image/upload/v1720566363/patient_forms_drib_lrg_jpg_by_Josh_Warren_koa7si.jpg" alt="Gambar TOEIC" />
        </div>
        <div className="terms-right">
          <h2>Syarat dan Ketentuan TOEIC:</h2>
          <ul>
            <li>1. Mahasiswa Politeknik Negeri Banyuwangi.</li>
            <li>2. Peserta diharapkan membawa kartu identitas resmi pada hari tes.</li>
            <li>3. Waktu pengerjaan tes adalah 2 jam.</li>
            <li>4. Hasil tes akan dinyatakan dalam bentuk skor TOEIC yang berlaku selama 2 tahun.</li>
          </ul>
        </div>
      </div>

      <div className="flow-container">
        <h2 className='alur'>Alur Pendaftaran TOEIC:</h2>
        <ul className="flow-list">
          <li><FontAwesomeIcon icon={faCheckSquare} style={{ color: 'blue' }} />{' '} <span className="flow-text">Registrasi online melalui portal mahasiswa.</span></li>
          <li><FontAwesomeIcon icon={faCheckSquare} style={{ color: 'blue' }} />{' '} <span className="flow-text">Melengkapi data diri dan upload dokumen pendukung.</span></li>
          <li><FontAwesomeIcon icon={faCheckSquare} style={{ color: 'blue' }} />{' '} <span className="flow-text">Pembayaran biaya pendaftaran TOEIC.</span></li>
          <li><FontAwesomeIcon icon={faCheckSquare} style={{ color: 'blue' }} />{' '} <span className="flow-text">Konfirmasi pembayaran melalui portal mahasiswa.</span></li>
          <li><FontAwesomeIcon icon={faCheckSquare} style={{ color: 'blue' }} />{' '} <span className="flow-text">Mengikuti sesi tes sesuai jadwal yang ditentukan.</span></li>
          <li><FontAwesomeIcon icon={faCheckSquare} style={{ color: 'blue' }} />{' '} <span className="flow-text">Menerima hasil tes melalui portal mahasiswa.</span></li>
        </ul>
      </div>
      
        
        <div className="footer" style={{ backgroundColor: '#232858f6', color: 'white', padding: '20px', textAlign: 'center', marginBottom: '0px', marginTop:'70px'}}>
        © 2024 Sistem Pendaftaran TOEIC. All rights reserved.
        </div>
    </div>
  );
}

export default Dash;
