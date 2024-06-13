import React, { useState } from 'react';
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import './AdminProfile.css';
import { IoMdArrowDropdown } from "react-icons/io";
function AdminProfile() {
  const { loginUserStatus, errorOccurred, errMsg, currentUser } = useSelector(
    (state) => state.userAdminLoginReducer
  );

  const [userSettingsOpen, setUserSettingsOpen] = useState(false);
  const [formSettingsOpen, setFormSettingsOpen] = useState(false);

  const toggleUserSettings = () => {
    setUserSettingsOpen(!userSettingsOpen);
  };

  const toggleFormSettings = () => {
    setFormSettingsOpen(!formSettingsOpen);
  };

  return (
    <div className="admin-profile-container">
      <nav className="side-navbar">
        <ul>
          <li>
            <div className='dropdown'>
              <NavLink to="dashboard" className='dropdown-btn' style={{'color':'black'}}>Dashboard</NavLink>
            </div>
          </li>
          <li>
            <div className="dropdown">
              <button className="dropdown-btn" onClick={toggleUserSettings}>
                User Settings 
                <IoMdArrowDropdown className='fs-2 ms-1'/>
              </button>
              {userSettingsOpen && (
                <div className="dropdown-content">
                  <NavLink to="create-user" activeClassName="active-link">Create User</NavLink>
                  <NavLink to="update-user" activeClassName="active-link">Update User</NavLink>
                  <NavLink to="retrieve-user" activeClassName="active-link">Retrieve User</NavLink>
                  <NavLink to="delete-user" activeClassName="active-link">Delete User</NavLink>
                </div>
              )}
            </div>
          </li>
          <li>
            <div className="dropdown">
              <button className="dropdown-btn" onClick={toggleFormSettings}>
                Form Settings
                <IoMdArrowDropdown className='fs-2'  />
              </button>
              {formSettingsOpen && (
                <div className="dropdown-content">
                  <NavLink to="create-form" activeClassName="active-link">Create Form</NavLink>
                  <NavLink to="edit-form" activeClassName="active-link">Edit Form</NavLink>
                </div>
              )}
            </div>
          </li>
          <li>
            <div className="dropdown">
              <NavLink to="settings" className='dropdown-btn' style={{'color':'black'}}>Settings</NavLink>
            </div>
          </li>
        </ul>
      </nav>
      <div className="content">
        <div className='container'>
        <Outlet />
      </div>
    </div>
    </div>
  );
}

export default AdminProfile;
