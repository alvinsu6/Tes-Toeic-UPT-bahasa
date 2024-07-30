import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserPlus, faCalendarAlt, faCertificate, faSignOutAlt  } from '@fortawesome/free-solid-svg-icons'; // Import icons from FontAwesome
import Logo from '../../public/navbar-brand.svg';
import Sertifikat from './user';
import '../dashboard.css'
import { Link } from 'react-router-dom';

function DashSertif() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const handleLogout = () => {
    // Lakukan proses logout di sini (misalnya hapus token atau hapus sesi)
    // Setelah logout, arahkan pengguna ke halaman login atau halaman lain yang sesuai
    // window.location.href = '/login'; // Contoh arahkan ke halaman login
  };
  return (
    <div >
      <br />
      
     
      <Link to="/pendaftaran">
      <img
      
        src={Logo}
        alt="Politeknik Negeri Banyuwangi"
        className='poltek-logo'
      />
      </Link>
     
      <div>
        <br />
        <br />
        <Sertifikat/>
      </div>
       {/* Footer */}
    <div className="footer" style={{ backgroundColor: '#232858f6', color: 'white', padding: '20px', textAlign: 'center', marginTop: '300px'}}>
        © 2024 Sistem Pendaftaran TOEIC. All rights reserved.
      </div>
    </div>
  );
}

export default DashSertif;
