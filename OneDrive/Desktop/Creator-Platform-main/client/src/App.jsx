import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast'; // Added for Lesson 4.3 requirement
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';

// Ensure naming consistency
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/publicRoute'; 

import { AuthProvider } from './context/authContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={appStyle}>
          {/* Lesson 4.3: Added Toaster here. 
              Note: You now have both Toastify and Hot-Toast. 
              Use toast.success() from 'react-hot-toast' for the socket notifications.
          */}
          <Toaster position="top-right" reverseOrder={false} />
          
          <ToastContainer position="top-right" autoClose={3000} />
          
          <Header />

          <main style={mainStyle}>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />

              {/* AUTH ROUTES */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />

              {/* PROTECTED ROUTES */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/create" 
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/edit/:id" 
                element={
                  <ProtectedRoute>
                    <EditPost />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

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