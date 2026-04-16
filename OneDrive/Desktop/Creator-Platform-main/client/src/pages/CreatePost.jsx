import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import ImageUpload from '../components/posts/ImageUpload'; // Adjust path as necessary

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Technology',
    status: 'draft'
  });

  // --- NEW STATE FOR IMAGES ---
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  // ----------------------------

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // --- NEW: HANDLE CLOUDINARY UPLOAD ---
  const handleUpload = async (imageFormData) => {
    setIsUploading(true);
    setUploadError('');
    try {
      // Step 1: Send FormData to your /api/upload endpoint
      const response = await api.post('/api/upload', imageFormData);
      
      // Step 2: Store the URL returned by Cloudinary
      setCoverImageUrl(response.data.url);
      toast.success('📸 Image ready for your post!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Image upload failed';
      setUploadError(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setIsLoading(true);

    try {
      // Build the final object including the coverImage URL
      const postData = {
        ...formData,
        coverImage: coverImageUrl // This is null if no image was uploaded
      };

      const response = await api.post('/api/posts', postData);
      
      if (response.data.success) {
        toast.success('🎉 Post created successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create post';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Create New Post</h1>
        <p style={subtitleStyle}>Share your thoughts with the world</p>
        
        {error && (
          <div style={errorStyle}>
            <span style={errorIconStyle}>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          
          {/* IMAGE UPLOAD SECTION */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Cover Image</label>
            <div style={uploadBoxStyle}>
              <ImageUpload onUpload={handleUpload} />
              
              {isUploading && (
                <p style={uploadStatusStyle}>✨ Uploading to Cloudinary...</p>
              )}
              
              {uploadError && (
                <p style={warningStyle}>❌ {uploadError}</p>
              )}
              
              {coverImageUrl && !isUploading && (
                <p style={successTextStyle}>✅ Image uploaded and attached!</p>
              )}
            </div>
          </div>

          {/* Title */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Title <span style={requiredStyle}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title"
              required
              style={inputStyle}
              maxLength={100}
            />
            <span style={hintStyle}>
              {formData.title.length}/100 characters
            </span>
          </div>

          {/* Content */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Content <span style={requiredStyle}>*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content... (minimum 10 characters)"
              rows="10"
              required
              style={textareaStyle}
            />
            <span style={hintStyle}>
              {formData.content.length} characters
              {formData.content.length < 10 && formData.content.length > 0 && 
                <span style={warningStyle}> (minimum 10 required)</span>
              }
            </span>
          </div>

          {/* Category & Status Row */}
          <div style={rowStyle}>
            <div style={{...fieldStyle, flex: 1}}>
              <label style={labelStyle}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Technology">🖥️ Technology</option>
                <option value="Lifestyle">🌟 Lifestyle</option>
                <option value="Travel">✈️ Travel</option>
                <option value="Food">🍔 Food</option>
              </select>
            </div>

            <div style={{...fieldStyle, flex: 1}}>
              <label style={labelStyle}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="draft">📝 Draft</option>
                <option value="published">✅ Published</option>
              </select>
            </div>
          </div>

          <div style={buttonGroupStyle}>
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              style={cancelButtonStyle}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading || isUploading || formData.content.length < 10}
              style={{
                ...buttonStyle,
                opacity: (isLoading || isUploading || formData.content.length < 10) ? 0.6 : 1,
                cursor: (isLoading || isUploading || formData.content.length < 10) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? '✨ Creating...' : '🚀 Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- STYLES ---

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '2rem 1rem',
  backgroundColor: '#f8f9fa',
  minHeight: '100vh',
};

const formContainerStyle = {
  width: '100%',
  maxWidth: '700px',
  backgroundColor: '#ffffff',
  padding: '2.5rem',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: '700',
  color: '#1a1a1a',
  marginBottom: '0.5rem',
};

const subtitleStyle = {
  fontSize: '1rem',
  color: '#6c757d',
  marginBottom: '2rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const rowStyle = {
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
};

const labelStyle = {
  fontSize: '0.95rem',
  fontWeight: '600',
  color: '#333',
};

const requiredStyle = {
  color: '#dc3545',
};

const inputStyle = {
  padding: '0.875rem 1rem',
  borderRadius: '8px',
  border: '2px solid #e1e4e8',
  fontSize: '1rem',
  transition: 'all 0.2s ease',
  outline: 'none',
  fontFamily: 'inherit',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '200px',
  resize: 'vertical',
  lineHeight: '1.6',
};

const uploadBoxStyle = {
  padding: '1rem',
  border: '2px dashed #e1e4e8',
  borderRadius: '8px',
  backgroundColor: '#fafbfc',
};

const uploadStatusStyle = {
  fontSize: '0.85rem',
  color: '#007bff',
  marginTop: '0.5rem',
  fontWeight: '500',
};

const successTextStyle = {
  fontSize: '0.85rem',
  color: '#28a745',
  marginTop: '0.5rem',
  fontWeight: '600',
};

const hintStyle = {
  fontSize: '0.85rem',
  color: '#6c757d',
};

const warningStyle = {
  color: '#dc3545',
  fontWeight: '600',
  fontSize: '0.85rem',
  marginTop: '0.5rem',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
};

const buttonStyle = {
  flex: 1,
  padding: '1rem',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
};

const cancelButtonStyle = {
  flex: 1,
  padding: '1rem',
  backgroundColor: 'white',
  color: '#6c757d',
  border: '2px solid #e1e4e8',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const errorStyle = {
  padding: '1rem 1.25rem',
  backgroundColor: '#f8d7da',
  color: '#721c24',
  borderRadius: '8px',
  marginBottom: '1.5rem',
  fontSize: '0.95rem',
  border: '1px solid #f5c6cb',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const errorIconStyle = {
  fontSize: '1.25rem',
};

export default CreatePost;