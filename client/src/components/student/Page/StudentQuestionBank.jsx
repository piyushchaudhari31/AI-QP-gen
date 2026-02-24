import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/questionbank.css";
import { authcontext } from "../../../context/Authcontext";

const StudentQuestionBank = () => {

  const [semesters, setSemesters] = useState([]);
  const navigate = useNavigate();
  const {url} = useContext(authcontext)

  useEffect(() => {
    getSemesters();
  }, []);

  const getSemesters = async () => {
    try {
      const response = await axios.get(`${url}/api/subject/getAllSemester`);

      setSemesters(response.data.sem);

    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  return (
    <div className="semester-container">

      <div className="header">
        <div>
          <h2>Subject Management</h2>
          <p>Select semester to manage subjects</p>
        </div>

      </div>

      <div className="semester-grid">

        {semesters.map((sem, index) => (
          <div
            key={index}
            className="semester-card"
            onClick={() => navigate(`${sem}`)}
          >
            <h3>Semester {sem}</h3>
            <span>Subjects available</span>
          </div>
        ))}

      </div>

    </div>
  );
};


export default StudentQuestionBank
