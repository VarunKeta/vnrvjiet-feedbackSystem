import React, { useState, useEffect } from "react";
import "./admin.css";

function Admin() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [currentView, setCurrentView] = useState("createUser");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleCreateUser = () => {
    // API call to create user
    fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((newUser) => setUsers([...users, newUser]));
  };

  const handleUpdateUser = () => {
    // API call to update user
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUsers(
          users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
      });
  };

  const handleRetrieveUser = (id) => {
    // API call to retrieve user
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUserData(data));
  };

  const handleDeleteUser = (id) => {
    // API call to delete user
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    }).then(() => setUsers(users.filter((user) => user.id !== id)));
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <ul>
          <li onClick={() => setCurrentView("createUser")}>Create User</li>
          <li onClick={() => setCurrentView("updateUser")}>Update User</li>
          <li onClick={() => setCurrentView("retrieveUser")}>Retrieve User</li>
          <li onClick={() => setCurrentView("deleteUser")}>Delete User</li>
        </ul>
      </div>
      <div className="admin-content">
        {currentView === "createUser" && (
          <div>
            <h2>Create User</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={userData.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="usertype"
              placeholder="Usertype"
              value={userData.usertype}
              onChange={handleInputChange}
            />
            <button onClick={handleCreateUser}>Create</button>
          </div>
        )}
        {currentView === "updateUser" && (
          <div>
            <h2>Update User</h2>
            <input
              type="text"
              name="id"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={userData.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleInputChange}
            />
            <button onClick={handleUpdateUser}>Update</button>
          </div>
        )}
        {currentView === "retrieveUser" && (
          <div>
            <h2>Retrieve User</h2>
            <input
              type="text"
              name="id"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={() => handleRetrieveUser(userId)}>Retrieve</button>
            {userData.name && (
              <div>
                <h3>User Data</h3>
                <p>Name: {userData.name}</p>
                <p>Email: {userData.email}</p>
              </div>
            )}
          </div>
        )}
        {currentView === "deleteUser" && (
          <div>
            <h2>Delete User</h2>
            <input
              type="text"
              name="id"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={() => handleDeleteUser(userId)}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
