import React from "react";

const NotFound = () => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #74ebd5 0%, #9face6 100%)",
      textAlign: "center",
      color: "#333",
      padding: "20px",
    },
    heading: {
      fontSize: "8rem",
      fontWeight: "bold",
      margin: "0",
      color: "#ff4d4d",
    },
    subHeading: {
      fontSize: "2rem",
      marginBottom: "20px",
    },
    link: {
      display: "inline-block",
      marginTop: "15px",
      padding: "12px 24px",
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#fff",
      backgroundColor: "#4CAF50",
      borderRadius: "8px",
      textDecoration: "none",
      transition: "0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <h2 style={styles.subHeading}>Oops! Page Not Found</h2>
      <a href="/" style={styles.link}>
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
