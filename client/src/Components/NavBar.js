import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
export default function NavBar() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };
  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };
  const handleFindCardiologists = async () => {
    try {
      // Use Geolocation API to get user's location
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        // Construct the Google Maps URL with the obtained location
        const mapsUrl = `https://www.google.co.in/maps/search/hospitals+near+me/@${latitude},${longitude},13z/data=!3m1!4b1?entry=ttu`;

        // Redirect the user to the generated Google Maps URL
        window.open(mapsUrl, '_blank');
      });
    } catch (error) {
      console.error('Error finding cardiologists:', error);
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light-purple fixed-top" style={{ backgroundColor: '#D50000' }}>
      <div className="container">
        <Link className="navbar-brand text-white" to="/">
        📊 🔑 ClinStandardize And Interoperabiliy 🌍
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={!isNavCollapsed ? true : false}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {/* Dropdown Menu for Upload Options */}
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle text-white"
              type="button"
              id="navbarDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Upload Your Institute Clinical Data
            </button>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <Link className="dropdown-item" to="/assessment">
                   Upload CSV of clincial files
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/assessment2">
                  Check by input
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item" to="/results">
                  Previous Results
                </Link>
              </li>
            </ul>
          </li>

          {/* Analyse Report Link */}
          <li className="nav-item">
            <Link className="nav-link text-white" to="/analyse-report">
              Analyse The Report
              <img
                src="AI.png"
                alt="AI Icon"
                style={{ width: '16px', height: '16px', marginLeft: '4px' }}
              />
            </Link>
          </li>

          {/* Querybot Link */}
          <li className="nav-item">
            <Link className="nav-link text-white" to="/chat">
              Querybot
              <img
                src="AI.png"
                alt="Querybot Icon"
                style={{ width: '16px', height: '16px', marginLeft: '4px' }}
              />
            </Link>
          </li>

          {/* Find Nearby Hospitals Button */}
          <li className="nav-item">
            <button
              type="button"
              className="btn btn-link nav-link text-white"
              onClick={handleFindCardiologists}
            >
              Find Nearby Hospitals
            </button>
          </li>
        </ul>

        {/* Profile Dropdown Menu */}
        <div className="dropdown text-end">
          <button
            className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
            type="button"
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://th.bing.com/th/id/OIP.58z9A9My8wXP8T2pM18stgAAAA?w=238&h=250&rs=1&pid=ImgDetMain"
              alt="Profile"
              width="32"
              height="32"
              className="rounded-circle"
            />
          </button>
          <ul className="dropdown-menu text-small" aria-labelledby="profileDropdown">
            <li>
              <Link className="dropdown-item" to="/profile">
                View Profile
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/newpassword">
                Change Password
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>

      </div>
    </nav>

  )
}
