import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ isLoggedIn, toggleSidebar, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => setIsOpen(!isOpen);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onLogout = () => {
    handleLogout(); // parent handles logout
    setIsOpen(false);
    navigate("/"); // redirect to home
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-logo">
        <Link to="/">Agentic AI</Link>
      </div>

      {/* Desktop & Mobile Menu */}
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>

        {isLoggedIn ? (
          <>
            <Link to="/profile" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link to="/chatbot" onClick={() => setIsOpen(false)}>Chatbot</Link>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
            <button className="menu-btn" onClick={() => { toggleSidebar(); setIsOpen(false); }}>
              Menu
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
          </>
        )}
      </div>

      {/* Hamburger */}
      <div className="nav-toggle" onClick={handleToggle}>☰</div>

      {/* Floating icons */}
      <div className="floating-icons">
        <span className="icon plane">✈️</span>
        <span className="icon festival">🎉</span>
      </div>
    </nav>
  );
}

export default Navbar;
