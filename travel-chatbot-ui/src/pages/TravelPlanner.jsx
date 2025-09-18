// import React, { useState } from "react";
// import "../styles/TravelPlanner.css";

// const TravelPlanner = () => {
//   const [form, setForm] = useState({ days: "", places: "" });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Plan Created! Stay: ${form.days} days, Places: ${form.places}`);
//   };

//   return (
//     <div className="planner-container">
//       <h1>Plan Your Travel</h1>
//       <form onSubmit={handleSubmit}>
//         <label>Number of Days:</label>
//         <input type="number" name="days" value={form.days} onChange={handleChange} required />
        
//         <label>Places to Visit:</label>
//         <input type="text" name="places" value={form.places} onChange={handleChange} required />
        
//         <button type="submit">Create Plan</button>
//       </form>
//     </div>
//   );
// };

// export default TravelPlanner;
import React, { useState } from "react";
import "../styles/TravelPlanner.css";

const TravelPlanner = () => {
  const [plan, setPlan] = useState({ date: "", days: "", places: "" });

  const handleChange = (e) => {
    setPlan({ ...plan, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Trip planned!\nDate: ${plan.date}\nDays: ${plan.days}\nPlaces: ${plan.places}`
    );
  };

  return (
    <div className="travel-planner">
      <h2>Plan Your Trip</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          value={plan.date}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="days"
          placeholder="Number of Days"
          value={plan.days}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="places"
          placeholder="Places to Visit"
          value={plan.places}
          onChange={handleChange}
          required
        />
        <button type="submit">Save Plan</button>
      </form>
    </div>
  );
};

export default TravelPlanner;
