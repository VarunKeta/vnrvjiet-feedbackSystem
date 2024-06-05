import React, { useState, useEffect } from 'react';
import './Alumini.css';
import { useSelector } from 'react-redux';

function Alumini() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { currentUser } = useSelector((state) => state.userAdminLoginReducer);

  // New state for additional fields
  const [formDetails, setFormDetails] = useState({
    name: '',
    specialization: '',
    yearOfGraduation: '',
    city: '',
    state: '',
    pinCode: '',
    employmentEmail: '',
    company: '',
    designation: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/alumini-api/form', { method: 'GET' })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok ' + res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.payload) {
          setQuestions(data.payload);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleRadioChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleCommentChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleFormDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      username: currentUser.username,
      password: currentUser.password,
      responses,
      comments,
      ...formDetails // Include additional form details in the submission
    };

    fetch('http://localhost:5000/alumini-api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Success:', data);
        setIsSubmitted(true);
      })
      .catch((error) => console.error('Error submitting form:', error));
  };

  if (isSubmitted) {
    return (
      <div className="container w-75 mt-5 mb-5 text-center">
        <h1>Your response is submitted</h1>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='container w-75 mt-5 mb-5 cls1' style={{ fontFamily: 'Radio Canada Big' }}>
      <h1 className='text-center mb-5'>Alumni Feedback Form</h1>
      <div className="card p-4 mb-4">
        <h2>Personal Information</h2>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formDetails.name}
            onChange={handleFormDetailsChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Specialization and Year of Graduation</label>
          <input
            type="text"
            className="form-control"
            name="specialization"
            value={formDetails.specialization}
            onChange={handleFormDetailsChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mailing Address</label>
          <input
            type="text"
            className="form-control"
            name="city"
            placeholder="City"
            value={formDetails.city}
            onChange={handleFormDetailsChange}
          />
          <input
            type="text"
            className="form-control mt-2"
            name="state"
            placeholder="State"
            value={formDetails.state}
            onChange={handleFormDetailsChange}
          />
          <input
            type="text"
            className="form-control mt-2"
            name="pinCode"
            placeholder="Pin code"
            value={formDetails.pinCode}
            onChange={handleFormDetailsChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Employment Details</label>
          <input
            type="email"
            className="form-control"
            name="employmentEmail"
            placeholder="Email"
            value={formDetails.employmentEmail}
            onChange={handleFormDetailsChange}
          />
          <input
            type="text"
            className="form-control mt-2"
            name="company"
            placeholder="Company"
            value={formDetails.company}
            onChange={handleFormDetailsChange}
          />
          <input
            type="text"
            className="form-control mt-2"
            name="designation"
            placeholder="Designation"
            value={formDetails.designation}
            onChange={handleFormDetailsChange}
          />
        </div>
      </div>
      {questions.map((question) => (
        <div key={question.qid} className="card mb-3 ms-4 me-4">
          <div className="card-body fs-5">
            {question.qid}. {question.text}
            <div className='container w-75 mt-3 text-center'>
              {question.qtype === 1 && (
                <div className="btn-group radio-group text-center" role="group" aria-label="Basic radio toggle button group" style={{ display: 'flex', gap: '10px' }}>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <React.Fragment key={value}>
                      <input
                        type="radio"
                        className="btn-check"
                        name={`btnradio${question.qid}`}
                        id={`btnradio${question.qid}-${value}`}
                        autoComplete="off"
                        onChange={() => handleRadioChange(question.qid, value)}
                      />
                      <label
                        className={`btn text-center d-block  ${value <= 1 ? 'radio_label_r' : value <= 3 ? 'radio_label_y' : 'radio_label_g'} rounded`}
                        htmlFor={`btnradio${question.qid}-${value}`}
                      >
                        {value}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              )}
              {question.qtype === 2 && (
                <div className="btn-group radio-group text-center" role="group" aria-label="Basic radio toggle button group" style={{ display: 'flex', gap: '10px' }}>
                  {['Yes', 'No'].map((value) => (
                    <React.Fragment key={value}>
                      <input
                        type="radio"
                        className="btn-check"
                        name={`btnradio${question.qid}`}
                        id={`btnradio${question.qid}-${value}`}
                        autoComplete="off"
                        onChange={() => handleRadioChange(question.qid, value)}
                      />
                      <label
                        className={`btn text-center ${value === 'Yes' ? 'radio_label_g' : 'radio_label_r'} rounded`}
                        htmlFor={`btnradio${question.qid}-${value}`}
                      >
                        {value}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              )}
              {question.qtype === 3 && (
                <textarea
                  className="form-control mt-1"
                  id={`textarea${question.qid}`}
                  rows="2"
                  value={responses[question.qid] || ''}
                  onChange={(e) => handleCommentChange(question.qid, e.target.value)}
                ></textarea>
              )}
              {question.qtype === 4 && (
                <div className="btn-group radio-group text-center" role="group" aria-label="Basic radio toggle button group" style={{ display: 'flex', gap: '10px' }}>
                  {['Excellent', 'Very Good', 'Good', 'Satisfactory', 'Poor'].map((value) => (
                    <React.Fragment key={value}>
                      <input
                        type="radio"
                        className="btn-check"
                        name={`btnradio${question.qid}`}
                        id={`btnradio${question.qid}-${value}`}
                        autoComplete="off"
                        onChange={() => handleRadioChange(question.qid, value)}
                      />
                      <label
                       className={`btn text-center d-block  ${value === 'Excellent' ? 'radio_label_g' : value === 'Very Good' ? 'radio_label_g' : value === 'Good' ? 'radio_label_y' : value === 'Satisfactory' ? 'radio_label_y' : 'radio_label_r'} rounded`}
                        htmlFor={`btnradio${question.qid}-${value}`}
                      >
                        {value}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="mb-4 fs-4 ms-4 me-4">
        <label htmlFor="content" className="">General Comments</label>
        <textarea
          className="form-control mt-1"
          id="content"
          rows="4"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary fs-5 w-25 p-2 d-block m-auto">Submit</button>
    </form>
  );
}

export default Alumini;
