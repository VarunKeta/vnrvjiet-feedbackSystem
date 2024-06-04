import React, { useState } from "react";
import "./alumni.css";
import SurveyForm from "./survey";

function Student() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div>
      <section className="feed">
        <h2>Active Forms</h2>
        <article className="post">
          <h3>Theory Course Assessment by Student</h3>
          <p>
            This is a sample post on the feed. Users can share their thoughts
            here.
          </p>
          <div className="post-actions">
            <button onClick={toggleForm}>Open Form</button>{" "}
          </div>
        </article>
        <article className="post">
          <h3>Laboratory Course Assessment by Student</h3>
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
        <div className="student-form">
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

export default Student;