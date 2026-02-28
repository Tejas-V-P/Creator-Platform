import { useAuth } from '../context/authContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Auth...</div>;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const handleClick = () => {
    alert("Button Doesnt Work 🙄");
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Dashboard</h1>
        <p>Welcome back! {user.name}</p>
      </div>

      <div style={contentStyle}>
        <div style={cardStyle}>
          <h2>Your Account</h2>
          <div style={infoStyle}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {/* Added optional chaining for safety */}
            <p><strong>Member Since:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}</p>
          </div>
        </div>

        <div style={placeholderStyle}>
          <h2>Dashboard</h2>
          <p>Our Website Provides you with the best services of <span style={errorStyle}>("404 Word Not found")</span></p>
          
          {/* 4. Use the logout function from Context */}
          <button onClick={logout} style={logoutButtonStyle}>
            Logout
          </button>
        
          <ul style={listStyle}>
            <li>Todays Posts...</li>
            <li>Statistics and analytics</li>
            <li>
              Quick actions 
              <button onClick={handleClick} style={actionButtonStyle}>Create</button> 
              <button onClick={handleClick} style={actionButtonStyle}>Edit</button> 
              <button onClick={handleClick} style={actionButtonStyle}>Delete</button> 
            </li>
            <li>Recent activity <button style={actionButtonStyle}>Show History</button></li>
          </ul>
          <p style={noteStyle}>
            App is UNDER CONSTRUCTION... <br />
            Might fall into a pit of "404 Not found" if explored too much.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Styles (Kept exactly as yours, added one for buttons) ---

const actionButtonStyle = {
  marginLeft: '5px',
  cursor: 'pointer'
};

const containerStyle = {
  minHeight: '80vh',
  padding: '2rem',
};

const headerStyle = {
  maxWidth: '1200px',
  margin: '0 auto 2rem',
};

const contentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
};

const placeholderStyle = {
  backgroundColor: '#f8f9fa',
  padding: '2rem',
  borderRadius: '8px',
};

const listStyle = {
  paddingLeft: '1.5rem',
  marginTop: '1rem',
};

const noteStyle = {
  marginTop: '1rem',
  fontStyle: 'italic',
  color: '#666',
};

const errorStyle = {
  marginTop: '1rem',
  fontStyle: 'italic',
  color: 'red',
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  marginBottom: '2rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const infoStyle = {
  marginTop: '1rem',
};

const logoutButtonStyle = {
  backgroundColor: '#dc3545',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '1rem',
};

export default Dashboard;