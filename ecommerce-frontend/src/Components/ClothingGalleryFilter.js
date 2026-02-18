import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import './ClothingGalleryFilter.css';
import { jwtDecode } from 'jwt-decode';

function ClothingGalleryFilter() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [genderFilter, setGenderFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [genderOptions, setGenderOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [currentImages, setCurrentImages] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [paymentItem, setPaymentItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('S');
  const [cartAlertItemId, setCartAlertItemId] = useState(null);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Retrieve token from localStorage
  const token = localStorage.getItem('token');
  const decodeToken = token ? jwtDecode(token) : null;
  const userId = decodeToken ? decodeToken.id : null;
  console.log('Decoded Token:', decodeToken);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const headers = {
        'Accept': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const response = await fetch('http://localhost:3006/api/users/GetAllItems', {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            Swal.fire({
              icon: 'error',
              title: response.status === 401 ? 'Unauthorized' : 'Forbidden',
              text: response.status === 401
                ? 'Your session has expired. Please log in again.'
                : 'You don’t have permission to view items.',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              localStorage.removeItem('token');
              window.location.href = '/Login';
            });
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetch items response:', { status: response.status, data });

        if (data.message === 'Items retrieved successfully') {
          setItems(data.items);
          setFilteredItems(data.items);

          // Extract distinct values for filters
          const genders = [...new Set(data.items.map(item => item.Gender).filter(Boolean))];
          const materials = [...new Set(data.items.map(item => item.Material).filter(Boolean))];
          const subcategories = [...new Set(data.items.map(item => item.Subcategory).filter(Boolean))];

          setGenderOptions(genders);
          setMaterialOptions(materials);
          setSubcategoryOptions(subcategories);

          const initialImages = {};
          data.items.forEach((item) => {
            initialImages[item._id] = 0;
          });
          setCurrentImages(initialImages);
        } else {
          throw new Error(data.message || 'Failed to retrieve items.');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to load items: ${error.message}`,
          timer: 2000,
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Cycle through images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImages((prev) => {
        const updated = { ...prev };
        filteredItems.forEach((item) => {
          const urls = [item.Url1, item.Url2, item.Url3, item.Url4, item.Url5].filter((url) => url);
          if (urls.length > 1) {
            updated[item._id] = (prev[item._id] + 1) % urls.length;
          }
        });
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [filteredItems]);

  // Filter items
  const handleFilter = () => {
    let filtered = items;
    if (genderFilter) {
      filtered = filtered.filter(item => item.Gender === genderFilter);
    }
    if (materialFilter) {
      filtered = filtered.filter(item => item.Material === materialFilter);
    }
    if (subcategoryFilter) {
      filtered = filtered.filter(item => item.Subcategory === subcategoryFilter);
    }
    setFilteredItems(filtered);
  };

  // Clear filters
  const clearFilters = () => {
    setGenderFilter('');
    setMaterialFilter('');
    setSubcategoryFilter('');
    setFilteredItems(items);
  };

  // Get current image for an item
  const getCurrentImage = (item) => {
    const urls = [item.Url1, item.Url2, item.Url3, item.Url4, item.Url5].filter((url) => url);
    return urls[currentImages[item._id] || 0] || item.Url1 || 'https://via.placeholder.com/300x400?text=No+Image';
  };

  // Get all available images for an item
  const getItemImages = (item) => {
    return [item.Url1, item.Url2, item.Url3, item.Url4, item.Url5].filter((url) => url);
  };

  // Handle image click to open 3D modal
  const handleImageClick = (item) => {
    setSelectedItem(item);
    setRotation({ x: 0, y: 0 });
  };

  // Handle mouse down for drag rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move for drag rotation
  const handleMouseMove = (e) => {
    if (isDragging && selectedItem) {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      setRotation((prev) => ({
        x: prev.x + deltaY * 0.5,
        y: prev.y + deltaX * 0.5,
      }));
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle manual rotation buttons
  const rotateLeft = () => {
    setRotation((prev) => ({ ...prev, y: prev.y - 15 }));
  };
  const rotateRight = () => {
    setRotation((prev) => ({ ...prev, y: prev.y + 15 }));
  };
  const rotateUp = () => {
    setRotation((prev) => ({ ...prev, x: prev.x - 15 }));
  };
  const rotateDown = () => {
    setRotation((prev) => ({ ...prev, x: prev.x + 15 }));
  };

  // Handle payment button click to open payment modal
  const handlePaymentClick = (item) => {
    setPaymentItem(item);
    setQuantity(1);
    setSelectedSize('S');
    setPreviewImageIndex(0);
  };

  // Handle quantity change
  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  // Handle size change
  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  // Handle preview image change
  const handlePreviewImageChange = (direction) => {
    if (paymentItem) {
      const urls = getItemImages(paymentItem);
      setPreviewImageIndex((prev) => {
        const newIndex = direction === 'next'
          ? (prev + 1) % urls.length
          : (prev - 1 + urls.length) % urls.length;
        return newIndex;
      });
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = () => {
    if (!paymentItem) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No item selected for payment',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please log in to make a payment',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const paymentData = {
      userId,
      userName: decodeToken.userName,
      ItemId: paymentItem._id,
      Price: paymentItem.ItemPrice * quantity,
      Material: paymentItem.Material,
      Quantity: quantity,
      Size: selectedSize,
    };

    fetch('http://localhost:3006/api/users/AddPayment', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          icon: 'success',
          title: 'Payment Success',
          text: 'Payment done successfully!',
          timer: 1500,
          showConfirmButton: false,
        });
        console.log('Payment added:', data);
        setPaymentItem(null);
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: 'Payment failed. Please try again.',
          timer: 2000,
          showConfirmButton: false,
        });
        console.error('Error adding payment:', error);
      });
  };

  // Handle Add to Cart button click
  const handleAddToCart = (item) => {
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please log in to add items to cart',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (!userId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'User ID not found in token',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const cartData = {
      userId,
      Url1: item.Url1,
      Name: item.ItemName,
      ItemId: item._id,
      ItemPrice: item.ItemPrice,
      ItemName: item.ItemName,
      Size: selectedSize,
    };

    fetch('http://localhost:3006/api/users/AddToCart', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCartAlertItemId(item._id);
        console.log('Item added to cart:', data);
        setTimeout(() => setCartAlertItemId(null), 3000);
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add item to cart. Please try again.',
          timer: 2000,
          showConfirmButton: false,
        });
        console.error('Error adding item to cart:', error);
      });
  };

  return (
    <div className="container py-5 clothing-gallery animate__animated animate__fadeIn">
      <h2 className="text-center mb-5 display-4 fw-bold animate__animated animate__fadeIn custom-heading">
        Explore Our Collection
      </h2>

      {/* Filter Section */}
      <div className="card mb-5 shadow-lg filter-card animate__animated animate__fadeInDown">
        <div className="card-body">
          <h5 className="card-title text-white mb-4">Filter Items</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label text-white">Gender</label>
              <select
                className="form-select filter-select"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="">All Genders</option>
                {genderOptions.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label text-white">Material</label>
              <select
                className="form-select filter-select"
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value)}
              >
                <option value="">All Materials</option>
                {materialOptions.map((material) => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label text-white">Subcategory</label>
              <select
                className="form-select filter-select"
                value={subcategoryFilter}
                onChange={(e) => setSubcategoryFilter(e.target.value)}
              >
                <option value="">All Subcategories</option>
                {subcategoryOptions.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 text-end mt-3">
              <button
                className="btn btn-primary btn-custom filter-btn me-2"
                onClick={handleFilter}
              >
                <i className="bi bi-filter me-1"></i>Filter
              </button>
              <button
                className="btn btn-outline-light btn-custom filter-btn"
                onClick={clearFilters}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Items Gallery */}
      {loading ? (
        <div className="text-center py-5">
          <div className="loading-spinner"></div>
          <p className="text-white mt-2">Loading items...</p>
        </div>
      ) : (
        <div className="row">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={item._id}>
                <div className="card h-100 shadow-lg animate__animated animate__zoomIn">
                  <img
                    src={getCurrentImage(item)}
                    alt={item.ItemName}
                    className="card-img-top product-img"
                    onClick={() => handleImageClick(item)}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-dark">{item.ItemName}</h5>
                    <p className="card-text text-muted small">
                      {item.Gender} {item.Subcategory} | {item.Material}
                    </p>
                    <div className="mt-auto">
                      <h6 className="text-primary fw-bold">LKR {item.ItemPrice.toFixed(2)}</h6>
                      <button
                        className="btn btn-success w-100 mt-2 mb-2 btn-custom"
                        onClick={() => handlePaymentClick(item)}
                      >
                        Buy Now
                      </button>
                      <button
                        className="btn btn-outline-primary w-100 btn-custom"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                      {cartAlertItemId === item._id && (
                        <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
                          Added to cart successfully!
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setCartAlertItemId(null)}
                            aria-label="Close"
                          ></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-white">No items found.</p>
            </div>
          )}
        </div>
      )}

      {/* 3D View Modal */}
      {selectedItem && (
        <div
          className="modal fade show animate__animated animate__fadeIn"
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">{selectedItem.ItemName}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedItem(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <div className="three-d-container">
                  <img
                    src={getCurrentImage(selectedItem)}
                    alt={selectedItem.ItemName}
                    className="three-d-image"
                    style={{
                      transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    }}
                    onMouseDown={handleMouseDown}
                  />
                </div>
                <div className="mt-4 d-flex justify-content-center gap-2">
                  <button className="btn btn-outline-dark btn-sm btn-custom" onClick={rotateLeft}>
                    <i className="bi bi-arrow-left"></i> Left
                  </button>
                  <button className="btn btn-outline-dark btn-sm btn-custom" onClick={rotateRight}>
                    Right <i className="bi bi-arrow-right"></i>
                  </button>
                  <button className="btn btn-outline-dark btn-sm btn-custom" onClick={rotateUp}>
                    <i className="bi bi-arrow-up"></i> Up
                  </button>
                  <button className="btn btn-outline-dark btn-sm btn-custom" onClick={rotateDown}>
                    Down <i className="bi bi-arrow-down"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentItem && (
        <div className="modal fade show animate__animated animate__fadeIn" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
          <div className="modal-dialog modal-md">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Checkout: {paymentItem.ItemName}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setPaymentItem(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4 text-center position-relative">
                  <div className="d-flex justify-content-center align-items-center">
                    <button
                      className="btn btn-outline-secondary btn-sm btn-custom carousel-control"
                      onClick={() => handlePreviewImageChange('prev')}
                      disabled={getItemImages(paymentItem).length <= 1}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <img
                      src={getItemImages(paymentItem)[previewImageIndex]}
                      alt={paymentItem.ItemName}
                      className="preview-img"
                    />
                    <button
                      className="btn btn-outline-secondary btn-sm btn-custom carousel-control"
                      onClick={() => handlePreviewImageChange('next')}
                      disabled={getItemImages(paymentItem).length <= 1}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                  <div className="mt-2 text-muted small">
                    Image {previewImageIndex + 1} of {getItemImages(paymentItem).length}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="sizeSelect" className="form-label fw-bold">Size:</label>
                  <select
                    id="sizeSelect"
                    className="form-select form-select-lg"
                    value={selectedSize}
                    onChange={handleSizeChange}
                  >
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">Extra Large (XL)</option>
                    <option value="XXL">Double Extra Large (XXL)</option>
                  </select>
                </div>
                <div className="d-flex justify-content-center align-items-center mb-4">
                  <button
                    className="btn btn-outline-secondary btn-custom"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <span className="mx-3 fw-bold">Quantity: {quantity}</span>
                  <button
                    className="btn btn-outline-secondary btn-custom"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
                <div className="text-center">
                  <h6 className="fw-bold text-primary">Total: LKR {(paymentItem.ItemPrice * quantity).toFixed(2)}</h6>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button
                  className="btn btn-success btn-lg btn-custom w-100"
                  onClick={handlePaymentSubmit}
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClothingGalleryFilter;