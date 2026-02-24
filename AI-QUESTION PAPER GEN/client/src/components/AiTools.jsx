import React from 'react';
import '../style/aitools.css';
import { useNavigate } from 'react-router-dom';

const AiTools = () => {

  const navigate = useNavigate()
  let token = localStorage.getItem("token");

  return (
    <div className="hero-wrapper">
      <div className="hero-content">
        <h1>
          AI-Based Question Paper <br />
          <span>Generator System</span>
        </h1>

        <p>
          Transform exam creation with intelligent AI that generates custom
          question papers, manages question banks, and provides detailed
          analytics for educators and students.
        </p>

        {!token && (
          <div className="hero-buttons">
            <button className="btnFronted primary" onClick={()=>navigate('/login')}>Get Started</button>
            <button className="btnFronted secondary">Learn More</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTools;
