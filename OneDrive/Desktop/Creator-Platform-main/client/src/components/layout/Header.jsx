import { Link } from 'react-router-dom';
// 1. Import the custom hook
import { useAuth } from '../../context/authContext'; 

const Header = () => {
  // 2. Destructure the values you need from context
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <h1 style={logoStyle}>
          <Link to="/" style={linkStyle}>
            {"SportX"}
          </Link>
        </h1>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={navLinkStyle}>Home</Link>
          
          {/* 3. Conditional Rendering based on Auth Status */}
          {isAuthenticated() ? (
            <>
              <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
              <span style={{ ...navLinkStyle, color: '#4da6ff' }}>
                Hi, {user?.name || 'User'}
              </span>
              <button 
                onClick={logout} 
                style={logoutButtonStyle}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>Login</Link>
              <Link to="/register" style={navLinkStyle}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

// --- Styles ---

const headerStyle = {
  backgroundColor: '#333',
  color: 'white',
  padding: '1rem 0',
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle = {
  margin: 0,
  fontSize: '1.5rem',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
};

const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  marginLeft: '2rem',
};

// Added a simple style for the logout button to match your theme
const logoutButtonStyle = {
  backgroundColor: '#ff4d4d',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  marginLeft: '2rem',
  fontSize: '0.9rem',
  fontWeight: 'bold'
};

export default Header;