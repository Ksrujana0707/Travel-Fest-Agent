import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", 
    phone: "",
    dob: "",
    gender: "",
    destinations: "",
    interests: [],
  });
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      const newArray = checked
        ? [...form.interests, value]
        : form.interests.filter((i) => i !== value);
      setForm({ ...form, interests: newArray });
    } else {
      setForm({ ...form, [name]: value });
    }

    if (name === "confirmPassword" || name === "password") {
      const { password, confirmPassword } = { ...form, [name]: value };
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match.");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    
    if (passwordError) {
      alert("Please correct the form errors before submitting.");
      return;
    }
    
    setLoading(true);
    
    try {
      const { confirmPassword, ...formWithoutConfirmPassword } = form;
      
      await axios.post(`${API_URL}/api/register`, formWithoutConfirmPassword);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert(error.response?.data.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create Account</h2>
        <p className="register-subtitle">Sign up to access your personalized dashboard</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          <div className="input-group">
            <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Date of Birth:</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Gender:</label>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="input-group">
            <label>Favorite Destinations (e.g., Goa, Kerala):</label>
            <input
              type="text"
              name="destinations"
              placeholder="Enter destinations, separated by commas"
              value={form.destinations}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Travel Interests:</label>
            <div className="checkbox-group">
              <label><input type="checkbox" name="interests" value="Festivals" onChange={handleChange} /> Festivals</label>
              <label><input type="checkbox" name="interests" value="Beaches" onChange={handleChange} /> Beaches</label>
              <label><input type="checkbox" name="interests" value="Mountains" onChange={handleChange} /> Mountains</label>
              <label><input type="checkbox" name="interests" value="Culture" onChange={handleChange} /> Culture</label>
            </div>
          </div>
          <button type="submit" className="register-btn" disabled={loading || passwordError}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="login-text">Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default Register;