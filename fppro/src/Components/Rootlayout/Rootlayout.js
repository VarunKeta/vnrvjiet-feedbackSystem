import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import './Rootlayout.css'; // Make sure to create this CSS file for additional styling

function Rootlayout() {
  const location = useLocation();
  const isSigninPage = location.pathname === '/signin' || location.pathname === '/';

  return (
    <div className={`rootlayout ${isSigninPage ? 'signin-background' : ''}`} >
      <Header />
      <div style={{ minHeight: "60vh" }}>
      
          <Outlet />
      
      </div>
    </div>
  );
}

export default Rootlayout;
