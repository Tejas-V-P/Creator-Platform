import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { toast as toastify } from 'react-toastify'; 
import toast from 'react-hot-toast'; // 🆕 For Lesson 4.3 real-time notifications
import api from '../services/api';
import socket from '../services/socket'; 

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async (page) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.get(`/api/posts?page=${page}&limit=10`);
      setPosts(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      const errorMsg = 'Failed to load posts';
      toastify.error(errorMsg);
      setError(errorMsg);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // EFFECT: Socket connection and Real-Time Event Listeners
  useEffect(() => {
    // Establish connection
    socket.connect();

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
    });

    // 🆕 LISTEN for new post events from ANY user
    socket.on('newPost', (data) => {
      // Trigger the react-hot-toast notification
      toast.success(`📢 New post: "${data.title}" by ${data.author}`, {
        duration: 6000,
        icon: '🚀',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      
      // Refresh the list automatically so the new post appears
      fetchPosts(currentPage);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    // CLEANUP: Remove listeners to prevent memory leaks and duplicate toasts
    return () => {
      socket.off('connect');
      socket.off('newPost');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [currentPage, fetchPosts]); 

  // EFFECT: Fetch posts on page change
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, fetchPosts]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
      toastify.success('Post deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toastify.error(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle}>⏳</div>
        <p>Loading your posts...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>
        {/* Header Section */}
        <div style={headerStyle}>
          <div style={welcomeSection}>
            <h1 style={titleStyle}>Welcome back, {user?.name}! 👋</h1>
            <p style={subtitleStyle}>Manage your posts and track your content</p>
          </div>
          <Link to="/create" style={{ textDecoration: 'none' }}>
            <button style={createButtonStyle}>
              <span style={buttonIconStyle}>+</span>
              Create New Post
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={statsContainerStyle}>
          <div style={statCardStyle}>
            <div style={statIconStyle}>📝</div>
            <div>
              <div style={statNumberStyle}>{pagination.total || 0}</div>
              <div style={statLabelStyle}>Total Posts</div>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={statIconStyle}>✅</div>
            <div>
              <div style={statNumberStyle}>{posts.filter(p => p.status === 'published').length}</div>
              <div style={statLabelStyle}>Published</div>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={statIconStyle}>📄</div>
            <div>
              <div style={statNumberStyle}>{posts.filter(p => p.status === 'draft').length}</div>
              <div style={statLabelStyle}>Drafts</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={errorStyle}>
            <span style={errorIconStyle}>⚠️</span>
            {error}
          </div>
        )}

        {/* Posts Section */}
        <div style={postsContainerStyle}>
          <h2 style={sectionTitleStyle}>Your Posts</h2>
          
          {posts.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={emptyIconStyle}>📭</div>
              <h3 style={emptyTitleStyle}>No posts yet</h3>
              <p style={emptyTextStyle}>Start creating amazing content today!</p>
              <Link to="/create" style={{ textDecoration: 'none' }}>
                <button style={emptyButtonStyle}>Create Your First Post</button>
              </Link>
            </div>
          ) : (
            <>
              <div style={postsGridStyle}>
                {posts.map((post) => (
                  <div key={post._id} style={postCardStyle}>
                    <div style={postHeaderStyle}>
                      <span style={getCategoryBadgeStyle(post.category)}>
                        {post.category}
                      </span>
                      <span style={getStatusBadgeStyle(post.status)}>
                        {post.status}
                      </span>
                    </div>
                    
                    <h3 style={postTitleStyle}>{post.title}</h3>
                    <p style={contentPreviewStyle}>
                      {post.content.substring(0, 120)}
                      {post.content.length > 120 && '...'}
                    </p>
                    
                    <div style={postFooterStyle}>
                      <span style={dateStyle}>
                        📅 {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <div style={actionsContainerStyle}>
                        <Link to={`/edit/${post._id}`} style={{ textDecoration: 'none' }}>
                          <button style={editButtonStyle}>Edit</button>
                        </Link>
                        <button onClick={() => handleDelete(post._id)} style={deleteButtonStyle}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div style={paginationStyle}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    style={{
                      ...paginationButtonStyle,
                      opacity: pagination.hasPrevPage ? 1 : 0.5,
                      cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed'
                    }}
                  >
                    ← Previous
                  </button>

                  <div style={pageInfoStyle}>
                    <span style={currentPageStyle}>Page {pagination.page}</span>
                    <span style={totalPagesStyle}>of {pagination.totalPages}</span>
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    style={{
                      ...paginationButtonStyle,
                      opacity: pagination.hasNextPage ? 1 : 0.5,
                      cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const actionsContainerStyle = {
  display: 'flex',
  gap: '0.5rem',
};

const editButtonStyle = {
  backgroundColor: '#e7f1ff',
  color: '#007bff',
  border: '1px solid #007bff',
  padding: '0.4rem 0.8rem',
  borderRadius: '6px',
  fontSize: '0.85rem',
  fontWeight: '600',
  cursor: 'pointer',
};

const deleteButtonStyle = {
  backgroundColor: '#fff1f1',
  color: '#dc3545',
  border: '1px solid #dc3545',
  padding: '0.4rem 0.8rem',
  borderRadius: '6px',
  fontSize: '0.85rem',
  fontWeight: '600',
  cursor: 'pointer',
};

const getCategoryBadgeStyle = (category) => ({
  ...categoryBadgeStyle,
  backgroundColor: getCategoryColor(category),
});

const getCategoryColor = (category) => {
  const colors = {
    'Technology': '#e3f2fd',
    'Lifestyle': '#f3e5f5',
    'Travel': '#e8f5e9',
    'Food': '#fff3e0'
  };
  return colors[category] || '#f5f5f5';
};

const getStatusBadgeStyle = (status) => ({
  ...statusBadgeStyle,
  backgroundColor: status === 'published' ? '#d4edda' : '#fff3cd',
  color: status === 'published' ? '#155724' : '#856404',
});

const containerStyle = { minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '2rem 1rem' };
const contentWrapperStyle = { maxWidth: '1200px', margin: '0 auto' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' };
const welcomeSection = { flex: 1 };
const titleStyle = { fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', margin: '0 0 0.5rem 0' };
const subtitleStyle = { fontSize: '1rem', color: '#6c757d', margin: 0 };
const createButtonStyle = { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.875rem 1.75rem', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease', boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)' };
const buttonIconStyle = { fontSize: '1.25rem', fontWeight: 'bold' };
const statsContainerStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' };
const statCardStyle = { backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' };
const statIconStyle = { fontSize: '2.5rem' };
const statNumberStyle = { fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', lineHeight: 1 };
const statLabelStyle = { fontSize: '0.875rem', color: '#6c757d', marginTop: '0.25rem' };
const sectionTitleStyle = { fontSize: '1.5rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '1.5rem' };
const postsContainerStyle = { backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' };
const postsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' };
const postCardStyle = { backgroundColor: '#fafafa', border: '1px solid #e9ecef', borderRadius: '10px', padding: '1.5rem', transition: 'all 0.3s ease' };
const postHeaderStyle = { display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' };
const categoryBadgeStyle = { padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', color: '#495057' };
const statusBadgeStyle = { padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' };
const postTitleStyle = { fontSize: '1.25rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.75rem', lineHeight: 1.4 };
const contentPreviewStyle = { fontSize: '0.9rem', color: '#6c757d', lineHeight: 1.6, marginBottom: '1rem' };
const postFooterStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e9ecef' };
const dateStyle = { fontSize: '0.85rem', color: '#6c757d' };
const emptyStateStyle = { textAlign: 'center', padding: '4rem 2rem' };
const emptyIconStyle = { fontSize: '4rem', marginBottom: '1rem' };
const emptyTitleStyle = { fontSize: '1.5rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' };
const emptyTextStyle = { fontSize: '1rem', color: '#6c757d', marginBottom: '2rem' };
const emptyButtonStyle = { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.875rem 2rem', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' };
const paginationStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef' };
const paginationButtonStyle = { backgroundColor: 'white', color: '#007bff', border: '2px solid #007bff', padding: '0.625rem 1.5rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600' };
const pageInfoStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' };
const currentPageStyle = { fontSize: '1.125rem', fontWeight: '700', color: '#1a1a1a' };
const totalPagesStyle = { fontSize: '0.875rem', color: '#6c757d' };
const loadingStyle = { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', gap: '1rem', fontSize: '1.125rem', color: '#6c757d' };
const spinnerStyle = { fontSize: '3rem', animation: 'spin 2s linear infinite' };
const errorStyle = { backgroundColor: '#f8d7da', color: '#721c24', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #f5c6cb', display: 'flex', alignItems: 'center', gap: '0.75rem' };
const errorIconStyle = { fontSize: '1.5rem' };

export default Dashboard;