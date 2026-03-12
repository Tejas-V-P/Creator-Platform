import { useAuth } from '../context/authContext';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleAction = async (action) => {
    try {
      // Example of using the api utility for different actions
      if (action === 'delete') {
        await api.delete('/api/posts/1'); // Replace with your actual ID logic
        alert('Item deleted successfully!');
      } else {
        alert(`${action} action triggered successfully!`);
      }
    } catch (error) {
      console.error(`${action} failed:`, error);
      alert('Action failed. Please check console.');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      <div style={contentStyle}>
        <div style={cardStyle}>
          <h2>Your Account</h2>
          <div style={infoStyle}>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}</p>
          </div>
        </div>

        <div style={placeholderStyle}>
          <h2>Quick Actions</h2>
          <button onClick={logout} style={logoutButtonStyle}>Logout</button>
          
          <ul style={listStyle}>
            <li>Statistics and analytics</li>
            <li>
              Actions: 
              <button onClick={() => handleAction('create')} style={actionButtonStyle}>Create</button> 
              <button onClick={() => handleAction('edit')} style={actionButtonStyle}>Edit</button> 
              <button onClick={() => handleAction('delete')} style={actionButtonStyle}>Delete</button> 
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- Styles ---

const containerStyle = { minHeight: '80vh', padding: '2rem' };
const headerStyle = { maxWidth: '1200px', margin: '0 auto 2rem' };
const contentStyle = { maxWidth: '1200px', margin: '0 auto' };
const placeholderStyle = { backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '8px' };
const listStyle = { paddingLeft: '1.5rem', marginTop: '1rem' };
const cardStyle = { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const infoStyle = { marginTop: '1rem' };
const actionButtonStyle = { marginLeft: '5px', cursor: 'pointer', padding: '5px 10px' };
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