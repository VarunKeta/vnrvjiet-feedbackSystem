import React from "react";
import "./active.css";

function activeForms() {
  return (
    <section className="feed">
      <h2>Active Forms</h2>
      <article className="post">
        <h3>Form Name</h3>
        <p>
          This is a sample post on the feed. Users can share their thoughts
          here.
        </p>
        <div className="post-actions">
          <button>View Report</button>
          <button>Freeze</button>
          <button>Deactivate</button>
        </div>
      </article>
    </section>
  );
}

export default activeForms;
