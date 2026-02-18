import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ItemAdded.css';
import Swal from 'sweetalert2';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { jwtDecode } from 'jwt-decode';

// Initialize Firebase App
const firebaseConfig = {
  apiKey: "AIzaSyBWHX2jVHS1pUs8RGgiBEL-AMb0VsbpCLM",
  authDomain: "markitupproject.firebaseapp.com",
  projectId: "markitupproject",
  storageBucket: "markitupproject.appspot.com",
  messagingSenderId: "251316166179",
  appId: "1:251316166179:web:96ab9062c734f0979e1b96",
  measurementId: "G-F73MGFE8RC"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const token = localStorage.getItem('token');

function ItemAdded() {
  const [gender, setGender] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [images, setImages] = useState([]);
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [material, setMaterial] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});

  const menOptions = ['T-Shirt', 'Shirt', 'Men Trousers', 'Jacket'];
  const womenOptions = ['Frock', 'Female Trousers', 'Blouse', 'Kurti'];

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setSubcategory('');
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Too Many Images',
        text: 'You can only upload up to 5 images.',
      });
      return;
    }
    setImages(selectedFiles);
    setUploadProgress({});
  };

  const uploadImages = async () => {
    const imageUrls = [];
    const uploadPromises = images.map((image, index) => {
      return new Promise((resolve, reject) => {
        const imageRef = ref(storage, `items/${Date.now()}_${image.name}`);
        const uploadTask = uploadBytesResumable(imageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prev) => ({
              ...prev,
              [index]: progress,
            }));
          },
          (error) => {
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(imageRef);
            resolve(url);
          }
        );
      });
    });

    try {
      imageUrls.push(...(await Promise.all(uploadPromises)));
      return imageUrls;
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setUploadProgress({});

    try {
      const imageUrls = await uploadImages();

      const itemData = {
        ItemName: itemName,
        ItemPrice: price,
        Gender: gender,
        Material: material,
        Subcategory: subcategory,
        Url1: imageUrls[0] || '',
        Url2: imageUrls[1] || '',
        Url3: imageUrls[2] || '',
        Url4: imageUrls[3] || '',
        Url5: imageUrls[4] || '',
      };

      const response = await fetch('http://localhost:3006/api/users/AddItems', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Item added successfully!',
          confirmButtonText: 'OK',
        });
        setItemName('');
        setPrice('');
        setGender('');
        setSubcategory('');
        setMaterial('');
        setImages([]);
        setUploadProgress({});
      } else {
        throw new Error(result.message || 'Failed to add item');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.message || 'Failed to add item',
        confirmButtonText: 'OK',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="item-added-page animate__animated animate__fadeIn">
      <div className="card item-card shadow-lg">
        <div className="card-header bg-dark text-white text-center">
          <h3 className="mb-0">Add New Clothing Item</h3>
        </div>
        <div className="card-body p-4">
          {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Item Name</label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="e.g. Casual Shirt"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Price (LKR)</label>
              <input
                type="number"
                className="form-control form-control-lg"
                placeholder="e.g. 1500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Select Gender</label>
              <select
                className="form-select form-select-lg"
                value={gender}
                onChange={handleGenderChange}
                required
              >
                <option value="">-- Select Gender --</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>

            {gender && (
              <div className="mb-4">
                <label className="form-label fw-bold">Item Type</label>
                <select
                  className="form-select form-select-lg"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  required
                >
                  <option value="">-- Select Item Type --</option>
                  {(gender === 'Men' ? menOptions : womenOptions).map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}


            <div className="mb-4">
              <label className="form-label fw-bold">Material</label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="e.g. Cotton, Polyester"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Upload Images (Max 5)</label>
              <input
                type="file"
                className="form-control form-control-lg"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              {images.length > 0 && (
                <div className="row mt-3 g-2">
                  {images.map((img, idx) => (
                    <div className="col-6 col-md-3" key={idx}>
                      <div className="position-relative">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`preview-${idx}`}
                          className="img-thumbnail preview-img"
                        />
                        {uploadProgress[idx] !== undefined && (
                          <div className="progress mt-2 rounded-3">
                            <div
                              className="progress-bar bg-primary"
                              role="progressbar"
                              style={{ width: `${uploadProgress[idx]}%` }}
                              aria-valuenow={uploadProgress[idx]}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              {Math.round(uploadProgress[idx])}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-custom"
                disabled={uploading || images.length === 0}
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Uploading...
                  </>
                ) : (
                  'Add Item'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ItemAdded;