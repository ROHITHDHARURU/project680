import React, { useState, useEffect } from 'react';
import './TruthTableGenerator.css';

const Header = () => {
  const [logoutTimer, setLogoutTimer] = useState(null);
  //token to storage for session creation
  const token = localStorage.getItem("token");
  //cached fullName to display it in the header for the user, when the user is logged in
  const fullName=localStorage.getItem("fullName");

  const handleLogout = () => {
    localStorage.removeItem("fullName"); // Remove fullname from localStorage
    localStorage.removeItem("token") //remove token from localstorage
    clearTimeout(logoutTimer); // Clear the logout timer
    window.location.replace('/predicate'); // Redirect to login page
  };

  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer); // Clear the previous timer
    const newLogoutTimer = setTimeout(handleLogout, 30 * 60 * 1000); // Set new logout timer for 30 minutes
    setLogoutTimer(newLogoutTimer);
  };

  useEffect(() => {
    // Set up event listeners for user activity
    const resetTimerOnActivity = () => {
      resetLogoutTimer();
    };
    //read user activity
    window.addEventListener('mousemove', resetTimerOnActivity);
    window.addEventListener('keypress', resetTimerOnActivity);

    // Initialize the logout timer when the component mounts
    resetLogoutTimer();

    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener('mousemove', resetTimerOnActivity);
      window.removeEventListener('keypress', resetTimerOnActivity);
      clearTimeout(logoutTimer);
    };
  }, []); // Empty dependency array ensures that the effect runs only once

  return (
    <nav className="navbar navbar-expand-lg bg-success">
      <div className="container-fluid">
        {fullName ? (
          <a className="navbar-brand text-light"  name="id_fullName" href="/predicate">Welcome - {fullName}</a>
        ) : (
          <a className="navbar-brand text-light" href="/login"></a>
        )}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse " id="navbarNav">
          <ul className="navbar-nav d-flex align-items-center">
            <li className="nav-item">
              <a className="nav-link text-light" id="signup_button" href="/signup">SignUp</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" id="signin_button" href="/login">SignIn</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" id="truth_table_generator_button" href="/predicate">LogicCoverage</a>
            </li>
            {token && (
              <li className="nav-item">
                <button className="logout" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
