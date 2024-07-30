import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db, imageDB } from '../API/fire';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../../public/navbar-brand.svg';

function Registrasi() {
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newNIM, setNewNIM] = useState('');
  const [newTempatLahir, setNewTempatLahir] = useState('');
  const [newTanggalLahir, setNewTanggalLahir] = useState('');
  const [newJurusan, setNewJurusan] = useState('');
  const [newProdi, setNewProdi] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [jurusanProdi, setJurusanProdi] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const usersCollectionRef = collection(db, 'pendaftaran');

  useEffect(() => {
    const checkRegistration = async () => {
      const email = localStorage.getItem('username');
      if (email) {
        const q = query(usersCollectionRef, where('email', '==', email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setIsRegistered(true);
        }
      }
    };

    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'jurusanProdi'));
      setJurusanProdi(snapshot.docs.map(doc => doc.data()));
    };

    checkRegistration();
    fetchData();
  }, []);

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    if (image && image.size <= 1048576) { // 1MB = 1048576 bytes
      setSelectedImage(image);
    } else {
      toast.error('Ukuran file maksimal adalah 1MB.');
      setSelectedImage(null);
    }
  };

  const uploadImage = async (image) => {
    try {
      if (!image) {
        return null;
      }

      const storage = imageDB;
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const isFormValid = () => {
    return (
      newName !== '' &&
      newPhone !== '' &&
      newNIM !== '' &&
      newTempatLahir !== '' &&
      newTanggalLahir !== '' &&
      newJurusan !== '' &&
      newProdi !== '' &&
      selectedDate !== '' &&
      selectedImage !== null
    );
  };

  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('id-ID', options);
  };

  const createUser = async () => {
    setLoading(true);
    try {
      const imageUrl = await uploadImage(selectedImage);

      if (!imageUrl) {
        throw new Error('Error uploading image');
      }

      const email = localStorage.getItem('username');
      const registrationDate = new Date();
      const formattedRegistrationDate = formatDate(registrationDate); // Memformat tanggal registrasi
      const registrationYear = registrationDate.getFullYear();
      const imageName = selectedImage.name; // Mengambil nama gambar

      // Gabungkan tempat lahir dan tanggal lahir
      const tempatTanggalLahir = `${newTempatLahir}, ${formatDate(newTanggalLahir)}`;

      await addDoc(usersCollectionRef, {
        name: newName,
        phone: newPhone,
        nim: newNIM,
        tempatTanggalLahir: tempatTanggalLahir,
        jurusan: newJurusan,
        prodi: newProdi,
        imageUrl: imageUrl,
        imageId: imageName, // Menyimpan nama gambar sebagai imageId
        email: email,
        registrationDate: formattedRegistrationDate, // Menyimpan tanggal registrasi dalam format yang benar
        registrationYear: registrationYear.toString(),
        tanggalPembayaran: formatDate(selectedDate)
      });

      setNewName('');
      setNewPhone('');
      setNewNIM('');
      setNewTempatLahir('');
      setNewTanggalLahir('');
      setNewJurusan('');
      setNewProdi('');
      setSelectedImage(null);
      setSelectedDate('');

      toast.success('Data berhasil disimpan.');

      setTimeout(() => {
        navigate('/pendaftaran');
      }, 2000);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error('Error submitting data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const uniqueJurusan = [...new Set(jurusanProdi.map(item => item.jurusan))];
  const filteredProdi = jurusanProdi
    .filter(item => item.jurusan === newJurusan)
    .map(item => item.prodi);

  if (isRegistered) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: '150vh' }}>
        <Card
          className='mb-2'
          style={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '25px',
            padding: '20px',
            transition: 'margin-top 500ms',
          }}
        >
          <Card.Body style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', fontStyle: 'revert' }}>Anda sudah terdaftar.</h1>
            <Button onClick={() => navigate('/pendaftaran')}>Kembali ke Beranda</Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <img
        src={Logo}
        alt="Politeknik Negeri Banyuwangi"
        className='poltek-logo'
      />
      
      <div className="container d-flex justify-content-center align-items-center" style={{ height: '150vh' }}>
        <Card
          className='mb-2'
          style={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '25px',
            padding: '20px',
            transition: 'margin-top 500ms',
          }}
        >
          <Card.Body style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '1.5rem', fontStyle: 'revert' }}>Silahkan Mengisi Form Pendaftaran</h1>
            <Form>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Nama</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Masukkan nama" 
                  value={newName} 
                  onChange={(event) => setNewName(event.target.value)} 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label>Nomor WhatsApp</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Masukkan nomor WhatsApp" 
                  value={newPhone} 
                  onChange={(event) => setNewPhone(event.target.value)} 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formNIM">
                <Form.Label>NIM</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Masukkan NIM" 
                  value={newNIM} 
                  onChange={(event) => setNewNIM(event.target.value)} 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formTempatLahir">
                <Form.Label>Tempat Lahir</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Masukkan tempat lahir" 
                  value={newTempatLahir} 
                  onChange={(event) => setNewTempatLahir(event.target.value)} 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formTanggalLahir">
                <Form.Label>Tanggal Lahir</Form.Label>
                <Form.Control 
                  type="date" 
                  value={newTanggalLahir} 
                  onChange={(event) => setNewTanggalLahir(event.target.value)} 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formJurusan">
                <Form.Label>Jurusan</Form.Label>
                <Form.Select 
                  value={newJurusan} 
                  onChange={(event) => setNewJurusan(event.target.value)} 
                  >
                    <option value="">Pilih Jurusan...</option>
                    {uniqueJurusan.map((jurusan, index) => (
                      <option key={index} value={jurusan}>{jurusan}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

              <Form.Group className="mb-3" controlId="formProdi">
                <Form.Label>Prodi</Form.Label>
                <Form.Select 
                  value={newProdi} 
                  onChange={(event) => setNewProdi(event.target.value)} 
                  >
                    <option value="">Pilih Prodi...</option>
                    {filteredProdi.map((prodi, index) => (
                      <option key={index} value={prodi}>{prodi}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
  
                <Form.Group className="mb-3" controlId="formTanggalPembayaran">
                  <Form.Label>Tanggal Pembayaran</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                    />
                  </Form.Group>
    
                  <Form.Group className="mb-3" controlId="formImage">
                    <Form.Label>Unggah Bukti Pembayaran</Form.Label>
                    <Form.Control 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                    />
                  </Form.Group>
    
                  <Button 
                    onClick={createUser} 
                    disabled={!isFormValid() || loading} 
                    style={{ fontSize: '14px', width: '99px' }}
                  >
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Tambah +'}
                  </Button>
                </Form>
            </Card.Body>
          </Card>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
        <div className="footer" style={{ backgroundColor: '#232858f6', color: 'white', padding: '20px', textAlign: 'center', marginBottom: '0px', marginTop:'70px'}}>
        © 2024 Sistem Pendaftaran TOEIC. All rights reserved.
      </div>
    </div>
     
    );
  }
  
  export default Registrasi;
