import React, { useState } from 'react';
import axios from 'axios';

function RetrieveUser() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userCred = { username };
    const token = localStorage.getItem('token');

    // Create axios instance with token
    const axiosWithToken = axios.create({
      headers: { Authorization: `Bearer ${token}` }
    });

    try {
      const response = await axiosWithToken.post('http://localhost:5000/admin-api/retrieveuser', userCred);
      setMessage(response.data.message);
      setUser(response.data.user || null);
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 401) {
        setMessage('Unauthorized access. Please login to continue');
      } else {
        setMessage('Error retrieving user');
      }
    }
  };

  return (
    <div className="container w-50 mt-5 card shadow p-3">
      <h2>Retrieve User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Retrieve User</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
      {user && (
        <div className="mt-3">
          <h3>User Details</h3>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>User Type:</strong> {user.userType2}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  );
}

export default RetrieveUser;
