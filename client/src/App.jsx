import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';

// 1. Ensure consistent naming (PublicRoute usually capitalized)
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/publicRoute'; 

import { AuthProvider } from './context/authContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={appStyle}>
          <Header />

          <main style={mainStyle}>
            <Routes>
              {/* PUBLIC ROUTES: Accessible to everyone */}
              <Route path="/" element={<Home />} />

              {/* AUTH ROUTES: Only for users who are NOT logged in */}
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

              {/* PROTECTED ROUTES: Only for logged-in users */}
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
              
              <Route 
                path="/edit/:id" 
                element={
                  <ProtectedRoute>
                    <EditPost />
                  </ProtectedRoute>
                } 
              />
              
              {/* Example of adding more protected routes easily:
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              /> 
              */}
              
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

// Styles kept consistent
const appStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const mainStyle = {
  flex: 1,
};

export default App;