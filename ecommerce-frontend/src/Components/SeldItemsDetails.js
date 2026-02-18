import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './SeldItemsDetails.css';

function SeldItemsDetails() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:3006/api/users/GetAllPaymentsItems', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.data.Status) {
          setPayments(response.data.payments);
        } else {
          setError('Failed to fetch payment data');
        }
      } catch (err) {
        setError('Error fetching payments: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const downloadPDF = async () => {
    const table = document.getElementById('paymentsTable');
    const canvas = await html2canvas(table);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: 'a4'
    });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('payments-report.pdf');
  };

  if (loading) return <div className="seld-items-details__spinner text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="seld-items-details__alert alert alert-danger m-4">{error}</div>;

  return (
    <div className="seld-items-details__container container-fluid py-4">
      <div className="seld-items-details__card card shadow-lg">
        <div className="seld-items-details__card-header card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Sold Items Details</h3>
          <button 
            className="seld-items-details__download-btn btn btn-light btn-sm"
            onClick={downloadPDF}
          >
            <i className="bi bi-download me-2"></i>Download PDF
          </button>
        </div>
        <div className="seld-items-details__card-body card-body">
          <div className="seld-items-details__table-responsive table-responsive">
            <table id="paymentsTable" className="seld-items-details__table table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>Item Name</th>
                  <th>Item Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Size</th>
                  <th>Postal Code</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{payment.userName}</td>
                    <td>{payment.ItemName}</td>
                    <td>RS {payment.ItemPrice.toLocaleString()}</td>
                    <td>{payment.Quantity}</td>
                    <td>RS {payment.TotalPrice.toLocaleString()}</td>
                    <td>{payment.Size}</td>
                    <td>{payment.postalCode}</td>
                    <td>{payment.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeldItemsDetails;