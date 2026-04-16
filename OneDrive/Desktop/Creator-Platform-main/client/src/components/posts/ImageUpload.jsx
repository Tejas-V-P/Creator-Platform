import React, { useState } from 'react';

const ImageUpload = ({ onUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local preview so the user sees what they picked
      setPreview(URL.createObjectURL(file));

      // Create FormData to send to the backend
      const formData = new FormData();
      formData.append('image', file);

      // Send it up to the parent (CreatePost.jsx)
      onUpload(formData);
    }
  };

  return (
    <div style={containerStyle}>
      {preview && (
        <div style={previewContainerStyle}>
          <img src={preview} alt="Preview" style={imageStyle} />
        </div>
      )}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        style={inputStyle}
      />
      <p style={hintStyle}>Supports: JPG, PNG, WebP (Max 5MB)</p>
    </div>
  );
};

// --- STYLES ---

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%'
};

const previewContainerStyle = {
  width: '100%',
  height: '150px',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid #ddd'
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const inputStyle = {
  fontSize: '0.9rem',
  color: '#666'
};

const hintStyle = {
  fontSize: '0.75rem',
  color: '#999',
  margin: 0
};

export default ImageUpload;