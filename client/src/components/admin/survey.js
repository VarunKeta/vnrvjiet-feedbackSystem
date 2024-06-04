import React, { useState } from "react";
import "./survey.css"; // CSS file for styling

function SurveyForm() {
  // State variables to manage form data and edit mode
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    graduationYear: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    companyAndDesignation: "",
    answers: Array(9).fill({
      choice: "", // Changed from excellent, veryGood, etc. to a single choice field
    }),
  });
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle answer changes
  const handleAnswerChange = (index, choice) => {
    const updatedAnswers = [...formData.answers];
    updatedAnswers[index].choice = choice;
    setFormData({ ...formData, answers: updatedAnswers });
  };

  // Function to toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // JSX for the survey form
  return (
    <div className="survey-form">
      <h1>ALUMNI: SURVEY FORM</h1>
      <form>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <label>Specialization and Year of Graduation:</label>
        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <label>Mailing Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <div className="address-details">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="City"
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="State"
          />
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Pin code"
          />
        </div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <label>Employment details:</label>
        <input
          type="text"
          name="companyAndDesignation"
          value={formData.companyAndDesignation}
          onChange={handleChange}
          disabled={!isEditing}
        />
        <div className="survey-questions">
          {formData.answers.map((answer, index) => (
            <div key={index} className="question">
              <label>{`Question ${index + 1}:`}</label>
              <input
                type="text"
                value={`How do you rate ${answer.question}?`}
                readOnly
              />
              <div className="answer-options">
                <label>
                  <input
                    type="radio"
                    value="Excellent"
                    checked={answer.choice === "Excellent"}
                    onChange={() => handleAnswerChange(index, "Excellent")}
                    disabled={!isEditing}
                  />
                  Excellent
                </label>
                <label>
                  <input
                    type="radio"
                    value="Very Good"
                    checked={answer.choice === "Very Good"}
                    onChange={() => handleAnswerChange(index, "Very Good")}
                    disabled={!isEditing}
                  />
                  Very Good
                </label>
                <label>
                  <input
                    type="radio"
                    value="Good"
                    checked={answer.choice === "Good"}
                    onChange={() => handleAnswerChange(index, "Good")}
                    disabled={!isEditing}
                  />
                  Good
                </label>
                <label>
                  <input
                    type="radio"
                    value="Satisfactory"
                    checked={answer.choice === "Satisfactory"}
                    onChange={() => handleAnswerChange(index, "Satisfactory")}
                    disabled={!isEditing}
                  />
                  Satisfactory
                </label>
                <label>
                  <input
                    type="radio"
                    value="Poor"
                    checked={answer.choice === "Poor"}
                    onChange={() => handleAnswerChange(index, "Poor")}
                    disabled={!isEditing}
                  />
                  Poor
                </label>
              </div>
            </div>
          ))}
        </div>
      </form>
      <button onClick={toggleEdit}>{isEditing ? "Save" : "Edit"}</button>
    </div>
  );
}

export default SurveyForm;
