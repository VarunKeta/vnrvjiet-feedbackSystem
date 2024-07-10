import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function Student() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { currentUser } = useSelector((state) => state.userAdminLoginReducer);
  const [formDetails, setFormDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const axiosWithToken = axios.create({
          headers: { Authorization: `Bearer ${token}` }
        });
        const response = await axiosWithToken.get('http://localhost:5000/student-api/get-form');
        const { data } = response;
        setQuestions(data.questions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRadioChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleTextChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      username: currentUser.username, // Assuming you have the username here
      responses,
      comments,
      ...formDetails
    };
    const token = localStorage.getItem('token');

    const axiosWithToken = axios.create({
      headers: { Authorization: `Bearer ${token}` }
    });

    try {
      const response = await axiosWithToken.post('http://localhost:5000/student-api/submit-form', formData);
      if (response.status === 200) {
        console.log('Success:', response.data);
        setIsSubmitted(true);
      } else {
        alert(response.data.message || 'Failed to create the form');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert(error.message);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container w-75 mt-5 mb-5 text-center">
        <h1>Your response is submitted</h1>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="container w-75 mt-5 mb-5 cls1">
      <h1 className="text-center mb-2">Student Feedback Form</h1>
      {questions.map((question) => (
        <div key={question.qid} className="card mb-3 ms-4 me-4">
          <div className="card-body fs-5">
            <div>{question.qid}. {question.text}</div>
            {question.qtype === 1 && (
              <div className='container w-75 mt-3 text-center'>
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
                        className={`btn text-center btn-outline-secondary rounded`}
                        htmlFor={`btnradio${question.qid}-${value}`}
                      >
                        {value}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
            {question.qtype === 2 && (
              <div className='container w-75 mt-3 text-center'>
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
                        className={`btn text-center btn-outline-secondary rounded`}
                        htmlFor={`btnradio${question.qid}-${value}`}
                      >
                        {value}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
            {question.qtype === 3 && (
              <div className='container w-75 mt-3'>
                <textarea
                  className="form-control"
                  rows="3"
                  value={responses[question.qid] || ''}
                  onChange={(e) => handleTextChange(question.qid, e.target.value)}
                ></textarea>
              </div>
            )}
            {question.qtype === 4 && (
              <div className='container w-75 mt-3 text-center'>
                <div className="btn-group radio-group text-center" role="group" aria-label="Basic radio toggle button group" style={{ display: 'flex', gap: '10px' }}>
                  {['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'].map((value, index) => (
                    <React.Fragment key={value}>
                      <input
                        type="radio"
                        className="btn-check"
                        name={`btnradio${question.qid}`}
                        id={`btnradio${question.qid}-${value}`}
                        autoComplete="off"
                        onChange={() => handleRadioChange(question.qid, index + 1)}
                      />
                      <label
                        className={`btn text-center btn-outline-secondary rounded`}
                        htmlFor={`btnradio${question.qid}-${value}`}
                      >
                        {value}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
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
      <button type="submit" className="btn btn-primary fs-5 w-25 p-2 d-block m-auto" >submit</button>

    </form>
  );
}

export default Student;
 