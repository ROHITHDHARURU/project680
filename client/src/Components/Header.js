import React, { useState, useEffect } from 'react';

const Header = () => {
  const [logoutTimer, setLogoutTimer] = useState(null);
  const token = localStorage.getItem("token");
  const fullName=localStorage.getItem("fullName");

  const handleLogout = () => {
    localStorage.removeItem("fullName"); // Remove token from localStorage
    localStorage.removeItem("token")
    clearTimeout(logoutTimer); // Clear the logout timer
    window.location.replace('/predicate'); // Redirect to login page
  };

  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer); // Clear the previous timer
    const newLogoutTimer = setTimeout(handleLogout, 30 * 60 * 1000); // Set new logout timer for 5 minutes
    setLogoutTimer(newLogoutTimer);
  };

  useEffect(() => {
    // Set up event listeners for user activity
    const resetTimerOnActivity = () => {
      resetLogoutTimer();
    };

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
          <a className="navbar-brand text-light" href="/predicate">Welcome - {fullName}</a>
        ) : (
          <a className="navbar-brand text-light" href="/login"></a>
        )}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse " id="navbarNav">
          <ul className="navbar-nav d-flex align-items-center">
            <li className="nav-item">
              <a className="nav-link text-light" href="/signup">SignUp</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" href="/login">SignIn</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" href="/predicate">TruthTableGenerator</a>
            </li>
            {token && (
              <li className="nav-item">
                <button className="nav-item mr nav-link p-2" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
