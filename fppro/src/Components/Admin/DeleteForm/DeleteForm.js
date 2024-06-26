import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

function DeleteForm() {
  const [formTitle, setFormTitle] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setFormTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await axios.delete('http://localhost:5000/admin-api/delete-form', {
        data: { title: formTitle }
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error deleting form:', error);
      setError('Failed to delete form. Please try again.');
    }
  };

  return (
    <div>
      <h2>Delete Form</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label className='fw-bold mt-2'>Form Title</Form.Label>
          <Form.Control
            as="select"
            value={formTitle}
            onChange={handleChange}
            required
          >
            <option value="">Select Form Type</option>
            <option value="Student form (Theory)">Student form (Theory)</option>
            <option value="Student form (Laboratory)">Student form (Laboratory)</option>
            <option value="Alumni form">Alumni Form</option>
            <option value="Faculty form">Faculty Form</option>
            <option value="Graduate Exit form (Institution)">Graduate Exit form (Institution)</option>
            <option value="Graduate Exit form (Department)">Graduate Exit form (Department)</option>
            <option value="Parent form">Parent Form</option>
            <option value="Professional form">Professional Body Form</option>
            <option value="Industry form">Industry Form</option>
          </Form.Control>
        </Form.Group>
        <Button type="submit" className="mt-3">Delete Form</Button>
      </Form>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
 
    </div>
  );
}

export default DeleteForm;
