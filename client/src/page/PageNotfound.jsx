import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/404 Error Page not Found.json";
import { useNavigate } from "react-router-dom";
import "../style/pagenotfound.css";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <Lottie 
          animationData={animationData}
          loop={true}
          className="notfound-animation"
        />

        <h1>404</h1>
        <p>Oops! Page Not Found</p>

        <button onClick={() => navigate("/")}>
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
