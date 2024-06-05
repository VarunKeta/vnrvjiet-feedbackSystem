import React, { useState } from 'react';
import { axiosWithToken } from '../../../Axioswithtoken';
import axios from "axios";
function CreateUser() {
  const [username, setUsername] = useState('');
  const [usertype2, setUsertype2] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { username, usertype2, email };
    let token=localStorage.getItem('token')
    //create axios with token
    const axiosWithToken=axios.create({
      headers:{Authorization:`Bearer ${token}`}
    })
    try {
      const response = await axiosWithToken.post('http://localhost:5000/admin-api/adduser', user);
      setMessage(response.data.message);
      setUsername('');
      setUsertype2('');
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 401) {
        setMessage('Unauthorized access. Please login to continue');
      } else {
        setMessage('Error creating user');
      }
    }
  };

  return (
    <div className="container w-50 mt-5">
      <h2>Create User</h2>
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
        <div className="mb-3">
          <label htmlFor="usertype2" className="form-label">User Type</label>
          <input
            type="text"
            className="form-control"
            id="usertype2"
            value={usertype2}
            onChange={(e) => setUsertype2(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create User</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default CreateUser;
