import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserPlus, faCalendarAlt, faCertificate, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 
import Logo from '../public/navbar-brand.svg';
import CardClass from './pendaftaran/com-daftar';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

function Dashboard() {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({ name: '', avatar: '' });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setUser({ name: userData.displayName});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('selectedClass'); 
    navigate('/');
  };

  return (
    <div>
      <br />
      <div className="d-flex justify-content-between align-items-center">
        <FontAwesomeIcon icon={faBars} onClick={handleShow} className='burger-icon' />
        <img
          src={Logo}
          alt="Politeknik Negeri Banyuwangi"
          className='poltek-logo'
        />
        {/* <div className="user-info d-flex align-items-center">
          
          <span className='user-name'>{user.name}</span>
        </div> */}
      </div>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img
              src={Logo}
              alt="Politeknik Negeri Banyuwangi"
              className='poltek-logo'
            />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="menu-list">
            <li>
              <FontAwesomeIcon icon={faUserPlus} className="menu-icon" />
              <a href="/">Dashboard</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faUserPlus} className="menu-icon" />
              <a href="/pendaftaran">Pendaftaran</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faCertificate} className="menu-icon" />
              <a href="/sertifikat">Unduh Sertifikat</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" />
              <a href='' onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
      <div>
        <CardClass />
      </div>
       {/* Footer */}
    <div className="footer" style={{ backgroundColor: '#232858f6', color: 'white', padding: '20px', textAlign: 'center', marginBottom: '0px', marginTop:'70px'}}>
        © 2024 Sistem Pendaftaran TOEIC. All rights reserved.
      </div>
    </div>
  );
}

export default Dashboard;
