import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  // 1. Form field states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // 2. UI and Feedback states
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();

  // 3. Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 4. Client-Side Validation Logic
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }

    // Email validation (Regex)
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 5. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page reload
    setApiError('');
    setSuccessMessage('');

    // Run client-side validation
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare data (exclude confirmPassword)
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      };

      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Handle backend errors (e.g., User already exists)
        setApiError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setApiError('Unable to connect to the server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Create Your Account</h1>
        <p style={subtitleStyle}>
          Join our Creator Platform and start creating today
        </p>

        {/* Success Message */}
        {successMessage && (
          <div style={successStyle}>
            {successMessage}
          </div>
        )}

        {/* API Error Message */}
        {apiError && (
          <div style={errorMessageStyle}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          
          {/* Name Field */}
          <div style={fieldStyle}>
            <label htmlFor="name" style={labelStyle}>Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={errors.name ? inputErrorStyle : inputStyle}
              disabled={isLoading}
            />
            {errors.name && <span style={errorTextStyle}>{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div style={fieldStyle}>
            <label htmlFor="email" style={labelStyle}>Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={errors.email ? inputErrorStyle : inputStyle}
              disabled={isLoading}
            />
            {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div style={fieldStyle}>
            <label htmlFor="password" style={labelStyle}>Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              style={errors.password ? inputErrorStyle : inputStyle}
              disabled={isLoading}
            />
            {errors.password && <span style={errorTextStyle}>{errors.password}</span>}
          </div>

          {/* Confirm Password Field */}
          <div style={fieldStyle}>
            <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              style={errors.confirmPassword ? inputErrorStyle : inputStyle}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <span style={errorTextStyle}>{errors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit" 
            style={isLoading ? buttonDisabledStyle : buttonStyle}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={linkTextStyle}>
          Already have an account?{' '}
          <Link to="/login" style={linkStyle}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

// --- STYLES (CSS-in-JS) ---

const containerStyle = {
  minHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  backgroundColor: '#f8f9fa',
};

const formContainerStyle = {
  maxWidth: '450px',
  width: '100%',
  padding: '2.5rem',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '0.5rem',
  color: '#333',
  fontSize: '2rem',
};

const subtitleStyle = {
  textAlign: 'center',
  color: '#666',
  marginBottom: '2rem',
  fontSize: '0.95rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: '0.5rem',
  fontWeight: '500',
  color: '#333',
  fontSize: '0.9rem',
};

const inputStyle = {
  padding: '0.75rem',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '5px',
  transition: 'border-color 0.3s',
};

const inputErrorStyle = {
  ...inputStyle,
  borderColor: '#dc3545',
};

const errorTextStyle = {
  color: '#dc3545',
  fontSize: '0.85rem',
  marginTop: '0.25rem',
};

const buttonStyle = {
  padding: '0.875rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#007bff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  marginTop: '0.5rem',
};

const buttonDisabledStyle = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
  cursor: 'not-allowed',
};

const successStyle = {
  padding: '1rem',
  backgroundColor: '#d4edda',
  color: '#155724',
  borderRadius: '5px',
  marginBottom: '1rem',
  border: '1px solid #c3e6cb',
};

const errorMessageStyle = {
  padding: '1rem',
  backgroundColor: '#f8d7da',
  color: '#721c24',
  borderRadius: '5px',
  marginBottom: '1rem',
  border: '1px solid #f5c6cb',
};

const linkTextStyle = {
  textAlign: 'center',
  marginTop: '1.5rem',
  color: '#666',
};

const linkStyle = {
  color: '#007bff',
  textDecoration: 'none',
  fontWeight: '500',
};

export default Register;