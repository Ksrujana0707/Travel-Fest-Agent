import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Festivals from "./pages/Festivals";
import TravelPlanner from "./pages/TravelPlanner";
import Chatbot from "./pages/Chatbot";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import "./styles/Global.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("userProfile");
    if (token && user) {
      try {
        setIsLoggedIn(true);
        setUserProfile(JSON.parse(user));
      } catch (e) {
        console.error("Failed to parse user profile from localStorage", e);
        localStorage.clear();
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserProfile(null);
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        toggleSidebar={() => {}}
        handleLogout={handleLogout}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/festivals" element={<Festivals />} />
        <Route path="/travelplanner" element={<TravelPlanner />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/profile" /> : <Login setIsLoggedIn={setIsLoggedIn} setUserProfile={setUserProfile} />
          }
        />
        <Route
          path="/register"
          element={
            isLoggedIn ? <Navigate to="/profile" /> : <Register setIsLoggedIn={setIsLoggedIn} />
          }
        />

        {/* Private routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Profile userProfile={userProfile} />
            </PrivateRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Chatbot userProfile={userProfile} />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;