import React from 'react';
import './Footer.css';
import Location from '../Images/Location.png';
import FacebookIcon from '../Images/Facebook.png';
import InstagramIcon from '../Images/Instergram.png';
import TikTokIcon from '../Images/Tiktok.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <p>Fashion doesn't wait for perfect weather!</p>
          <p>Come rain, come shine - our home-based store is open daily.</p>
          <p>
            28 Karlsruhe Gardens<br />
            Borella<br />
            Sri Lanka<br />
            +9477555313<br />
            10:00 am - 9:00 pm
          </p>
        </div>
        <div className="footer-section">
          <h3>QUICK LINKS</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/my-account">My Account</a></li>
            <li><a href="/shop-now">Shop Now</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <p>Stay connected and discover our latest collections and offers by following us on social media.</p>
          <div className="social-icons">
            <a href="https://web.facebook.com/CottonMantraa/?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer">
              <img src={FacebookIcon} alt="Facebook" className="social-icon" />
            </a>
            <a href="https://www.instagram.com/cotton.mantra/" target="_blank" rel="noopener noreferrer">
              <img src={InstagramIcon} alt="Instagram" className="social-icon" />
            </a>
            <a href="https://www.tiktok.com/@cottonmantra" target="_blank" rel="noopener noreferrer">
              <img src={TikTokIcon} alt="TikTok" className="social-icon" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-map">
        <img src={Location} alt="Store Location Map" />
      </div>
    </footer>
  );
}

export default Footer;