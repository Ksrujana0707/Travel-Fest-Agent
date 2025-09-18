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
    phone: "",
    dob: "",
    gender: "",
    destinations: "",
    interests: [],
  });
  const [emailError, setEmailError] = useState(""); // ✅ New state for email validation message
  const [loading, setLoading] = useState(false);

  // ✅ New function to check email existence on the backend
  const handleEmailCheck = async (email) => {
    if (!email) {
      setEmailError("");
      return;
    }
    try {
      // You need to create this new endpoint on your backend
      const response = await axios.post(`${API_URL}/api/check-email`, { email });
      if (response.data.exists) {
        setEmailError("This email is already registered. Please login or use a different email.");
      } else {
        setEmailError(""); // Clear the error if the email is available
      }
    } catch (error) {
      console.error("Email check failed:", error);
      setEmailError("Error checking email. Please try again.");
    }
  };

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

    // ✅ Call the email check function when the email field changes
    if (name === "email") {
      handleEmailCheck(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ✅ Prevent form submission if an email error exists
    if (emailError) {
      alert("Please correct the form errors before submitting.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/register`, form);
      console.log("Registration successful:", response.data);
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
          {/* ... (other input groups) ... */}
          
          <div className="input-group">
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            {emailError && <p className="error-message">{emailError}</p>} {/* ✅ Display error message */}
          </div>
          
          {/* ... (other input groups) ... */}
          
          <button type="submit" className="register-btn" disabled={loading || emailError}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="login-text">Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default Register;