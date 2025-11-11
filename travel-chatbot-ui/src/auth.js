// src/auth.js

// Fake user store (in-memory for now)
let fakeUser = null;

// ✅ Login function
export const login = (email, password) => {
  // Example fake login: accept one test account
  if ((email === "test@test.com" && password === "123456" )||(email === "ksrujana0707@gmail.com" && password === "Sindhu@11240")) {
    fakeUser = { email, name: "Test User" };
    localStorage.setItem("user", JSON.stringify(fakeUser)); // persist
    return { success: true, user: fakeUser };
  }
  return { success: false, message: "Invalid credentials" };
};


// ✅ Register function
export const register = (email, password, name) => {
  // Fake register just stores user
  fakeUser = { email, name };
  localStorage.setItem("user", JSON.stringify(fakeUser));
  return { success: true, user: fakeUser };
};

// ✅ Logout function
export const logout = () => {
  fakeUser = null;
  localStorage.removeItem("user");
  return { success: true };
};

// ✅ Get current user
export const getCurrentUser = () => {
  if (fakeUser) return fakeUser;
  const saved = localStorage.getItem("user");
  if (saved) {
    fakeUser = JSON.parse(saved);
    return fakeUser;
  }
  return null;
};

// ✅ Check if authenticated
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};
