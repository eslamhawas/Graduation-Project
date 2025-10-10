import React from 'react';
import './AccountForm.css';

const TextInput = ({ label, name, value, onChange, type = "text" }) => {
  const handleChange = (e) => {
    onChange(e);
  };

  return (
    <div className="input-container">
      <label className="input-label">{label}</label>
      <input
        className="form-input"
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default TextInput;