import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Card, Row, Col, Container, Form } from 'react-bootstrap';
import { db } from '../API/fire';
import { Bar } from 'react-chartjs-2';
import { FaBars, FaChartBar, FaUser, FaClipboardList, FaCertificate, FaSignOutAlt, FaUsers, FaExclamationCircle, FaCheckCircle, FaBook } from 'react-icons/fa';
import 'chart.js/auto';
import './admin.css';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../public/navbar-brand.svg';

function DashboardAdmin() {
  const [totalRegistrants, setTotalRegistrants] = useState(0);
  const [registrantsByDepartment, setRegistrantsByDepartment] = useState({});
  const [registrantsByProdi, setRegistrantsByProdi] = useState({});
  const [averageScores, setAverageScores] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [satisfyingRegistrants, setSatisfyingRegistrants] = useState(0);
  const [unsatisfyingRegistrants, setUnsatisfyingRegistrants] = useState(0);
  const [chartOption, setChartOption] = useState('jurusan');
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const usersCollectionRef = collection(db, 'pendaftaran');
      const usersData = await getDocs(usersCollectionRef);

      const usersWithIds = usersData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      setTotalRegistrants(usersWithIds.length);

      const registrantsByDept = usersWithIds.reduce((acc, user) => {
        if (user.jurusan) {
          acc[user.jurusan] = (acc[user.jurusan] || 0) + 1;
        }
        return acc;
      }, {});
      setRegistrantsByDepartment(registrantsByDept);

      const registrantsByProd = usersWithIds.reduce((acc, user) => {
        if (user.prodi) {
          acc[user.prodi] = (acc[user.prodi] || 0) + 1;
        }
        return acc;
      }, {});
      setRegistrantsByProdi(registrantsByProd);

      const scoreSumPerJurusan = usersWithIds.reduce((acc, user) => {
        if (!acc[user.jurusan]) {
          acc[user.jurusan] = { totalReading: 0, totalListening: 0, count: 0 };
        }
        acc[user.jurusan].totalReading += user.readingScore || 0;
        acc[user.jurusan].totalListening += user.listeningScore || 0;
        acc[user.jurusan].count += 1;
        return acc;
      }, {});

      const averageScoresPerJurusan = Object.keys(scoreSumPerJurusan).reduce((acc, jurusan) => {
        acc[jurusan] = {
          averageReading: scoreSumPerJurusan[jurusan].totalReading / scoreSumPerJurusan[jurusan].count,
          averageListening: scoreSumPerJurusan[jurusan].totalListening / scoreSumPerJurusan[jurusan].count,
        };
        return acc;
      }, {});

      setAverageScores(averageScoresPerJurusan);

      const satisfyingCount = usersWithIds.filter(user => (user.readingScore + user.listeningScore) >= 450).length;
      const unsatisfyingCount = usersWithIds.filter(user => (user.readingScore + user.listeningScore) < 450 || !user.readingScore || !user.listeningScore).length;

      setSatisfyingRegistrants(satisfyingCount);
      setUnsatisfyingRegistrants(unsatisfyingCount);
    };
    getData();
  }, []);

  useEffect(() => {
    const getDataPerProdi = async () => {
      const usersCollectionRef = collection(db, 'pendaftaran');
      const querySnapshot = await getDocs(usersCollectionRef);

      const dataPerProdi = {};

      querySnapshot.forEach(doc => {
        const { prodi, readingScore, listeningScore } = doc.data();

        if (!dataPerProdi[prodi]) {
          dataPerProdi[prodi] = { totalReading: 0, totalListening: 0, count: 0 };
        }

        dataPerProdi[prodi].totalReading += readingScore || 0;
        dataPerProdi[prodi].totalListening += listeningScore || 0;
        dataPerProdi[prodi].count += 1;
      });

      const averageScoresPerProdi = Object.keys(dataPerProdi).reduce((acc, prodi) => {
        acc[prodi] = {
          averageReading: dataPerProdi[prodi].totalReading / dataPerProdi[prodi].count,
          averageListening: dataPerProdi[prodi].totalListening / dataPerProdi[prodi].count,
        };
        return acc;
      }, {});

      setAverageScores(averageScoresPerProdi);
    };

    if (chartOption === 'prodi') {
      getDataPerProdi();
    } else if (chartOption === 'jurusan') {
      const getData = async () => {
        const usersCollectionRef = collection(db, 'pendaftaran');
        const usersData = await getDocs(usersCollectionRef);

        const usersWithIds = usersData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        const scoreSumPerJurusan = usersWithIds.reduce((acc, user) => {
          if (!acc[user.jurusan]) {
            acc[user.jurusan] = { totalReading: 0, totalListening: 0, count: 0 };
          }
          acc[user.jurusan].totalReading += user.readingScore || 0;
          acc[user.jurusan].totalListening += user.listeningScore || 0;
          acc[user.jurusan].count += 1;
          return acc;
        }, {});

        const averageScoresPerJurusan = Object.keys(scoreSumPerJurusan).reduce((acc, jurusan) => {
          acc[jurusan] = {
            averageReading: scoreSumPerJurusan[jurusan].totalReading / scoreSumPerJurusan[jurusan].count,
            averageListening: scoreSumPerJurusan[jurusan].totalListening / scoreSumPerJurusan[jurusan].count,
          };
          return acc;
        }, {});

        setAverageScores(averageScoresPerJurusan);
      };
      getData();
    }
  }, [chartOption]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const renderAverageScores = () => {
    let data = {};
    let labels = [];
    let datasets = [];

    if (chartOption === 'jurusan') {
      labels = Object.keys(averageScores);
      const averageReadingData = labels.map((jurusan) => averageScores[jurusan]?.averageReading);
      const averageListeningData = labels.map((jurusan) => averageScores[jurusan]?.averageListening);
      const registrantsData = labels.map((jurusan) => registrantsByDepartment[jurusan]);

      datasets = [
        {
          label: 'Rata-rata Reading',
          data: averageReadingData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Rata-rata Listening',
          data: averageListeningData,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
        {
          label: 'Jumlah Pendaftar',
          data: registrantsData,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
          type: 'line',
        },
      ];
    } else if (chartOption === 'prodi') {
      labels = Object.keys(averageScores);
      const averageReadingData = labels.map((prodi) => averageScores[prodi]?.averageReading);
      const averageListeningData = labels.map((prodi) => averageScores[prodi]?.averageListening);
      const registrantsData = labels.map((prodi) => registrantsByProdi[prodi]);

      datasets = [
        {
          label: 'Rata-rata Reading',
          data: averageReadingData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Rata-rata Listening',
          data: averageListeningData,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
        {
          label: 'Jumlah Pendaftar',
          data: registrantsData,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
          type: 'line',
        },
      ];
    }

    data = {
      labels: labels,
      datasets: datasets,
    };

    return (
      <div>
        <h2>Statistik Pendaftar per {chartOption === 'jurusan' ? 'Jurusan' : 'Prodi'}</h2>
        <Bar data={data} />
      </div>
    );
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
          <Row>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Card style={{ backgroundColor: 'grey', color: 'white' }}>
                <Card.Body>
                  <FaUsers style={{ fontSize: '24px', marginBottom: '10px' }} />
                  <Card.Title>Jumlah Pendaftar</Card.Title>
                  <Card.Text>{totalRegistrants}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Card style={{ backgroundColor: 'red', color: 'white' }}>
                <Card.Body>
                  <FaExclamationCircle style={{ fontSize: '24px', marginBottom: '10px' }} />
                  <Card.Title>Tidak Memenuhi</Card.Title>
                  <Card.Text>{unsatisfyingRegistrants}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Card style={{ backgroundColor: 'green', color: 'white' }}>
                <Card.Body>
                  <FaCheckCircle style={{ fontSize: '24px', marginBottom: '10px' }} />
                  <Card.Title>Memenuhi Nilai</Card.Title>
                  <Card.Text>{satisfyingRegistrants}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <Container className="mt-4">
          <Row>
            <Col>
              <Form.Select
                style={{ marginLeft: '10px', borderRadius: '10px' }}
                value={chartOption}
                onChange={(e) => setChartOption(e.target.value)}
              >
                <option value="jurusan">Berdasarkan Jurusan</option>
                <option value="prodi">Berdasarkan Prodi</option>
              </Form.Select>
            </Col>
          </Row>
        </Container>
        <Container className="mt-4">{renderAverageScores()}</Container>
      </div>
    </div>
  );
}

export default DashboardAdmin;
