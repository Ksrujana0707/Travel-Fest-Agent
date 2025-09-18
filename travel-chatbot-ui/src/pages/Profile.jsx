import React from "react";

const Profile = ({ userProfile }) => {
  if (!userProfile) return <p>No profile data found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome, {userProfile.name}!</h2>
      <p><strong>Email:</strong> {userProfile.email}</p>
      <p><strong>Phone:</strong> {userProfile.phone || "N/A"}</p>
      <p><strong>Date of Birth:</strong> {userProfile.dob || "N/A"}</p>
      <p><strong>Gender:</strong> {userProfile.gender || "N/A"}</p>
      <p><strong>Favorite Destinations:</strong> {userProfile.destinations.join(", ") || "N/A"}</p>
      <p><strong>Travel Interests:</strong> {userProfile.interests.join(", ") || "N/A"}</p>
    </div>
  );
};

export default Profile;
