import React, { useState, useEffect } from "react";
import "./home.css";
import Admin from "./admin";
import Active from "./active";
import Stakeholder1Form from "./alumni";
import Stakeholder2Form from "./faculty";
import Stakeholder3Form from "./graduate";
import Stakeholder4Form from "./survey";
import Stakeholder5Form from "./survey";
import Stakeholder6Form from "./survey";
import Stakeholder7Form from "./student";

function Home() {
  const [prod, setProd] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentContent, setCurrentContent] = useState("Home");
  const [logoutConfirmation, setLogoutConfirmation] = useState(false); // State for logout confirmation

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((product) => setProd(product));
  }, []);

  const filteredProducts = prod.filter((product) =>
    product.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClick = (content) => {
    setCurrentContent(content);
  };

  // Function to handle logout
  const handleLogout = () => {
    setLogoutConfirmation(true);
  };

  // Function to confirm logout
  const confirmLogout = () => {
    // Perform logout logic here
    console.log("Logging out...");
    setLogoutConfirmation(false);
  };

  // Function to cancel logout
  const cancelLogout = () => {
    setLogoutConfirmation(false);
  };

  return (
    <div className={`App ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <header className="header">
        <div className="logo">VNRJIET</div>
        <button className="toggle-sidebar" onClick={toggleSidebar}>
          {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        </button>
      </header>

      <div className="content">
        <aside className="sidebar">
          <ul>
            <li onClick={() => handleSidebarClick("Home")}>
              <a href="#">Home</a>
            </li>
            <li onClick={() => handleSidebarClick("Admin Details")}>
              <a href="#">Admin Details</a>
            </li>
            <li className={`dropdown-item ${dropdownOpen ? "open" : ""}`}>
              <a href="#" onClick={toggleDropdown}>
                Stakeholders{" "}
                <span className="arrow">{dropdownOpen ? "▲" : "▼"}</span>
              </a>
              {dropdownOpen && (
                <ul className="dropdown">
                  <li onClick={() => handleSidebarClick("Stakeholder 1")}>
                    <a href="#">Alumni</a>
                  </li>
                  <li onClick={() => handleSidebarClick("Stakeholder 2")}>
                    <a href="#">Faculty</a>
                  </li>
                  <li onClick={() => handleSidebarClick("Stakeholder 3")}>
                    <a href="#">Graduates</a>
                  </li>
                  <li onClick={() => handleSidebarClick("Stakeholder 4")}>
                    <a href="#">Industry Personnel</a>
                  </li>
                  <li onClick={() => handleSidebarClick("Stakeholder 5")}>
                    <a href="#">Parents</a>
                  </li>
                  <li onClick={() => handleSidebarClick("Stakeholder 6")}>
                    <a href="#">Professional Bodies</a>
                  </li>
                  <li onClick={() => handleSidebarClick("Stakeholder 7")}>
                    <a href="#">Students</a>
                  </li>
                </ul>
              )}
            </li>
            <li onClick={() => handleSidebarClick("Settings")}>
              <a href="#">Settings</a>
            </li>
            <li onClick={handleLogout}>
              <a href="#">Logout</a>
            </li>
          </ul>
        </aside>

        <main>
          <div className="maincontainer">
            {currentContent === "Home" && (
              <div>
                <Active />
              </div>
            )}
            {currentContent === "Admin Details" && (
              <div>
                <Admin />
              </div>
            )}
            {currentContent === "Stakeholder 1" && (
              <div>
                <Stakeholder1Form />
              </div>
            )}
            {currentContent === "Stakeholder 2" && (
              <div>
                <Stakeholder2Form />
              </div>
            )}
            {currentContent === "Stakeholder 3" && (
              <div>
                <Stakeholder3Form />
              </div>
            )}
            {currentContent === "Stakeholder 4" && (
              <div>
                <Stakeholder4Form />
              </div>
            )}
            {currentContent === "Stakeholder 5" && (
              <div>
                <Stakeholder5Form />
              </div>
            )}
            {currentContent === "Stakeholder 6" && (
              <div>
                <Stakeholder6Form />
              </div>
            )}
            {currentContent === "Stakeholder 7" && (
              <div>
                <Stakeholder7Form />
              </div>
            )}
          </div>
        </main>
      </div>

      {logoutConfirmation && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>Are you sure you want to logout?</p>
            <div className="logout-buttons">
              <button onClick={confirmLogout}>Logout</button>
              <button onClick={cancelLogout}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
