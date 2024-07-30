import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './dahboard';
import JPelatihan from './j-Pelatihan/JadwalPelatihan';
import JUjian from './jadwal/JadwalUjian';
import Regis from './Auth/register';
import Admin from './Admin/com-admin';
import ClassAdmin from './Admin/classAdmin';
import GoogleLogin from './Auth/login';
import ClassDetail from "./pendaftaran/ClassDetail";
import DashSertif from "./sertifikat/DashSertif";
import Terdaftar from "./pendaftaran/terdaftar";
import UploadCertificateAdmin from "./Admin/UploadCertificateAdmin";
import FormPendaftaran from "./pendaftaran/FormPendaftaran";
import Info from './info';
import ProtectedRoute from './Auth/Protect';
import DashboardAdmin from './Admin/DashboardAdmin';
import Unauthorized from './Auth/unauth';
import Jurusan from './Admin/jurusan'

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/login" element={<GoogleLogin />} />
      <Route path="/form-pendaftaran" element={<ProtectedRoute component={FormPendaftaran} />} />
      <Route path="/register" element={<Regis />} />
      <Route path="/pendaftaran" element={<ProtectedRoute component={Dashboard} />} />
      <Route path="/" element={<Info />} />
      <Route path="/sertifikat" element={<ProtectedRoute component={DashSertif} />} />
      <Route path="/class/:id" element={<ProtectedRoute component={ClassDetail} />} />
      <Route path="/terdaftar-class/:id" element={<ProtectedRoute component={Terdaftar} />} />
      <Route path="/jadwal-pelatihan" element={<JPelatihan />} />
      <Route path="/jadwal-ujian" element={<JUjian />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      <Route path="/admin" element={<ProtectedRoute component={Admin} requiredRole="admin" />} />
      <Route path="/jurusan" element={<ProtectedRoute component={Jurusan} requiredRole="admin" />} />
      <Route path="/dashboard-admin" element={<ProtectedRoute component={DashboardAdmin} requiredRole="admin" />} />
      <Route path="/class-admin" element={<ProtectedRoute component={ClassAdmin} requiredRole="admin" />} />
      <Route path="/upload-sertifikat" element={<ProtectedRoute component={UploadCertificateAdmin} requiredRole="admin" />} />
    </Routes>
  </Router>
  );
}

export default App;
