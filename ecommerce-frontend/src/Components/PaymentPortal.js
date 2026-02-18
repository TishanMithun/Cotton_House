import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaCreditCard, FaUser, FaCalendarAlt, FaLock } from 'react-icons/fa';
import './PaymentPortal.css';

function PaymentPortal() {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    amount: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Card Number validation (MasterCard: starts with 51-55, Visa: starts with 4, 16 digits)
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^(5[1-5][0-9]{14}|4[0-9]{15})$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Invalid card number. Only MasterCard (starts with 51-55) or Visa (starts with 4) accepted';
    }

    // Cardholder Name validation
    if (!formData.cardHolderName) {
      newErrors.cardHolderName = 'Cardholder name is required';
    } else if (!/^[a-zA-Z\s]{2,}$/.test(formData.cardHolderName)) {
      newErrors.cardHolderName = 'Name must be at least 2 characters and contain only letters';
    }

    // Expiry Date validation (MM/YY format)
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date. Use MM/YY format';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation (3 digits for Visa/MasterCard)
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^[0-9]{3}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || formData.amount <= 0) {
      newErrors.amount = 'Amount must be a valid number greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Format card number (add space every 4 digits)
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    // Format expiry date (add slash after MM)
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post('http://localhost:3006/api/payments/create', {
        ...formData,
        cardNumber: formData.cardNumber.replace(/\s/g, ''), // Remove spaces for API
      }, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message || 'Payment processed successfully',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        setFormData({
          cardNumber: '',
          cardHolderName: '',
          expiryDate: '',
          cvv: '',
          amount: '',
        });
        setErrors({});
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: err.response?.data?.message || 'Something went wrong. Please try again.',
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="payment-portal__container container-fluid py-4">
      <div className="payment-portal__card card shadow-lg mx-auto" style={{ maxWidth: '600px' }}>
        <div className="payment-portal__card-header card-header bg-primary text-white text-center">
          <h3 className="mb-0">Payment Portal</h3>
        </div>
        <div className="payment-portal__card-body card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="payment-portal__form-group form-group mb-3">
              <label htmlFor="cardNumber" className="form-label">Card Number <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><FaCreditCard /></span>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                  placeholder="1234 5678 9012 3456"
                  required
                  disabled={isSubmitting}
                  maxLength="19"
                />
                {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
              </div>
            </div>

            <div className="payment-portal__form-group form-group mb-3">
              <label htmlFor="cardHolderName" className="form-label">Cardholder Name <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><FaUser /></span>
                <input
                  type="text"
                  id="cardHolderName"
                  name="cardHolderName"
                  value={formData.cardHolderName}
                  onChange={handleChange}
                  className={`form-control ${errors.cardHolderName ? 'is-invalid' : ''}`}
                  placeholder="John Doe"
                  required
                  disabled={isSubmitting}
                />
                {errors.cardHolderName && <div className="invalid-feedback">{errors.cardHolderName}</div>}
              </div>
            </div>

            <div className="payment-portal__form-group form-group mb-3">
              <label htmlFor="expiryDate" className="form-label">Expiry Date <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><FaCalendarAlt /></span>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                  placeholder="MM/YY"
                  required
                  disabled={isSubmitting}
                  maxLength="5"
                />
                {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
              </div>
            </div>

            <div className="payment-portal__form-group form-group mb-3">
              <label htmlFor="cvv" className="form-label">CVV <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><FaLock /></span>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                  placeholder="123"
                  required
                  disabled={isSubmitting}
                  maxLength="3"
                />
                {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
              </div>
            </div>


            <div className="payment-portal__form-group d-grid">
              <button
                type="submit"
                className="payment-portal__submit-btn btn btn-primary btn-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  'Process Payment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentPortal;