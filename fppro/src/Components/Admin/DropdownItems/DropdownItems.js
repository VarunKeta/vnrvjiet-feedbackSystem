import React, { useState } from 'react';
import './DropdownItems.css'
const DropdownItem = ({ label, bgColor, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sidebar-item" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
      <span className="sidebar-label" style={{ backgroundColor: bgColor }}>
        {label}
      </span>
      <div className={`sidebar-sub-items ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default DropdownItem;
