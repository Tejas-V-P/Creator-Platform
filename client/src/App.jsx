import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// 1. Import the AuthProvider
import { AuthProvider } from './context/authContext';

function App() {
  return (
    <BrowserRouter>
      {/* 2. Wrap everything inside AuthProvider so all components can access auth state */}
      <AuthProvider>
        <div style={appStyle}>
          {/* Header appears on all pages and can now use useAuth() */}
          <Header />

          {/* Main content area */}
          <main style={mainStyle}>
            <Routes>
              {/* Define your routes here */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* 404 Page - catches all unmatched routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer appears on all pages */}
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Simple 404 component
const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
};

const appStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const mainStyle = {
  flex: 1,
};

export default App;