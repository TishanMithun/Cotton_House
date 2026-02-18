import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PaymentGraph() {
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString()); // Default to current month (September 2025 = 9)
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchData = async (selectedMonth) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:3006/api/users/GetMonthlyPaymentDetails/${selectedMonth}`, {
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
      setData({ status: false });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadGoogleCharts = () => {
      if (!window.google || !window.google.charts) {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.async = true;
        script.onload = () => {
          window.google.charts.load('current', { packages: ['bar'] });
          console.log('Google Charts loaded');
        };
        document.body.appendChild(script);
      } else {
        window.google.charts.load('current', { packages: ['bar'] });
        console.log('Google Charts already loaded');
      }
    };
    loadGoogleCharts();
  }, []);

  useEffect(() => {
    if (data && data.status !== false && data.items && data.items.length > 0 && window.google && window.google.charts) {
      console.log('Drawing chart with data:', data);
      window.google.charts.setOnLoadCallback(drawChart);
    }
  }, [data]);

  const drawChart = () => {
    if (!data || data.status === false || !data.items || data.items.length === 0) {
      console.log('No data to draw chart:', data);
      return;
    }

    const chartData = [
      ['Item Name', 'Total Quantity'],
      ...data.items.map(item => [item.ItemName, parseInt(item.totalQuantity)])
    ];
    const dataTable = window.google.visualization.arrayToDataTable(chartData);
    const chart = new window.google.charts.Bar(document.getElementById('chart_div'));

    window.google.visualization.events.addListener(chart, 'select', () => {
      const selection = chart.getSelection();
      if (selection.length > 0) {
        const row = selection[0].row;
        const item = data.items[row];
        alert(`Total Price for ${item.ItemName}: $${item.totalPrice}`);
      }
    });

    const options = {
      vAxis: { format: 'decimal' },
      width: '100%',
      colors: ['#1b9e77'],
      title: `Monthly Sales Summary - ${monthNames[parseInt(month) - 1]}`,
    };

    chart.draw(dataTable, window.google.charts.Bar.convertOptions(options));
    console.log('Chart drawn');
  };

  const handleGetData = () => {
    fetchData(month);
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Monthly Sales Graph</h2>
          <div className="mb-3 d-flex justify-content-center align-items-center">
            <select
              className="form-select me-2"
              style={{ width: '700px' }}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map(m => (
                <option key={m} value={m}>{monthNames[parseInt(m) - 1]}</option>
              ))}
            </select>
            <button
              className="btn btn-primary btn-sm"
              style={{ width: '400px' }}
              onClick={handleGetData}
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
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : data && data.status !== false && data.items && data.items.length > 0 ? (
            <div id="chart_div"></div>
          ) : data && data.status !== false && data.items && data.items.length === 0 ? (
            <p className="text-center">Data are not available in selected month.</p>
          ) : (
            <p className="text-center">No data available. Please click "Get Data" for the selected month.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentGraph;