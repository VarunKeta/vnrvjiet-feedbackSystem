import React, { useState, useEffect } from 'react';
import './Industry.css';

function Industry() {
  const [data, setData] = useState([]);
  const [responses, setResponses] = useState({});
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetch(`http://localhost:4000/industry`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleRadioChange = (questionId, value) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      responses,
      comments
    };

    fetch('http://localhost:4000/submit-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(response => {
      console.log('Success:', response);
      // Handle success (e.g., display a message to the user)
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle error (e.g., display an error message)
    });
  };

  return (
    <form onSubmit={handleSubmit} className='container w-75 mt-5 mb-5 cls1' style={{ 'fontFamily': 'Radio Canada Big'}} >
      <h1 className='text-center mb-5'>Industry Feedback Form</h1>
      {
        data[0] && data[0]["questions"].map((top) => (
          <div key={top.id} className="card mb-3 ms-4 me-4">
            <div className="card-body fs-5" >
              {top.id}. {top.text}
              <div className='container w-75 mt-3 text-center'>
                <div className="btn-group radio-group text-center" role="group" aria-label="Basic radio toggle button group" style={{ display: 'flex', gap: '10px' }}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <React.Fragment key={value}>
                      <input
                        type="radio"
                        className="btn-check"
                        name={`btnradio${top.id}`}
                        id={`btnradio${top.id}-${value}`}
                        autoComplete="off"
                        onChange={() => handleRadioChange(top.id, value)}
                      />
                      <label
                        className='btn btn-light shadow d-block  text-center rounded'
                        htmlFor={`btnradio${top.id}-${value}`}
                    style={{'alignItems':'center'}}
                      >
                        {value}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      }
      <div className="mb-4 fs-4 ms-4 me-4">
        <label htmlFor="content" className="">Comments</label>
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

export default Industry;
