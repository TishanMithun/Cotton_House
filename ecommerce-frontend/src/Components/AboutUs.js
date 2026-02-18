import React, { useState, useEffect } from 'react';

function AboutUs() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Using placeholder images for demo - replace with your actual images
  const images = [
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=600&fit=crop'
  ];

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c6b35, #064c24)',
      color: '#ffffff',
      fontFamily: "'Poppins', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      padding: '60px 20px'
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
      zIndex: 0
    },
    contentWrapper: {
      position: 'relative',
      zIndex: 1,
      maxWidth: '1200px',
      margin: '0 auto',
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 1s ease-out'
    },
    title: {
      fontSize: '4rem',
      fontWeight: '900',
      textAlign: 'center',
      marginBottom: '3rem',
      background: 'linear-gradient(135deg, #ffffff, #10b981, #ffffff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 4px 8px rgba(0,0,0,0.3)',
      position: 'relative'
    },
    titleUnderline: {
      width: '100px',
      height: '4px',
      background: 'linear-gradient(90deg, #10b981, #06b6d4)',
      margin: '1rem auto',
      borderRadius: '2px',
      animation: 'pulse 2s infinite'
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
      gap: '4rem',
      alignItems: 'center',
      marginBottom: '4rem'
    },
    imageSection: {
      position: 'relative'
    },
    imageContainer: {
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 25px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
      transform: 'perspective(1000px) rotateY(-5deg)',
      transition: 'all 0.5s ease',
      cursor: 'pointer'
    },
    imageContainerHover: {
      transform: 'perspective(1000px) rotateY(0deg) scale(1.02)',
      boxShadow: '0 35px 70px rgba(16,185,129,0.3), 0 0 0 1px rgba(255,255,255,0.2)'
    },
    image: {
      width: '100%',
      height: '400px',
      objectFit: 'cover',
      transition: 'all 0.7s ease'
    },
    imageOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    indicators: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      marginTop: '2rem'
    },
    indicator: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    indicatorActive: {
      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
      transform: 'scale(1.3)',
      boxShadow: '0 0 20px rgba(16,185,129,0.6)'
    },
    indicatorInactive: {
      background: 'rgba(255,255,255,0.3)'
    },
    contentSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    },
    contentCard: {
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: '20px',
      padding: '2.5rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease'
    },
    contentCardHover: {
      background: 'rgba(255,255,255,0.12)',
      border: '1px solid rgba(255,255,255,0.25)',
      transform: 'translateY(-5px)',
      boxShadow: '0 30px 60px rgba(0,0,0,0.3)'
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    titleAccent: {
      width: '50px',
      height: '4px',
      background: 'linear-gradient(90deg, #10b981, #06b6d4)',
      borderRadius: '2px'
    },
    paragraph: {
      fontSize: '1.1rem',
      lineHeight: '1.8',
      color: '#e6fffa',
      marginBottom: '1.5rem'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem'
    },
    featureCard: {
      background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.15))',
      border: '1px solid rgba(16,185,129,0.3)',
      borderRadius: '15px',
      padding: '1.5rem',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    featureCardHover: {
      transform: 'translateY(-5px) scale(1.02)',
      background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(6,182,212,0.25))',
      border: '1px solid rgba(16,185,129,0.5)',
      boxShadow: '0 15px 35px rgba(16,185,129,0.2)'
    },
    featureIcon: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      fontSize: '1.5rem'
    },
    contactSection: {
      textAlign: 'center',
      marginTop: '6rem'
    },
    contactCard: {
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '25px',
      padding: '3rem',
      maxWidth: '800px',
      margin: '0 auto',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
    },
    contactGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      marginBottom: '2.5rem'
    },
    contactItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    },
    contactIcon: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      transition: 'transform 0.3s ease'
    },
    contactIconHover: {
      transform: 'scale(1.1) rotate(5deg)'
    },
    button: {
      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
      border: 'none',
      color: 'white',
      padding: '15px 40px',
      borderRadius: '15px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 25px rgba(16,185,129,0.3)'
    },
    buttonHover: {
      transform: 'translateY(-3px) scale(1.05)',
      boxShadow: '0 20px 40px rgba(16,185,129,0.4)'
    },
    emailLink: {
      color: '#10b981',
      textDecoration: 'none',
      transition: 'color 0.3s ease'
    }
  };

  const [hoveredElements, setHoveredElements] = useState({});

  const handleMouseEnter = (element) => {
    setHoveredElements(prev => ({ ...prev, [element]: true }));
  };

  const handleMouseLeave = (element) => {
    setHoveredElements(prev => ({ ...prev, [element]: false }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.contentWrapper}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={styles.title}>About Us</h1>
          <div style={styles.titleUnderline}></div>
          <p style={{ fontSize: '1.3rem', color: '#a7f3d0', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Crafting fashion stories that inspire confidence and celebrate individuality
          </p>
        </div>

        {/* Main Content */}
        <div style={styles.mainGrid}>
          {/* Image Section */}
          <div style={styles.imageSection}>
            <div 
              style={{
                ...styles.imageContainer,
                ...(hoveredElements.imageContainer ? styles.imageContainerHover : {})
              }}
              onMouseEnter={() => handleMouseEnter('imageContainer')}
              onMouseLeave={() => handleMouseLeave('imageContainer')}
            >
              <img
                src={images[currentImage]}
                alt={`Fashion Collection ${currentImage + 1}`}
                style={styles.image}
              />
              <div 
                style={{
                  ...styles.imageOverlay,
                  opacity: hoveredElements.imageContainer ? 1 : 0
                }}
              ></div>
            </div>
            
            {/* Image Indicators */}
            <div style={styles.indicators}>
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  style={{
                    ...styles.indicator,
                    ...(currentImage === index ? styles.indicatorActive : styles.indicatorInactive)
                  }}
                />
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div style={styles.contentSection}>
            <div 
              style={{
                ...styles.contentCard,
                ...(hoveredElements.contentCard ? styles.contentCardHover : {})
              }}
              onMouseEnter={() => handleMouseEnter('contentCard')}
              onMouseLeave={() => handleMouseLeave('contentCard')}
            >
              <h2 style={styles.sectionTitle}>
                <div style={styles.titleAccent}></div>
                Our Story
              </h2>
              <p style={styles.paragraph}>
                Welcome to our online clothing store! We are passionate about delivering high-quality, stylish apparel to our customers. Founded with a vision to blend fashion with comfort, our team works tirelessly to curate the latest trends and offer a seamless shopping experience.
              </p>
              <p style={styles.paragraph}>
                Our mission is to empower you with confidence through every outfit you choose. With a commitment to sustainability and customer satisfaction, we source materials responsibly and ensure top-notch service.
              </p>
            </div>

            {/* Features */}
            <div style={styles.featuresGrid}>
              <div 
                style={{
                  ...styles.featureCard,
                  ...(hoveredElements.feature1 ? styles.featureCardHover : {})
                }}
                onMouseEnter={() => handleMouseEnter('feature1')}
                onMouseLeave={() => handleMouseLeave('feature1')}
              >
                <div style={styles.featureIcon}>✓</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem' }}>Premium Quality</h3>
                <p style={{ color: '#a7f3d0', fontSize: '0.95rem' }}>Finest materials and craftsmanship</p>
              </div>
              
              <div 
                style={{
                  ...styles.featureCard,
                  ...(hoveredElements.feature2 ? styles.featureCardHover : {})
                }}
                onMouseEnter={() => handleMouseEnter('feature2')}
                onMouseLeave={() => handleMouseLeave('feature2')}
              >
                <div style={styles.featureIcon}>🌱</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem' }}>Sustainable</h3>
                <p style={{ color: '#a7f3d0', fontSize: '0.95rem' }}>Eco-friendly and responsible sourcing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div style={styles.contactSection}>
          <div style={styles.contactCard}>
            <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '2rem', color: '#ffffff' }}>
              Get in Touch
            </h2>
            
            <div style={styles.contactGrid}>
              <div style={styles.contactItem}>
                <div 
                  style={{
                    ...styles.contactIcon,
                    ...(hoveredElements.emailIcon ? styles.contactIconHover : {})
                  }}
                  onMouseEnter={() => handleMouseEnter('emailIcon')}
                  onMouseLeave={() => handleMouseLeave('emailIcon')}
                >
                  ✉
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Email</h3>
                  <a 
                    href="mailto:support@clothingstore.com" 
                    style={{
                      ...styles.emailLink,
                      color: hoveredElements.emailLink ? '#06b6d4' : '#10b981'
                    }}
                    onMouseEnter={() => handleMouseEnter('emailLink')}
                    onMouseLeave={() => handleMouseLeave('emailLink')}
                  >
                    support@clothingstore.com
                  </a>
                </div>
              </div>

              <div style={styles.contactItem}>
                <div 
                  style={{
                    ...styles.contactIcon,
                    ...(hoveredElements.phoneIcon ? styles.contactIconHover : {})
                  }}
                  onMouseEnter={() => handleMouseEnter('phoneIcon')}
                  onMouseLeave={() => handleMouseLeave('phoneIcon')}
                >
                  📞
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Phone</h3>
                  <p style={{ color: '#a7f3d0', margin: 0 }}>+94 123 456 789</p>
                </div>
              </div>

              <div style={styles.contactItem}>
                <div 
                  style={{
                    ...styles.contactIcon,
                    ...(hoveredElements.locationIcon ? styles.contactIconHover : {})
                  }}
                  onMouseEnter={() => handleMouseEnter('locationIcon')}
                  onMouseLeave={() => handleMouseLeave('locationIcon')}
                >
                  📍
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Location</h3>
                  <p style={{ color: '#a7f3d0', margin: 0 }}>123 Fashion Street<br />Colombo, Sri Lanka</p>
                </div>
              </div>
            </div>

            <button 
              style={{
                ...styles.button,
                ...(hoveredElements.ctaButton ? styles.buttonHover : {})
              }}
              onMouseEnter={() => handleMouseEnter('ctaButton')}
              onMouseLeave={() => handleMouseLeave('ctaButton')}
            onClick={() => window.location.href = '/ClothingGallery'}>
              Start Shopping
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '2rem',
          marginTop: '5rem'
        }}>
          {[
            { number: '10K+', label: 'Happy Customers' },
            { number: '500+', label: 'Products' },
            { number: '5★', label: 'Average Rating' },
            { number: '24/7', label: 'Support' }
          ].map((stat, index) => (
            <div 
              key={index}
              style={{
                textAlign: 'center',
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '15px',
                padding: '2rem 1rem',
                transition: 'all 0.3s ease',
                transform: hoveredElements[`stat${index}`] ? 'translateY(-5px) scale(1.05)' : 'translateY(0) scale(1)',
                boxShadow: hoveredElements[`stat${index}`] ? '0 15px 30px rgba(16,185,129,0.2)' : '0 5px 15px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={() => handleMouseEnter(`stat${index}`)}
              onMouseLeave={() => handleMouseLeave(`stat${index}`)}
            >
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: '900', 
                color: '#10b981',
                marginBottom: '0.5rem'
              }}>
                {stat.number}
              </div>
              <div style={{ 
                fontSize: '1rem', 
                fontWeight: '500',
                color: '#a7f3d0'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '5rem',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '25px',
          padding: '3rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            fontSize: '2rem'
          }}>
            ❤️
          </div>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#ffffff' }}>
            Our Promise
          </h3>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#a7f3d0', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            Whether you're looking for casual wear or formal attire like our stunning Kurti sarees, we've got you covered! 
            Every piece tells a story of tradition meeting modernity.
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        * {
          box-sizing: border-box;
        }
        
        @media (max-width: 768px) {
          .main-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          
          .title {
            font-size: 2.5rem !important;
          }
          
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AboutUs;