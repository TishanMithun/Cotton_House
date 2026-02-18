import React, { useState } from 'react';
import './AdminRegister.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

function AdminRegister() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    phone: '',
    postalCode: '',
    role: 'Admin'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:3006/api/auth/register', formData);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Admin registered successfully',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        setFormData({
          userName: '',
          email: '',
          password: '',
          phone: '',
          postalCode: '',
          role: 'Admin'
        });
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.message || 'Something went wrong. Please try again.',
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page d-flex align-items-center justify-content-center min-vh-100 bg-light animate__animated animate__fadeInDown">
      <div className="card register-card shadow-lg">
        <div className="card-body p-5">
          <h3 className="mb-4 text-center text-black">Register an Admin Account</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="userName" className="form-label">Username <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><FaUser /></span>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="form-control filter-select animate__animated animate__zoomIn"
                  placeholder="Enter username"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><FaEnvelope /></span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control filter-select animate__animated animate__zoomIn"
                  placeholder="Enter email"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">Password <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><FaLock /></span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control filter-select animate__animated animate__zoomIn"
                  placeholder="Enter password"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="phone" className="form-label">Telephone <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><FaPhone /></span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control filter-select animate__animated animate__zoomIn"
                  placeholder="e.g. +94 712345678"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label htmlFor="postalCode" className="form-label">Postal Code <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><FaMapMarkerAlt /></span>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="form-control filter-select animate__animated animate__zoomIn"
                  placeholder="Enter postal code"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-primary btn-custom btn-lg animate__animated animate__pulse animate__infinite"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner me-2"></span>
                    Registering...
                  </>
                ) : (
                  'Register Admin'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;