import React, { useContext, useEffect, useState } from "react";
import "../style/qppaper.css";
import { authcontext } from "../../../context/Authcontext";

const QuestionPaper = () => {
  const [papers, setPapers] = useState([]);
  const {url} = useContext(authcontext)
  

  useEffect(() => {
    fetch(`${url}/api/question/allQuestionPaper`)
      .then(res => res.json())
      .then(data => setPapers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <main className="dashboard">
      <h1>Question Papers</h1>
      <p className="welcome">All Generated Question Papers</p>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Faculty</th>
              <th>Date & Time</th>
              <th>Marks</th>
              <th>Questions</th>
            </tr>
          </thead>

          <tbody>
            {papers.length > 0 ? (
              papers.map((paper, index) => (
                <tr key={index}>
                  <td>{paper.subjectName}</td>
                  <td>{paper.facultyName}</td>
                  <td>
                    {new Date(paper.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    })}
                  </td>
                  <td>{paper.totalMarks}</td>
                  <td>{paper.questionsCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No question papers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default QuestionPaper;
