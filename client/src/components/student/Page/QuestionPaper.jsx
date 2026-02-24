import React, { useContext, useEffect, useState } from "react";
import "../style/questionpaper.css";
import { Download } from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";
import { authcontext } from "../../../context/Authcontext";

const QuestionPaper = () => {
  const [papers, setPapers] = useState([]);
  const [search, setSearch] = useState("");

  const { url } = useContext(authcontext);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await axios.get(
          `${url}/api/question/questionPaper/isupaloaded`
        );

        if (res.data.questionPaper) {
          setPapers(res.data.questionPaper);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPapers();
  }, [url]);

  const filtered = papers.filter((p) =>
    p.subjectName?.toLowerCase().includes(search.toLowerCase())
  );

  const downloadPDF = (paper) => {
    const doc = new jsPDF();

    let y = 10;

    doc.setFontSize(16);
    doc.text(paper.subjectName || "Question Paper", 10, y);
    y += 10;

    doc.setFontSize(11);
    doc.text(`Semester: ${paper.semester}`, 10, y);
    y += 7;
    doc.text(`Total Marks: ${paper.totalMarks}`, 10, y);
    y += 10;

    paper.questions.forEach((q, i) => {
      if (y > 270) {
        doc.addPage();
        y = 10;
      }

      doc.text(
        `${i + 1}. ${q.questionText} (${q.marks} Marks)`,
        10,
        y,
        { maxWidth: 180 }
      );

      y += 10;
    });

    doc.save(`${paper.subjectName || "question-paper"}.pdf`);
  };

  return (
    <div className="qp-container">

      <div className="qp-header">
        <h2>Question Papers</h2>
        <p>All Generated Question Papers</p>
      </div>

      <input
        className="qp-search"
        placeholder="Search subject..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="qp-content">

        {/* DESKTOP TABLE */}
        <div className="qp-table-box">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Semester</th>
                <th>Marks</th>
                <th>Questions</th>
                <th>Download</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p, i) => (
                <tr key={i}>
                  <td>{p.subjectName}</td>
                  <td>{p.semester}</td>
                  <td>{p.totalMarks}</td>
                  <td>{p.questions.length}</td>
                  <td>
                    <button
                      className="download-btn"
                      onClick={() => downloadPDF(p)}
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filtered.length && (
            <div className="empty">No papers found</div>
          )}
        </div>

        {/* MOBILE CARDS */}
        <div className="qp-cards">
          {filtered.map((p, i) => (
            <div className="qp-card" key={i}>
              <h3>{p.subjectName}</h3>

              <div className="qp-meta">Semester: {p.semester}</div>
              <div className="qp-meta">Marks: {p.totalMarks}</div>
              <div className="qp-meta">
                Questions: {p.questions.length}
              </div>

              <button
                className="download-btn qp-download"
                onClick={() => downloadPDF(p)}
              >
                <Download size={16} />
                Download
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default QuestionPaper;