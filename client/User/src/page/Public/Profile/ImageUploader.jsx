import React, { useRef, useState } from 'react';
import './AccountForm.css';
const ImageUploader = () => {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="profile-photo-section">
      <div className="photo-upload-container" onClick={triggerFileInput}>
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="profile-photo" />
        ) : (
          <div className="upload-placeholder">
            <span>+</span>
            <p>Upload Photo</p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
      <div className="upload-instructions">
        Click on the circle to upload a profile photo
      </div>
    </div>
  );
};

export default ImageUploader;