import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import autoTable separately
import { saveAs } from 'file-saver';

function PaymentDetails() {
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString()); // Default to current month (July 2025 = 7)
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:3006/api/users/GetMonthlyPaymentDetails/${month}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setData(res.data);
      console.log('Payment Details Response:', res.data); // Debug the response
    } catch (err) {
      console.log('Error:', err.response?.status === 401
        ? 'Unauthorized. Please log in again.'
        : err.response?.data?.message || 'Failed to fetch payment details.');
      setData({ status: false }); // Set status to false on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData(); // Fetch data when token is set
  }, [token]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();


    doc.setFontSize(18);
    doc.text('Cotton Manthra', pageWidth / 2, 10, { align: 'center' });

    doc.setFontSize(12);
    doc.text('28 Karlshrue Gardens, Borella, Sri Lanka', pageWidth / 2, 20, { align: 'center' });
    doc.text('+94775559313, +94778830501', pageWidth / 2, 30, { align: 'center' });

    const monthName = monthNames[parseInt(month) - 1];
    doc.setFontSize(16);
    doc.text(`Monthly Payment Summary for ${monthName}`, pageWidth / 2, 50, { align: 'center' });

    if (data && data.status !== false && data.items && data.items.length > 0) {
      const tableColumn = ['Item Name', 'Total Quantity', 'Total Price', 'Material', 'Item Price', 'Gender'];
      const tableRows = data.items.map(item => [
        item.ItemName,
        item.totalQuantity,
        item.totalPrice,
        item.Material,
        item.ItemPrice,
        item.Gender,
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 5, textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { textColor: [0, 0, 0] }, // Black text for header
        margin: { top: 20, bottom: 20, left: 20, right: 20 },
      });
    } else {
      doc.setFontSize(12);
      doc.text('No data available for this month.', pageWidth / 2, 70, { align: 'center' });
    }

    doc.save(`Monthly_Payment_Summary_${monthName}.pdf`);
    console.log('PDF downloaded successfully.');
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2 
            className="card-title text-center mb-4 p-2"
            style={{ 
              backgroundColor: '#f8f9fa', 
              borderRadius: '5px', 
              fontWeight: 'bold', 
              color: '#007bff' 
            }}
          >
            Monthly Payment Details - {monthNames[parseInt(month) - 1]}
          </h2>
    <div className="row mb-3">
  <div className="col-auto">
    <select
      className="form-select"
      style={{ width: '900px' }}
      value={month}
      onChange={(e) => setMonth(e.target.value)}
      disabled={isLoading}
    >
      {months.map(m => (
        <option key={m} value={m}>{monthNames[parseInt(m) - 1]}</option>
      ))}
    </select>
  </div>
  <div className="col-auto">
    <button
      style={{ width: '300px' }}
      className="btn btn-primary"
      onClick={fetchData}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading...
        </>
      ) : 'Get Data'}
    </button>
  </div>
</div>

          {data && (
            <div>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Total Quantity</th>
                      <th>Total Price</th>
                      <th>Material</th>
                      <th>Item Price</th>
                      <th>Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.status !== false && data.items && data.items.length > 0 ? (
                      data.items.map(item => (
                        <tr key={item.ItemId}>
                          <td>{item.ItemName}</td>
                          <td>{item.totalQuantity}</td>
                          <td>{item.totalPrice}</td>
                          <td>{item.Material}</td>
                          <td>{item.ItemPrice}</td>
                          <td>{item.Gender}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No items to display</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-center">
                <button
                  className="btn btn-success btn-lg"
                  style={{ 
                    width: '200px', 
                    background: 'linear-gradient(135deg, #28a745, #218838)', 
                    border: 'none', 
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                    borderRadius: '8px' 
                  }}
                  onClick={downloadPDF}
                  disabled={isLoading}
                >
                  Download PDF
                </button>
              </div>
            </div>
          )}
          {!data && (
            <p className="text-center">No data available. Please click "Get Data" to fetch details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentDetails;