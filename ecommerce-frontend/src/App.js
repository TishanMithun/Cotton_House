import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from './Components/LoginPage';
import UserRegistration from './Components/UserRegistration';
import ItemAdded from './Components/ItemAdded';
import ClothingGallery from './Components/ClothingGallery';
import AdminRegister from './Components/AdminRegister';
import NavBarAdmin from './Components/NavBarAdmin';
import UpdateItems from './Components/UpdateItems';
import ClothingGalleryFilter from './Components/ClothingGalleryFilter';
import PaymentDetails from './Components/PaymentDetails';
import PaymentGraph from './Components/PaymentGraph';
import NavBarUsers from './Components/NavBarUsers';
import Footer from './Components/Footer';
import AboutUs from './Components/AboutUs';
import SeldItemsDetails from './Components/SeldItemsDetails';
import PaymentPortal from './Components/PaymentPortal';

import { jwtDecode } from 'jwt-decode';

function AppWrapper() {
  const location = useLocation();

  // Define paths where navbar and footer should NOT show
  const hideNavbarAndFooterPaths = ['/', '/UserRegistration'];

  const shouldShowNavbarAndFooter = !hideNavbarAndFooterPaths.includes(location.pathname);

  // Get token and safely decode it
  const token = localStorage.getItem('token');
  let userRole = 'Admin'; // Default to Admin if token is invalid or missing
  if (token && typeof token === 'string') {
    try {
      const decodeToken = jwtDecode(token);
      userRole = decodeToken.role || 'User'; // Use role from token, fallback to User
    } catch (error) {
      console.error('Invalid token:', error.message);
    }
  } else {
    console.log('No token found in localStorage');
  }
  console.log('User Role:', userRole); // Debugging line to check user role

  return (
    <>
      {shouldShowNavbarAndFooter && (userRole === 'User' ? <NavBarUsers /> : <NavBarAdmin />)}
      <main>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/UserRegistration" element={<UserRegistration />} />
          <Route path="/ItemAdded" element={<ItemAdded />} />
          <Route path="/ClothingGallery" element={<ClothingGallery />} />
          <Route path="/AdminRegister" element={<AdminRegister />} />
          <Route path="/UpdateItems" element={<UpdateItems />} />
          <Route path="/ClothingGalleryFilter" element={<ClothingGalleryFilter />} />
          <Route path="/PaymentDetails" element={<PaymentDetails />} />
          <Route path="/PaymentGraph" element={<PaymentGraph />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/SoldItemsDetails" element={<SeldItemsDetails />} />
          <Route path="/PaymentPortal" element={<PaymentPortal />} />
          {/* Removed the standalone Footer route as it will be part of the layout */}
        </Routes>
      </main>
      {shouldShowNavbarAndFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;