import React, { useState } from "react";
import "./alumni.css"; // Import your CSS file for styling
import SurveyForm from "./survey";

function Faculty() {
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage form visibility

  // Function to toggle form visibility
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div>
      <section className="feed">
        <h2>Active Forms</h2>
        <article className="post">
          <h3>Faculty Survey</h3>
          <p>
            This is a sample post on the feed. Users can share their thoughts
            here.
          </p>
          <div className="post-actions">
            <button onClick={toggleForm}>Open Form</button>{" "}
          </div>
        </article>
      </section>

      {isFormOpen && (
        <div className="faculty-form">
          <SurveyForm />{" "}
        </div>
      )}

      <div className="create-form">
        <button className="new-form-button">+</button>
        <p>Create a new form</p>
      </div>
    </div>
  );
}

export default Faculty;
