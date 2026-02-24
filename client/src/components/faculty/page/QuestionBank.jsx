import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/qpbank.css";

const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

const QuestionBank = () => {
  const navigate = useNavigate();

  const handleSemesterClick = (semester) => {
    navigate(`/faculty/question-bank/${semester}`);
  };

  

  return (
    <div className="qb-container">
      <h2 className="qb-title">Question Bank</h2>
      <p className="qb-subtitle">
        Select semester to manage question bank
      </p>

      <div className="qb-grid">
        {semesters.map((sem) => (
          <div
            key={sem}
            className="qb-card active"
            onClick={() => handleSemesterClick(sem)}
          >
            <h3>Semester {sem}</h3>
            <p>Manage questions</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionBank;
