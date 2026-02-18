import React, { useState } from 'react';
import './LoginPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import Logo from '../Images/Logo.png'
import Swal from 'sweetalert2';

function LoginPage() {
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3006/api/auth/login', formData);
     
      window.location.href = '/ClothingGallery'; // Navigate to clothing gallery or dashboard

      // Optionally store token or user info in localStorage
      localStorage.setItem('token', res.data.token);
      
    } catch (err) {
      
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Left image */}
        <div className="login-image">
          <div className="overlay">
            <h2 className="fw-bold">Style & Comfort</h2>
            <p className="text-white-50">Login to your fashion dashboard</p>
          </div>
        </div>

        {/* Right form */}
        <div className="right-form">
       <div className="d-flex justify-content-center">
  <img 
    src={Logo} 
    alt="Cotton Manthra" 
    className="img-fluid mb-4" 
    style={{ width: '100px', height: '100px' }} 
  />
</div>

          <h3 className="mb-4 text-center" style={{ color: 'black' }}>COTTON HOUSE</h3>
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="form-group mb-3">
              <label className="form-label">Username</label>
              <div className="input-group">
                <span className="input-group-text"><FaUser /></span>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text"><FaLock /></span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg">Login</button>
            </div>

            <div className="text-center mt-4">
  <p className="mb-0">
    New user?{' '}
    <a href="/UserRegistration" style={{ textDecoration: 'underline', color: '#007bff' }}>
      Register here
    </a>
  </p>
</div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
