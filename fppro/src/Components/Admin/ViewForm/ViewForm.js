import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Table } from 'react-bootstrap';

function RetrieveForm() {
  const [formTitle, setFormTitle] = useState('');
  const [formDetails, setFormDetails] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFormDetails(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/admin-api/retrieve-form',
        { title: formTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormDetails(response.data.form);
    } catch (error) {
      console.error('Error retrieving form:', error);
      setError('Failed to retrieve form. Please try again.');
    }
  };

  return (
    <Container>
      <h2>View Forms</h2>
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
        <Button type="submit" className="mt-3">Retrieve Form</Button>
      </Form>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {formDetails && (
        <div className="mt-5">
          <h3>Form Details</h3>
          <p><strong>Title:</strong> {formDetails.title}</p>
          <p><strong>Created At:</strong> {new Date(formDetails.createdAt).toLocaleString()}</p>
          {formDetails.updatedAt && <p><strong>Updated At:</strong> {new Date(formDetails.updatedAt).toLocaleString()}</p>}
          <h4>Questions</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Question Number</th>
                <th>Question Text</th>
                <th>Question Type</th>
                {/* <th>Counts</th>
                <th>References</th> */}
              </tr>
            </thead>
            <tbody>
              {formDetails.questions.map((question, index) => (
                <tr key={index}>
                  <td>{question.qid}</td>
                  <td>{question.text}</td>
                  <td>
                    {(() => {
                      switch (question.qtype) {
                        case 1:
                          return '1-5 Options';
                        case 2:
                          return 'Yes/No';
                        case 3:
                          return 'Comment Type';
                        case 4:
                          return 'Excellent to Poor (5 Options)';
                        default:
                          return 'Unknown Type';
                      }
                    })()}
                  </td>
                  {/* <td>{JSON.stringify(question.counts)}</td>
                  <td>{question.references.join(', ')}</td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <div className="mt-4 text-center">
        <Button variant="secondary" onClick={() => navigate('/admin-profile')}>Back to Dashboard</Button>
      </div>
    </Container>
  );
}

export default RetrieveForm;
