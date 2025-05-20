import React from 'react';
const Banner = ({ firstName, lastName, profileImage }) => {
  const styles = {
    welcomeBanner: {
      padding: '1rem'
    },
    profileHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      justifyContent: 'center'
    },
    profileImage: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    divider: {
      border: 'none',
      height: '1px',
      backgroundColor: '#ddd',
      margin: '1rem 0'
    }
  };

  return (
    <div style={styles.welcomeBanner}>
      <div style={styles.profileHeader}>
        {profileImage && (
          <img src={profileImage} alt="Profile" style={styles.profileImage} />
        )}
        <h2>Welcome {firstName} {lastName}</h2>
      </div>
      <hr style={styles.divider} />
    </div>
  );
};

export default Banner;