import React, { useState, useEffect, useRef } from 'react';
import './NavBarUsers.css';
import Swal from 'sweetalert2';
import Logo from '../Images/Logo.png';
import { jwtDecode } from 'jwt-decode';

function NavBarUsers() {
  const [cartItems, setCartItems] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [sizes, setSizes] = useState({});
  const token = localStorage.getItem('token');
  const modalRef = useRef(null);
  const [decodeToken, setDecodeToken] = useState(null);

  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodeToken(decoded);
        console.log('Decoded Token:', decoded);
      } catch (err) {
        console.error('Error decoding token:', err);
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'Invalid or corrupted token. Please log in again.',
        }).then(() => {
          localStorage.removeItem('token');
          window.location.href = '/Login';
        });
      }
    } else {
      console.warn('No token found in localStorage');
    }
  }, [token]);

  useEffect(() => {
    const loadBootstrap = () => {
      if (!document.querySelector('link[href*="bootstrap"]')) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
        document.head.appendChild(cssLink);
      }

      if (!document.querySelector('link[href*="bootstrap-icons"]')) {
        const iconLink = document.createElement('link');
        iconLink.rel = 'stylesheet';
        iconLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css';
        document.head.appendChild(iconLink);
      }

      if (!document.querySelector('link[href*="animate.css"]')) {
        const animateLink = document.createElement('link');
        animateLink.rel = 'stylesheet';
        animateLink.href = 'https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css';
        document.head.appendChild(animateLink);
      }

      if (!window.bootstrap) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
        script.onload = () => {
          window.bootstrapReady = true;
          console.log('Bootstrap JS loaded');
        };
        document.body.appendChild(script);
      } else {
        window.bootstrapReady = true;
      }
    };

    loadBootstrap();
  }, []);

  useEffect(() => {
    if (showModal && window.bootstrap && modalRef.current) {
      const modal = new window.bootstrap.Modal(modalRef.current, {
        backdrop: true,
        keyboard: true,
      });
      modal.show();

      modalRef.current.addEventListener('hidden.bs.modal', () => {
        setShowModal(false);
      });
    }
  }, [showModal]);

  const fetchItemDetails = async (itemIds) => {
    try {
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch('http://localhost:3006/api/users/GetAllItems', {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.message === 'Items retrieved successfully') {
        const details = {};
        itemIds.forEach((itemId) => {
          const item = data.items.find((i) => i._id === itemId);
          if (item) {
            details[itemId] = item;
          }
        });
        setItemDetails(details);
      } else {
        throw new Error('Failed to retrieve item details.');
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load item details.',
      });
    }
  };

  const handleCartClick = () => {
    if (!token || !decodeToken?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please log in to view cart',
      });
      return;
    }

    const userId = decodeToken.id;
    console.log('Fetching cart for userId:', userId);
    fetch(`http://localhost:3006/api/users/cart/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then((response) => {
        console.log('Cart fetch response status:', response.status);
        if (!response.ok) {
          return response.json().then((errData) => {
            if (response.status === 404 && errData.message === 'No cart items found for this user') {
              setCartItems([]);
              setShowModal(true);
              return;
            }
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errData.message || 'Unknown error'}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          console.log('Cart fetch response data:', data);
          if (data.message === 'Cart items retrieved successfully') {
            setCartItems(data.cartItems);
            const initialQuantities = {};
            const initialSizes = {};
            data.cartItems.forEach((item) => {
              initialQuantities[item._id] = item.Quantity || 1;
              initialSizes[item._id] = item.Size || sizeOptions[0];
            });
            setQuantities(initialQuantities);
            setSizes(initialSizes);
            const itemIds = [...new Set(data.cartItems.map((item) => item.ItemId))];
            console.log('Item IDs to fetch:', itemIds);
            if (itemIds.length > 0) {
              fetchItemDetails(itemIds);
            }
            setShowModal(true);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to retrieve cart items: ' + (data.message || 'Unexpected response'),
            });
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to retrieve cart items: ${error.message}`,
        });
      });
  };

  const handleQuantityChange = (cartItemId, value) => {
    const newQuantity = Math.max(1, parseInt(value) || 1);
    setQuantities((prev) => ({
      ...prev,
      [cartItemId]: newQuantity,
    }));
  };

  const handleSizeChange = (cartItemId, value) => {
    setSizes((prev) => ({
      ...prev,
      [cartItemId]: value,
    }));
  };

  const handlePayItem = async (cartItem) => {
    if (!token || !decodeToken?.id || !decodeToken?.userName) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please log in to proceed with payment',
      });
      return;
    }

    const userId = decodeToken.id;
    const userName = decodeToken.userName;
    const paymentItem = itemDetails[cartItem.ItemId] || {};

    if (!paymentItem._id || !paymentItem.ItemPrice || !paymentItem.Material) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Incomplete item details. Please try again.',
      });
      return;
    }

    const quantity = quantities[cartItem._id] || 1;
    const selectedSize = sizes[cartItem._id] || sizeOptions[0];

    const paymentData = {
      userId,
      userName,
      ItemId: paymentItem._id,
      Price: paymentItem.ItemPrice * quantity,
      Material: paymentItem.Material,
      Quantity: quantity,
      Size: selectedSize,
    };

    try {
      console.log('Sending payment data:', paymentData);
      const response = await fetch('http://localhost:3006/api/users/AddPayment', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errData.message || 'Unknown error'}`);
      }

      await response.json();

      const deleteResponse = await fetch(`http://localhost:3006/api/users/cart/${cartItem.ItemId}/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!deleteResponse.ok) {
        const errData = await deleteResponse.json();
        throw new Error(`Failed to delete cart item: ${errData.message || 'Unknown error'}`);
      }

      setCartItems((prevItems) => prevItems.filter((item) => item.ItemId !== cartItem.ItemId));
      setQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[cartItem._id];
        return newQuantities;
      });
      setSizes((prev) => {
        const newSizes = { ...prev };
        delete newSizes[cartItem._id];
        return newSizes;
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Payment completed successfully!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Payment failed: ${error.message}`,
      });
    }
  };

  const handleDeleteItem = (itemId) => {
    if (!token || !decodeToken?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please log in to delete cart items',
      });
      return;
    }

    const userId = decodeToken.id;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this item from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deleting item with ItemId:', itemId, 'for userId:', userId);
        fetch(`http://localhost:3006/api/users/cart/${itemId}/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
          .then((response) => {
            console.log('Delete response status:', response.status);
            if (!response.ok) {
              return response.json().then((errData) => {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errData.message || 'Unknown error'}`);
              });
            }
            return response.json();
          })
          .then((data) => {
            if (data.status) {
              setCartItems((prevItems) => prevItems.filter((item) => item.ItemId !== itemId));
              setQuantities((prev) => {
                const newQuantities = { ...prev };
                delete newQuantities[itemId];
                return newQuantities;
              });
              setSizes((prev) => {
                const newSizes = { ...prev };
                delete newSizes[itemId];
                return newSizes;
              });
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Item removed from cart successfully.',
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              throw new Error(data.message || 'Failed to delete item');
            }
          })
          .catch((error) => {
            console.error('Error deleting cart item:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Failed to remove item from cart: ${error.message}`,
            });
          });
      }
    });
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been logged out successfully!',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = '/';
    });
  };

  const closeModal = () => {
    if (modalRef.current && window.bootstrap) {
      const modal = window.bootstrap.Modal.getInstance(modalRef.current);
      if (modal) {
        modal.hide();
      }
    }
    setShowModal(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg animate__animated animate__fadeInDown">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src={Logo} alt="Logo" className="logo-image" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link" href="/ClothingGallery">
                  <i className="bi bi-house-door-fill me-2"></i>Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/ClothingGalleryFilter">
                  <i className="bi bi-plus-square-fill me-2"></i>FilterAndGetItems
                </a>
              </li>

               <li className="nav-item">
                <a className="nav-link" href="/PaymentPortal">
                  <i className="bi bi-plus-square-fill me-2"></i>Payment Portal
                </a>
              </li>

             
              <li className="nav-item">
                <a className="nav-link" href="/about">
                  <i className="bi bi-info-circle me-2"></i>About Us
                </a>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <button className="nav-link btn-custom" onClick={handleCartClick}>
                  <i className="bi bi-cart-fill me-2"></i>Cart
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn-custom" onClick={handleLogoutClick}>
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div
        className="modal fade animate__animated animate__fadeIn"
        id="cartModal"
        tabIndex="-1"
        aria-labelledby="cartModalLabel"
        aria-hidden="true"
        ref={modalRef}
        data-bs-backdrop="true"
        data-bs-keyboard="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header sticky-top bg-dark text-white">
              <h5 className="modal-title" id="cartModalLabel">
                <i className="bi bi-cart-fill me-2"></i>Your Cart
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {cartItems.length > 0 ? (
                <div className="cart-items">
                  {cartItems.map((cartItem) => {
                    const item = itemDetails[cartItem.ItemId] || {};
                    const total = (item.ItemPrice || 0) * (quantities[cartItem._id] || 1);
                    return (
                      <div key={cartItem._id} className="card mb-3 shadow-sm animate__animated animate__fadeInUp">
                        <div className="row g-0 align-items-center">
                          <div className="col-md-4">
                            <img
                              src={item.Url1 || 'https://via.placeholder.com/150x150?text=No+Image'}
                              className="img-fluid rounded-start"
                              alt={item.ItemName || 'Item'}
                              style={{
                                maxHeight: '150px',
                                width: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                          <div className="col-md-8">
                            <div className="card-body">
                              <h5 className="card-title text-primary">{item.ItemName || 'Unknown Item'}</h5>
                              <p className="card-text">
                                <strong className="text-success">
                                  Price: LKR {(item.ItemPrice || 0).toFixed(2)}
                                </strong>
                              </p>
                              <p className="card-text">
                                <strong className="text-success">Total: LKR {total.toFixed(2)}</strong>
                              </p>
                              <p className="card-text">
                                <small className="text-muted">
                                  Added: {new Date(cartItem.createdAt).toLocaleString()}
                                </small>
                              </p>
                              <div className="d-flex align-items-center mb-2">
                                <label className="me-2">Quantity:</label>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={quantities[cartItem._id] || 1}
                                  onChange={(e) => handleQuantityChange(cartItem._id, e.target.value)}
                                  min="1"
                                  style={{ maxWidth: '80px' }}
                                />
                              </div>
                              <div className="d-flex align-items-center mb-2">
                                <label className="me-2">Size:</label>
                                <select
                                  className="form-select form-select-sm"
                                  value={sizes[cartItem._id] || sizeOptions[0]}
                                  onChange={(e) => handleSizeChange(cartItem._id, e.target.value)}
                                  style={{ maxWidth: '100px' }}
                                >
                                  {sizeOptions.map((size) => (
                                    <option key={size} value={size}>
                                      {size}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-primary btn-sm btn-custom"
                                  onClick={() => handlePayItem(cartItem)}
                                >
                                  <i className="bi bi-credit-card me-1"></i>Pay
                                </button>
                                <button
                                  className="btn btn-danger btn-sm btn-custom"
                                  onClick={() => handleDeleteItem(cartItem.ItemId)}
                                >
                                  <i className="bi bi-trash-fill me-1"></i>Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-cart-x display-1 text-muted"></i>
                  <p className="mt-3 text-muted fs-5">Your cart is empty.</p>
                </div>
              )}
            </div>
            <div className="modal-footer sticky-bottom bg-light">
              <button
                type="button"
                className="btn btn-secondary btn-custom"
                data-bs-dismiss="modal"
                onClick={closeModal}
              >
                <i className="bi bi-x-circle me-1"></i>Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBarUsers;