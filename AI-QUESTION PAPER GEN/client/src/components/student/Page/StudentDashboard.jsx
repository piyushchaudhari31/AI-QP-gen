import React, { useEffect, useState, useContext } from "react";
import "../style/dashboard.css";
import {
  FaCheckCircle,
  FaTrophy,
  FaBrain
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authcontext } from "../../../context/Authcontext";

const StudentDashboard = () => {

  const navigate = useNavigate();
  const { url } = useContext(authcontext);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats,setStats] = useState({
    totalAttempted:0,
    highestScore:0,
    totalMarks:0
  });

  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    axios.get(`${url}/api/student/studentcount`,{
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(res=>{
      setStats({
        totalAttempted:res.data.totalAttempted || 0,
        highestScore:res.data.highestScore || 0,
        totalMarks:res.data.totalMarks || 0
      });
      setLoading(false);
    })
    .catch(err=>{
      console.log(err);
      setLoading(false);
    });

  },[]);

  return (
    <div className="dashboard">

      <h1>Dashboard</h1>
      <p className="welcome-text">Welcome, {user?.fullname}</p>

      <div className="stats-grid">

        {/* Total Attempted */}
        <div className="stat-card">
          <div className="icon blue"><FaCheckCircle /></div>
          <h2>
            {loading ? "..." : stats.totalAttempted}
          </h2>
          <p>Tests Attempted</p>
        </div>

        {/* Highest Score */}
        <div className="stat-card">
          <div className="icon green"><FaTrophy /></div>
          <h2>
            {loading 
              ? "..." 
              : `${stats.highestScore} / ${stats.totalMarks}`
            }
          </h2>
          <p>Highest Score</p>
        </div>

      </div>

      {/* AI Test Card */}
      <div 
        className="ai-test" 
        onClick={()=>{navigate('/student/performance')}}
      >
        <div>
          <h2>Take AI Test</h2>
          <p>AI-generated tests</p>
        </div>
        <FaBrain className="ai-icon"/>
      </div>

      

    </div>
  );
};

export default StudentDashboard;
