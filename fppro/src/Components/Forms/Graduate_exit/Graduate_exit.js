import React from 'react';
import { useNavigate } from 'react-router-dom';

function Graduate_exit() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="container w-75 mt-5 mb-5 text-center">
      <h1>Select a Form</h1>
      <div className="btn-group" role="group" aria-label="Basic outlined example">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => handleNavigation('/department')}
        >
          Department
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => handleNavigation('/institution')}
        >
          Institution
        </button>
      </div>
    </div>
  );
}

export default Graduate_exit;
