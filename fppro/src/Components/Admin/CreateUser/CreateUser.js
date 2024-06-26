import React, { useState } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';

function CreateUser() {
  const [username, setUsername] = useState('');
  const [userType2, setUserType2] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { username, userType2, email };
    console.log(user)
    let token = localStorage.getItem('token');
    const axiosWithToken = axios.create({
      headers: { Authorization: `Bearer ${token}` }
    });

    try {
      const response = await axiosWithToken.post('http://localhost:5000/admin-api/adduser', user);
      setMessage(response.data.message);
      setUsername('');
      setUserType2('');
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
    <div className="container w-50 mt-5 card shadow p-3">
      <h2>Create User</h2>
      <Form onSubmit={handleSubmit}>
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
          <label htmlFor="userType2" className="form-label">User Type</label>

            <Form.Control
              as="select"
              value={userType2}
              onChange={(e) => setUserType2(e.target.value)}
              required
            >
              <option value="">Select User Type</option>
              <option value="Student form (Theory)">Student form (Theory)</option>
              <option value="Student form (Laboratory)">Student form (Laboratory)</option>
              <option value="Alumni">Alumni</option>
              <option value="Faculty">Faculty</option>
              <option value="Graduate Exit form (Institution)">Graduate Exit form (Institution)</option>
              <option value="Graduate Exit form (Department)">Graduate Exit form (Department)</option>
              <option value="Parent">Parent</option>
              <option value="Professional">Professional body</option>
              <option value="Industry">Industry</option>
            </Form.Control>
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
      </Form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default CreateUser;
