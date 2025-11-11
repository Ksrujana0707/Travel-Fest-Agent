// import React from "react";
// import "../styles/Home.css";

// const Home = () => {
//   return (
//     <div className="home-container">
//       <header className="hero">
//         <h1>Welcome to India Travel Guide</h1>
//         <p>Your AI-powered travel & festival assistant</p>
//       </header>
//       <section className="features">
//         <div className="feature">
//           <h2>Festival Recommendations</h2>
//           <p>Get personalized festival suggestions based on your visit dates.</p>
//         </div>
//         <div className="feature">
//           <h2>Budget Planning</h2>
//           <p>Plan your trip smartly with our budget-friendly suggestions.</p>
//         </div>
//         <div className="feature">
//           <h2>Smart Chatbot</h2>
//           <p>Chat with our AI assistant for instant travel help.</p>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;
import React, { useEffect } from "react";
import "../styles/Home.css";

const Home = () => {
  useEffect(() => {
    const features = document.querySelectorAll(".feature");
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );
    features.forEach(feature => observer.observe(feature));
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-overlay">
          <h1 className="hero-title">Explore India Like Never Before</h1>
          <p className="hero-subtitle">Your AI-powered travel & festival guide</p>
          <button className="hero-btn">Plan Your Trip</button>
        </div>
      </header>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <h2>Festival Recommendations</h2>
          <p>Get personalized festival suggestions based on your travel dates and preferences.</p>
        </div>
        <div className="feature">
          <h2>Budget Planning</h2>
          <p>Smart budgeting tips and itineraries to make your trip cost-effective.</p>
        </div>
        <div className="feature">
          <h2>Smart Chatbot</h2>
          <p>Instant AI assistance to help you with travel queries anytime, anywhere.</p>
        </div>
        <div className="feature">
          <h2>Destination Highlights</h2>
          <p>Discover hidden gems and iconic landmarks across India.</p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Ready to Start Your Journey?</h2>
        <p>Let us help you plan an unforgettable trip to India.</p>
        <button className="cta-btn">Get Started</button>
      </section>
    </div>
  );
};

export default Home;
