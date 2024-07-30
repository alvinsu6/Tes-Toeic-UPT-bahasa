import React, { useState, useEffect } from 'react';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../API/fire';
import { Table } from 'react-bootstrap';
import Logo from '../../public/navbar-brand.svg';

function Terdaftar() {
  const [registrants, setRegistrants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedClass = localStorage.getItem('selectedClass');
        if (!storedClass) {
          throw new Error('Kelas belum dipilih.');
        }
        const parsedClass = JSON.parse(storedClass);

        const registrantsCollectionRef = collection(db, 'pendaftaran');
        const q = query(registrantsCollectionRef, where('classId', '==', parsedClass.id));
        const registrantsSnapshot = await getDocs(q);
        const registrantsData = registrantsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRegistrants(registrantsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching registrants:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div >
     <img
        src={Logo}
        alt="Politeknik Negeri Banyuwangi"
        className='poltek-logo'
      />
      <h2 style={{ textAlign: 'center' }}>Data Pendaftar</h2>
      <Table striped bordered hover className='container'>
        <thead style={{textAlign:'center'}}>
          <tr>
            <th>Nama</th>
        
            <th>Jurusan</th>
            {/* Tambah kolom lain jika diperlukan */}
          </tr>
        </thead>
        <tbody>
          {registrants.map((registrant) => (
            <tr key={registrant.id}>
              <td>{registrant.name}</td>
            
              <td>{registrant.jurusan}</td>
              {/* Tambah kolom lain jika diperlukan */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Terdaftar;
