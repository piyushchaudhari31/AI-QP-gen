import React, { useEffect, useState, useContext } from "react";
import "../style/dashboard.css";
import { Sparkles, Plus } from "lucide-react";
import axios from "axios";
import { authcontext } from "../../../context/Authcontext";
import {useNavigate} from 'react-router-dom'

const DashboardFaculty = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const { url } = useContext(authcontext);
  const navigate = useNavigate()

  const [counts, setCounts] = useState({
    totalQuestions: 0,
    totalSubjects: 0,
  });

  /* ===== FETCH COUNT DATA ===== */
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get(
          `${url}/api/faculty/getAllCount`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCounts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCount();
  }, []);

  return (
    <main className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {user?.fullname}</p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="cards">
        <div className="card">
          {counts.totalQuestions}
          <span>Questions Created</span>
        </div>

        <div className="card">
          {counts.totalQuestionPapers}
          <span>Papers Generated</span>
        </div>

        

        <div className="card">
          {counts.totalSubjects}
          <span>Subjects</span>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="bottom-section">
        <div className="generate-card" onClick={()=>navigate('/faculty/generate-paper')}>
          <div>
            <h2>Generate Paper</h2>
            <p>AI-powered papers</p>
          </div>
          <Sparkles size={32} />
        </div>

        <div className="add-question-card" onClick={()=>navigate('/faculty/question-bank')}>
          <div>
            <h2>Add Question</h2>
            <p>Build question bank</p>
          </div>
          <Plus size={28} />
        </div>
      </div>
    </main>
  );
};

export default DashboardFaculty;
