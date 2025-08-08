import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import Hero from './Hero';
import Stats from './Stats';
import Features from './Features';
import FAQ from './FAQ';
import Footer from './Footer';
import Daftar from './auth/Daftar';
import Login from './auth/Login';
import ForgotPassword from './auth/LupaPassword';
import PelajariSelengkapnya from './public/PelajariSelengkapnya';
import Dashboard from './user/Dashboard';
import Verifikasi from './auth/Verifikasi';
import AccountSettings from './user/AccountSettings';
import ResetPasswordOtp from './auth/ResetPasswordOtp';
import SetNewPassword from './auth/SetNewPassword';
import FormLaporan from './user/FormLapor';

// Admin components
import LoginAdmin from './admin/LoginAdmin';
import AdminDashboard from './admin/AdminDashboard';
import SidebarAdmin from './admin/Sidebar';
import HeaderAdmin from './admin/Header';
import StatsGrid from './admin/StatsGrid';
import ReportsTable from './admin/ReportsTable';
import ReportDetailModal from './admin/ReportDetailModal';
import PhotoUpload from './admin/PhotoUpload';
import LocationCapture from './admin/LocationCapture';
import AdminStatistics from './admin/AdminStatistics';

function MainPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Hero />
      <Features />
      <Stats />
      <FAQ />
      <Footer />
    </div>
  );
}

function App() {
  const handleUpdateUser = (updatedUser) => {
    console.log('User updated:', updatedUser);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <ToastContainer position="top-center" autoClose={2000} />
        <Routes>
          {/* Landing & Auth routes with Navbar */}
          <Route path="/" element={<><Navbar /><MainPage /></>} />
          <Route path="/auth/daftar" element={<><Navbar /><Daftar /></>} />
          <Route path="/auth/login" element={<><Navbar /><Login /></>} />
          <Route path="/auth/lupa-password" element={<><Navbar /><ForgotPassword /></>} />
          <Route path="/auth/verifikasi" element={<><Navbar /><Verifikasi /></>} />
          <Route path="/pelajari-selengkapnya" element={<><Navbar /><PelajariSelengkapnya /></>} />

          {/* User routes WITHOUT Navbar */}
          <Route
            path="/user/dashboard"
            element={
              <div className="min-h-screen flex flex-col bg-white">
                <Dashboard
                  activeTab="home"
                  onUpdateUser={handleUpdateUser}
                />
              </div>
            }
          />
          <Route
            path="/user/account-settings"
            element={
              <div className="min-h-screen flex flex-col bg-white">
                <AccountSettings onUpdateUser={handleUpdateUser} />
              </div>
            }
          />
          <Route path="/auth/reset-password-otp" element={<ResetPasswordOtp />} />
          <Route path="/auth/set-new-password" element={<SetNewPassword />} />
          <Route path="/user/formlaporan" element={<FormLaporan />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/stats" element={<StatsGrid />} />
          <Route path="/admin/reports" element={<ReportsTable />} />
          <Route path="/admin/report-detail" element={<ReportDetailModal />} />
          <Route path="/admin/photo-upload" element={<PhotoUpload />} />
          <Route path="/admin/location-capture" element={<LocationCapture />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;