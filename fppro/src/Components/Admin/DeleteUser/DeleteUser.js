import React, { useState } from 'react';
import axios from 'axios';

function DeleteUser() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userToDelete = { username };
    const token = localStorage.getItem('token');

    // Create axios instance with token
    const axiosWithToken = axios.create({
      headers: { Authorization: `Bearer ${token}` }
    });

    try {
      const response = await axiosWithToken.delete('http://localhost:5000/admin-api/deleteuser', { data: userToDelete });
      setMessage(response.data.message);
      setUsername('');
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 401) {
        setMessage('Unauthorized access. Please login to continue');
      } else {
        setMessage('Error deleting user');
      }
    }
  };

  return (
    <div className="container w-50 mt-5 card shadow p-3">
      <h2>Delete User</h2>
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
        <button type="submit" className="btn btn-danger">Delete User</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default DeleteUser;
