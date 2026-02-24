import React from "react";

const StatCard = ({ icon, value, label }) => {
  return (
    <div className="stat-card">
      <div className="icon">{icon}</div>
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  );
};

export default StatCard;
