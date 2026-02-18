import React, { useState } from 'react';
import './UserRegistration.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

function UserRegistration() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    phone: '',
    postalCode: '',
    address: '',
    role: 'User'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.userName) {
      newErrors.userName = 'Username is required';
    } else if (!/^[a-zA-Z0-9]{3,}$/.test(formData.userName)) {
      newErrors.userName = 'Username must be at least 3 characters and alphanumeric';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+\d{1,3}\s?\d{9,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g., +94 712345678)';
    }

    // Address validation
    if (!formData.address) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    // Postal Code validation
    if (!formData.postalCode) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^[a-zA-Z0-9\s-]{5,10}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Postal code must be 5-10 characters, alphanumeric';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
    // Clear error for the field being edited
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post('http://localhost:3006/api/auth/register', formData);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: res.data.message || 'User registered successfully',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        setFormData({
          userName: '',
          email: '',
          password: '',
          phone: '',
          postalCode: '',
          address: '',
          role: 'User'
        });
        setErrors({});
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
    <div className="register-page d-flex align-items-center justify-content-center min-vh-100 animate__animated animate__fadeInDown">
      <div className="card register-card shadow-lg">
        <div className="card-body p-5">
          <h3 className="mb-4 text-center text-black">Register an Account</h3>
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
                  className={`form-control animate__animated animate__zoomIn ${errors.userName ? 'is-invalid' : ''}`}
                  placeholder="Enter username"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {errors.userName && <div className="invalid-feedback">{errors.userName}</div>}
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
                  className={`form-control animate__animated animate__zoomIn ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter email"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
                  className={`form-control animate__animated animate__zoomIn ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter password"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
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
                  className={`form-control animate__animated animate__zoomIn ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="e.g. +94 712345678"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="form-group mb-3">
              <label htmlFor="address" className="form-label">Address <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><FaMapMarkerAlt /></span>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`form-control animate__animated animate__zoomIn ${errors.address ? 'is-invalid' : ''}`}
                  placeholder="Enter address"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {errors.address && <div className="invalid-feedback">{errors.address}</div>}
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
                  className={`form-control animate__animated animate__zoomIn ${errors.postalCode ? 'is-invalid' : ''}`}
                  placeholder="Enter postal code"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {errors.postalCode && <div className="invalid-feedback">{errors.postalCode}</div>}
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
                  'Register'
                )}
              </button>
            </div>

            <div className="text-center mt-3 text-black">
              Already have an account? <a href="/" className="text-primary">Login here</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserRegistration;