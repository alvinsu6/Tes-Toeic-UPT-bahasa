import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../API/fire';
import { Form, Button, Table, Container, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBars, FaChartBar, FaUser, FaClipboardList, FaCertificate, FaSignOutAlt, FaBook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../public/navbar-brand.svg';
import './admin.css'; // Custom CSS file

function ManageJurusanProdi() {
  const [jurusan, setJurusan] = useState('');
  const [prodi, setProdi] = useState('');
  const [data, setData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate(); // Menggunakan useNavigate untuk navigasi

  const collectionRef = collection(db, 'jurusanProdi');

  const fetchData = async () => {
    const snapshot = await getDocs(collectionRef);
    setData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (jurusan && prodi) {
      await addDoc(collectionRef, { jurusan, prodi });
      setJurusan('');
      setProdi('');
      fetchData();
      toast.success('Data berhasil ditambahkan');
    } else {
      toast.error('Jurusan dan Prodi tidak boleh kosong');
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'jurusanProdi', id));
    fetchData();
    toast.success('Data berhasil dihapus');
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
        <Container className="mt-4">
          <h2>Kelola Jurusan dan Prodi</h2>
          <Form>
            <Form.Group controlId="formJurusan">
              <Form.Label>Jurusan</Form.Label>
              <Form.Control
                type="text"
                value={jurusan}
                onChange={(e) => setJurusan(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formProdi">
              <Form.Label>Prodi</Form.Label>
              <Form.Control
                type="text"
                value={prodi}
                onChange={(e) => setProdi(e.target.value)}
              />
            </Form.Group>
            <br />
            <Button onClick={handleAdd}>Tambah</Button>
          </Form>
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Jurusan</th>
                <th>Prodi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.jurusan}</td>
                  <td>{item.prodi}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDelete(item.id)}>Hapus</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
        </Container>
      </div>
    </div>
  );
}

export default ManageJurusanProdi;
