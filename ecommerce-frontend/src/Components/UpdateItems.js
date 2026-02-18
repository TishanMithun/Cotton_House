import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './UpdateItems.css';

function UpdateItems() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [genderFilter, setGenderFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [genderOptions, setGenderOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    ItemName: '',
    ItemPrice: '',
    Gender: '',
    Material: '',
    Subcategory: '',
  });
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hardcoded subcategory options
  const menOptions = ['T-Shirt', 'Shirt', 'Men Trousers', 'Jacket'];
  const womenOptions = ['Frock', 'Female Trousers', 'Blouse', 'Kurti'];

  // Get token from localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchItems();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const fetchItems = async () => {
    setLoading(true);

    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'Please log in to view items.',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = '/Login';
      });
      setLoading(false);
      return;
    }

    try {
      console.log('Token:', token);
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch('http://localhost:3006/api/users/GetAllItems', {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      console.log('Fetch items response:', { status: response.status, data });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          Swal.fire({
            icon: 'error',
            title: response.status === 401 ? 'Unauthorized' : 'Forbidden',
            text: response.status === 401
              ? 'Your session has expired. Please log in again.'
              : 'You don’t have permission to view items. Please log in as an admin.',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            localStorage.removeItem('token');
            window.location.href = '/Login';
          });
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${data.message || 'Unknown error'}`);
      }

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
      } else {
        throw new Error(data.message || 'Failed to retrieve items.');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      showMessage('error', `Failed to load items: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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

  const clearFilters = () => {
    setGenderFilter('');
    setMaterialFilter('');
    setSubcategoryFilter('');
    setFilteredItems(items);
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setEditForm({
      ItemName: item.ItemName || '',
      ItemPrice: item.ItemPrice !== undefined ? item.ItemPrice.toString() : '',
      Gender: item.Gender || '',
      Material: item.Material || '',
      Subcategory: item.Subcategory || '',
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset Subcategory if Gender changes
      ...(name === 'Gender' ? { Subcategory: '' } : {}),
    }));
  };

  const handleEditSubmit = async () => {
    if (!token || !editItem?._id) {
      showMessage('error', 'Please log in or select an item to edit.');
      return;
    }

    // Validate required fields
    if (!editForm.ItemName.trim()) {
      showMessage('error', 'Item Name is required.');
      return;
    }

    if (!editForm.ItemPrice || isNaN(editForm.ItemPrice) || parseFloat(editForm.ItemPrice) < 0) {
      showMessage('error', 'Price must be a valid number greater than or equal to 0.');
      return;
    }

    if (!editForm.Gender) {
      showMessage('error', 'Gender is required.');
      return;
    }

    // Validate Subcategory
    if (editForm.Subcategory) {
      if (editForm.Gender === 'Men' && !menOptions.includes(editForm.Subcategory)) {
        showMessage('error', `Subcategory for Men must be one of: ${menOptions.join(', ')}.`);
        return;
      }
      if (editForm.Gender === 'Women' && !womenOptions.includes(editForm.Subcategory)) {
        showMessage('error', `Subcategory for Women must be one of: ${womenOptions.join(', ')}.`);
        return;
      }
    }

    const updateData = {
      ItemName: editForm.ItemName.trim(),
      ItemPrice: parseFloat(editForm.ItemPrice),
      Gender: editForm.Gender || undefined,
      Material: editForm.Material.trim() || undefined,
      Subcategory: editForm.Subcategory.trim() || undefined,
    };

    setIsSubmitting(true);

    try {
      console.log('Sending update data:', updateData);
      const response = await fetch(`http://localhost:3006/api/users/EditItem/${editItem._id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      console.log('Update response:', { status: response.status, data });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          showMessage(
            'error',
            response.status === 401
              ? 'Your session has expired. Please log in again.'
              : 'You don’t have permission to edit items. Please log in as an admin.'
          );
          setTimeout(() => {
            localStorage.removeItem('token');
            window.location.href = '/Login';
          }, 2000);
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${data.message || 'Unknown error'}`);
      }

      if (data.status) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === editItem._id
              ? { ...item, ...updateData, ItemPrice: parseFloat(updateData.ItemPrice) }
              : item
          )
        );
        setFilteredItems((prevItems) =>
          prevItems.map((item) =>
            item._id === editItem._id
              ? { ...item, ...updateData, ItemPrice: parseFloat(updateData.ItemPrice) }
              : item
          )
        );

        Swal.fire({
          icon: 'success',
          title: 'Update Success',
          text: 'Item updated successfully!',
          timer: 1500,
          showConfirmButton: false,
        });
        handleEditModalClose();
      } else {
        throw new Error(data.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      showMessage('error', `Failed to update item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditItem(null);
    setEditForm({
      ItemName: '',
      ItemPrice: '',
      Gender: '',
      Material: '',
      Subcategory: '',
    });
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl || 'https://via.placeholder.com/600x400?text=No+Image');
    setShowImageModal(true);
  };

  const handleImageModalClose = () => {
    setShowImageModal(false);
    setSelectedImage('');
  };

  const handleDeleteClick = (itemId) => {
    setDeleteItemId(itemId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!token || !deleteItemId) {
      showMessage('error', 'Please log in or select an item to delete.');
      setShowDeleteModal(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:3006/api/users/DeleteItem/${deleteItemId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('Delete response:', { status: response.status, data });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          showMessage(
            'error',
            response.status === 401
              ? 'Your session has expired. Please log in again.'
              : 'You don’t have permission to delete items. Please log in as an admin.'
          );
          setShowDeleteModal(false);
          setTimeout(() => {
            localStorage.removeItem('token');
            window.location.href = '/Login';
          }, 2000);
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${data.message || 'Unknown error'}`);
      }

      if (data.status) {
        setItems((prevItems) => prevItems.filter((item) => item._id !== deleteItemId));
        setFilteredItems((prevItems) => prevItems.filter((item) => item._id !== deleteItemId));
        setShowDeleteModal(false);
        setDeleteItemId(null);
        Swal.fire({
          icon: 'success',
          title: 'Delete Success',
          text: 'Item deleted successfully!',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showMessage('error', `Failed to delete item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setDeleteItemId(null);
  };

  // Determine subcategory options based on Gender
  const getSubcategoryOptions = () => {
    if (editForm.Gender === 'Men') {
      return menOptions;
    } else if (editForm.Gender === 'Women') {
      return womenOptions;
    }
    return [];
  };

  return (
    <div className="container my-5 animate__animated animate__fadeIn">
      <h2 className="text-center mb-4">Update and Delete Items</h2>

      {/* Message Display for Errors */}
      {message.text && (
        <div className={`alert-custom alert-${message.type}`}>
          <span className="alert-icon">
            {message.type === 'success' ? '✅' : message.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          {message.text}
        </div>
      )}

      {/* Filter Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Filter Items</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
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
              <label className="form-label">Material</label>
              <select
                className="form-select"
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
              <label className="form-label">Subcategory</label>
              <select
                className="form-select"
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
            <div className="col-12 text-end">
              <button className="btn btn-primary btn-custom me-2" onClick={handleFilter}>
                <i className="bi bi-filter me-1"></i>Filter
              </button>
              <button className="btn btn-secondary btn-custom" onClick={clearFilters}>
                <i className="bi bi-arrow-clockwise me-1"></i>Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="loading-spinner"></div>
              <p className="mt-2">Loading items...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Price (LKR)</th>
                    <th>Gender</th>
                    <th>Material</th>
                    <th>Subcategory</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <tr key={item._id} className="animate__animated animate__fadeInUp">
                        <td>{item.ItemName || 'N/A'}</td>
                        <td>{(item.ItemPrice || 0).toFixed(2)}</td>
                        <td>{item.Gender || 'N/A'}</td>
                        <td>{item.Material || 'N/A'}</td>
                        <td>{item.Subcategory || 'N/A'}</td>
                        <td>
                          <img
                            src={item.Url1 || 'https://via.placeholder.com/50x50?text=No+Image'}
                            alt={item.ItemName || 'Item'}
                            className="table-image"
                            onClick={() => handleImageClick(item.Url1)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm btn-custom me-1"
                            onClick={() => handleEditClick(item)}
                          >
                            <i className="bi bi-pencil-fill me-1"></i>Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm btn-custom"
                            onClick={() => handleDeleteClick(item._id)}
                          >
                            <i className="bi bi-trash-fill me-1"></i>Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="custom-modal-overlay" onClick={handleEditModalClose}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <h5 className="custom-modal-title">
                <i className="bi bi-pencil-fill me-2"></i>Edit Item
              </h5>
              <button
                className="custom-modal-close"
                onClick={handleEditModalClose}
                aria-label="Close"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            <div className="custom-modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(); }}>
                <div className="mb-3">
                  <label className="form-label">Item Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="ItemName"
                    value={editForm.ItemName}
                    onChange={handleEditChange}
                    required
                    placeholder="Enter item name"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price (LKR) <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    name="ItemPrice"
                    value={editForm.ItemPrice}
                    onChange={handleEditChange}
                    min="0"
                    step="0.01"
                    required
                    placeholder="Enter price"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Gender <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    name="Gender"
                    value={editForm.Gender}
                    onChange={handleEditChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Gender</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Material</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Material"
                    value={editForm.Material}
                    onChange={handleEditChange}
                    placeholder="Enter material (optional)"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Subcategory</label>
                  <select
                    className="form-select"
                    name="Subcategory"
                    value={editForm.Subcategory}
                    onChange={handleEditChange}
                    disabled={isSubmitting || !editForm.Gender}
                  >
                    <option value="">Select Subcategory</option>
                    {getSubcategoryOptions().map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            <div className="custom-modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-custom"
                onClick={handleEditModalClose}
                disabled={isSubmitting}
              >
                <i className="bi bi-x-circle me-1"></i>Close
              </button>
              <button
                type="button"
                className="btn btn-primary btn-custom"
                onClick={handleEditSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner me-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-1"></i>Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={handleImageModalClose}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="image-modal-header">
              <button
                className="image-modal-close"
                onClick={handleImageModalClose}
                aria-label="Close"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            <div className="image-modal-body">
              <img
                src={selectedImage}
                alt="Enlarged item"
                className="image-modal-content"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="custom-modal-overlay" onClick={handleDeleteModalClose}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <h5 className="custom-modal-title">
                <i className="bi bi-trash-fill me-2"></i>Confirm Deletion
              </h5>
              <button
                className="custom-modal-close"
                onClick={handleDeleteModalClose}
                aria-label="Close"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            <div className="custom-modal-body">
              <p>Are you sure you want to delete this item? This action cannot be undone.</p>
            </div>
            <div className="custom-modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-custom"
                onClick={handleDeleteModalClose}
                disabled={isSubmitting}
              >
                <i className="bi bi-x-circle me-1"></i>Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-custom"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner me-2"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash-fill me-1"></i>Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateItems;