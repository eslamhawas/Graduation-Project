import React, { useState } from 'react';
import TextInput from './TextInput';
import PasswordInput from './PasswordInput';
import ImageUploader from './ImageUploader';
import './AccountForm.css';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    profileImage: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="account-container">
      <h2 className="account-title">Edit Your Profile</h2>
      
      <ImageUploader />
      
      <div className="form-row">
        <div className="form-column">
          <TextInput 
            label="First Name" 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleInputChange}
          />
        </div>
        <div className="form-column">
          <TextInput 
            label="Last Name" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-column">
          <TextInput 
            label="Email" 
            name="email" 
            value={formData.email} 
            onChange={handleInputChange}
          />
        </div>
        <div className="form-column">
          <TextInput 
            label="Address" 
            name="address" 
            value={formData.address} 
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <PasswordInput
        currentPassword={formData.currentPassword}
        newPassword={formData.newPassword}
        confirmPassword={formData.confirmPassword}
        onChange={handleInputChange}
      />
      
      <div className="button-group">
        <button className="cancel-button">Cancel</button>
        <button className="save-button">Save Changes</button>
      </div>
    </div>
  );
};

export default ProfileForm;