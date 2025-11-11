// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { login } from "../auth";
// import "../styles/Login.css";

// const Login = ({ setIsLoggedIn }) => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const result = login(form.email, form.password);
//     if (result.success) {
//       setIsLoggedIn(true); // Update parent state for navbar
//       navigate("/profile");
//     } else {
//       alert(result.message);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <h2>Welcome Back</h2>
//         <p className="login-subtitle">Login to access your dashboard</p>
//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={form.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="input-group">
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={form.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <button type="submit" className="login-btn">
//             Login
//           </button>
//         </form>
//         <p className="register-text">
//           Don’t have an account? <a href="/register">Register here</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Login = ({ setIsLoggedIn, setUserProfile }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/login`, form);
      const { user, token } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("userProfile", JSON.stringify(user));
      
      setIsLoggedIn(true);
      setUserProfile(user);
      
      navigate("/chatbot");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data.message || "Login failed. Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Login to access your dashboard</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="register-text">
          Don’t have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;