import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    status: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch post data when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/posts/${id}`);
        const post = response.data.data;
        
        setFormData({
          title: post.title,
          content: post.content,
          category: post.category,
          status: post.status
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load post');
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    if (formData.content.trim().length < 10) {
      setError('Content must be at least 10 characters long');
      return;
    }

    setIsSaving(true);

    try {
      const response = await api.put(`/api/posts/${id}`, formData);
      
      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update post';
      setError(errorMessage);
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/posts/${id}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle}>⏳</div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div style={errorPageStyle}>
        <div style={errorIconLargeStyle}>⚠️</div>
        <h2>Error Loading Post</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')} style={backButtonStyle}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={headerSectionStyle}>
          <div>
            <h1 style={titleStyle}>Edit Post</h1>
            <p style={subtitleStyle}>Update your post content and settings</p>
          </div>
          <button 
            type="button"
            onClick={handleDelete}
            style={deleteButtonStyle}
            title="Delete this post"
          >
            🗑️ Delete
          </button>
        </div>
        
        {error && (
          <div style={errorStyle}>
            <span style={errorIconStyle}>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
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
              rows="12"
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

          {/* Category */}
          <div style={fieldStyle}>
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

          {/* Status */}
          <div style={fieldStyle}>
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

          {/* Action Buttons */}
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
              disabled={isSaving || formData.content.length < 10}
              style={{
                ...submitButtonStyle,
                opacity: (isSaving || formData.content.length < 10) ? 0.6 : 1,
                cursor: (isSaving || formData.content.length < 10) ? 'not-allowed' : 'pointer'
              }}
            >
              {isSaving ? '💾 Saving...' : '✨ Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Elegant Styles

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

const headerSectionStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '2rem',
  gap: '1rem',
  flexWrap: 'wrap',
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
  margin: 0,
};

const deleteButtonStyle = {
  padding: '0.75rem 1.25rem',
  backgroundColor: '#fff',
  color: '#dc3545',
  border: '2px solid #dc3545',
  borderRadius: '8px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
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
  minHeight: '250px',
  resize: 'vertical',
  lineHeight: '1.6',
};

const hintStyle = {
  fontSize: '0.85rem',
  color: '#6c757d',
};

const warningStyle = {
  color: '#dc3545',
  fontWeight: '600',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
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

const submitButtonStyle = {
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

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  gap: '1rem',
  fontSize: '1.125rem',
  color: '#6c757d',
};

const spinnerStyle = {
  fontSize: '3rem',
  animation: 'spin 2s linear infinite',
};

const errorPageStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  padding: '2rem',
  textAlign: 'center',
  color: '#721c24',
};

const errorIconLargeStyle = {
  fontSize: '4rem',
  marginBottom: '1rem',
};

const backButtonStyle = {
  marginTop: '2rem',
  padding: '0.875rem 2rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

export default EditPost;