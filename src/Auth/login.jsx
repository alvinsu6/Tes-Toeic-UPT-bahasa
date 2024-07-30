import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth, db } from '../API/fire'; // Pastikan auth dan db diekspor dari file ini
import { collection, query, where, getDocs } from 'firebase/firestore';
import "./style.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null); // State untuk pesan kesalahan login
  const [showGoogleAlert, setShowGoogleAlert] = useState(true);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGoogleAlert(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Login menggunakan Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Simpan data pengguna ke localStorage
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('username', email);
      localStorage.setItem('isAuthenticated', 'true');

      setLoginError(null); // Reset error state

      // Cek apakah email ada di database akun dan ambil rolenya
      const akunCollectionRef = collection(db, 'akun');
      const q = query(akunCollectionRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const userRole = userData.role;

        if (userRole === 'admin') {
          localStorage.setItem('role', userRole);
          toast.success('Login berhasil!');
          navigate('/dashboard-admin');
          return;
        }
      }

      // Jika bukan admin, arahkan pengguna sesuai dengan data pendaftaran
      const pendaftaranCollectionRef = collection(db, 'pendaftaran');
      const qPendaftaran = query(pendaftaranCollectionRef, where('email', '==', email));
      const pendaftaranSnapshot = await getDocs(qPendaftaran);

      if (pendaftaranSnapshot.empty) {
        toast.success('Login berhasil!');
        navigate('/form-pendaftaran');
      } else {
        const pendaftaranData = pendaftaranSnapshot.docs[0].data();
        if (
          pendaftaranData.name &&
          pendaftaranData.phone &&
          pendaftaranData.alamat &&
          pendaftaranData.nim &&
          pendaftaranData.tempatTanggalLahir &&
          pendaftaranData.jurusan &&
          pendaftaranData.tanggalPembayaran
        ) {
          toast.success('Login berhasil!');
          navigate('/pendaftaran');
        } else {
          toast.success('Login berhasil!');
          navigate('/form-pendaftaran');
        }
      }
    } catch (error) {
      console.log(error.code);

      // Handle specific error messages for login
      switch (error.code) {
        case 'auth/invalid-email':
          setLoginError('Format email tidak valid.');
          break;
        case 'auth/user-disabled':
          setLoginError('Akun telah dinonaktifkan.');
          break;
        case 'auth/user-not-found':
          setLoginError('Email tidak terdaftar.');
          break;
        case 'auth/wrong-password':
          setLoginError('Password salah.');
          break;
        case 'auth/invalid-credential':
          setLoginError('Email atau password salah.');
          break;
        case 'auth/too-many-requests':
          setLoginError('Terlalu banyak percobaan login. Silakan coba lagi nanti.');
          break;
        default:
          setLoginError('Terjadi kesalahan. Silakan coba lagi.');
          break;
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Simpan data pengguna ke localStorage
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('username', user.email);
      localStorage.setItem('isAuthenticated', 'true');

      setLoginError(null); // Reset error state

      // Cek apakah email ada di database akun dan ambil rolenya
      const akunCollectionRef = collection(db, 'akun');
      const q = query(akunCollectionRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const userRole = userData.role;

        if (userRole === 'admin') {
          localStorage.setItem('role', userRole);
          toast.success('Login berhasil!');
          navigate('/dashboard-admin');
          return;
        }
      }

      // Jika bukan admin, arahkan pengguna sesuai dengan data pendaftaran
      const pendaftaranCollectionRef = collection(db, 'pendaftaran');
      const qPendaftaran = query(pendaftaranCollectionRef, where('email', '==', user.email));
      const pendaftaranSnapshot = await getDocs(qPendaftaran);

      if (pendaftaranSnapshot.empty) {
        toast.success('Login berhasil!');
        navigate('/form-pendaftaran');
      } else {
        const pendaftaranData = pendaftaranSnapshot.docs[0].data();
        if (
          pendaftaranData.name &&
          pendaftaranData.phone &&
          // pendaftaranData.alamat &&
          pendaftaranData.nim &&
          pendaftaranData.tempatTanggalLahir &&
          pendaftaranData.jurusan &&
          pendaftaranData.tanggalPembayaran
        ) {
          toast.success('Login berhasil!');
          navigate('/pendaftaran');
        } else {
          toast.success('Login berhasil!');
          navigate('/form-pendaftaran');
        }
      }
    } catch (error) {
      console.log(error.code);
      setLoginError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  return (
    <div className="login-body">
      {showGoogleAlert && (
        <Alert variant="info" style={{ position: 'fixed', top: 10, left: 10, zIndex: 1000 }}>
          Silakan login menggunakan akun Google Anda.
        </Alert>
      )}
      <>
        <div className="logo-login">
          <img src="https://res.cloudinary.com/ddopxmo7q/image/upload/v1715946407/log-removebg-preview_ispw70.png" alt="Logo" />
        </div>
        <div className="logo-conten">
          <h1>Selamat Datang di Sistem Pendaftaran TOEIC!</h1>
          <p>UPT Bahasa dan Budaya Politeknik Negeri Banyuwangi</p>
        </div>
        <Card style={{ minWidth: "25rem", width: "25rem", marginLeft: "auto", marginRight: "auto", borderRadius: '15px' }} className="mt-5">
          <Card.Body style={{ minWidth: "20rem" }}>
            <Card.Title>
              <h2 style={{ textAlign: 'center', fontFamily: 'sans-serif', fontWeight: 'bolder' }}>Silahkan Login</h2>
            </Card.Title>
            <Form>
              <Form.Group controlId="formEmail">
                <Form.Control type="email" placeholder="Username" onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>

              {loginError && <Alert variant="danger">{loginError}</Alert>}

              <Button variant="primary" type="submit" onClick={handleLogin} className="mt-3">
                Login
              </Button>
              <Button variant="outline-danger" type="button" onClick={handleGoogleLogin} className="mt-3" style={{ marginLeft: '10px' }}>
                <i className="fab fa-google" style={{ marginLeft: '8px' }}></i>
                Sign in with Google
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </>
    </div>
  );
};

export default Login;
