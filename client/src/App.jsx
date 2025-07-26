import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { mockUser, mockStats, mockReports, mockNotifications } from './user/data/mockData';

function MainPage() {
  return (
    <>
      <Hero />
      <Features />
      <Stats />
      <FAQ />
      <Footer />
    </>
  );
}

function App() {
  const handleUpdateUser = (updatedUser) => {
    console.log('User updated:', updatedUser);
  };

  return (
    <Router>
      <div className="min-h-screen">
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
              <Dashboard
                // Ganti mockUser dengan user asli jika sudah ada
                user={mockUser}
                stats={mockStats}
                reports={mockReports}
                notifications={mockNotifications}
                activeTab="home"
                onUpdateUser={handleUpdateUser}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;