import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      // Not logged in - redirect to login
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      // Use a microtask to avoid synchronous setState in effect
      Promise.resolve().then(() => setUser(parsedUser));
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);
   const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login
    navigate('/login');
  };

  if (!user) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }


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
            <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div style={placeholderStyle}>
          <h2>Dashboard</h2>
          <p>Our Website Provides you with the best services of <span style={errorStyle} >("404 Word Not found")</span>
          </p>
          <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
        
          <ul style={listStyle}>
            <li>Todays Posts...</li>
            <li>Statistics and analytics</li>
            <li>Quick actions <button onClick={handleClick}>Create</button> <button onClick={handleClick}>Edit</button> <button onClick={handleClick}>Delete</button> </li>
            <li>Recent activity <button>Show History</button></li>
          </ul>
          <p style={noteStyle}>
            App is UNDER CONSTRUCTION... <br></br>
            Might fall into a pit of "404 Not found" is explored too much.
          </p>
        </div>
      </div>
    </div>
  );
};

const handleClick = () => {
    alert("Button Doesnt Work 🙄")
}

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