import React from 'react';
import TextInput from './TextInput';
import './AccountForm.css';
const PasswordInput = () => {
  return (
    <div className="password-section">
      <h3 className="section-title">Password Changes</h3>
      <TextInput 
        label="Current Password"
        name="currentPassword"
        type="password"
      />
      <TextInput 
        label="New Password"
        name="newPassword"
        type="password"
      />
      <TextInput 
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
      />
    </div>
  );
};

export default PasswordInput;