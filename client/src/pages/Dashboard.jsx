const Dashboard = () => {
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Dashboard</h1>
        <p>Welcome back! <span style={errorStyle}>User.exe</span></p>
      </div>

      <div style={contentStyle}>
        <div style={placeholderStyle}>
          <h2>Dashboard</h2>
          <p>Our Website Provides you with the best services of <span style={errorStyle} >("404 Word Not found")</span>
          </p>
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



export default Dashboard;