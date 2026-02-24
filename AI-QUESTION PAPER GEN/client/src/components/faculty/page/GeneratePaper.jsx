import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../style/generatePaper.css";
import { authcontext } from "../../../context/Authcontext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const GeneratePaper = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { url } = useContext(authcontext);
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const [examType, setExamType] = useState("Internal Exam");
  const [totalMarks, setTotalMarks] = useState(30);

  const [pattern, setPattern] = useState({
    MCQ: 1,
    SHORT: 3,
    MID_SHORT: 2,
    MID_LONG: 1,
    LONG: 2,
  });

  const [useQuestionBank, setUseQuestionBank] = useState(true);
  const [usePreviousPaper, setUsePreviousPaper] = useState(true);

  // FETCH SUBJECTS
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${url}/api/faculty/facultySubject`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const flatSubjects = res.data.data.flatMap((sem) =>
          sem.subjects.map((s) => ({
            id: s._id,
            name: s.name,
          }))
        );
        setSubjects(flatSubjects);
      })
      .catch(() => toast.error("Subjects fetch failed ❌"));
  }, [url]);

  // GENERATE PAPER
  const generatePaper = async () => {
    if (loading) return;

    if (!selectedSubject) {
      toast("Please select subject ⚠️");
      return;
    }

    if (!totalMarks || totalMarks <= 0) {
      toast.error("Enter valid total marks");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const body = {
        examType,
        totalMarks,
        pattern,
        useQuestionBank,
        usePreviousPaper,
      };

      const res = await axios.post(
        `${url}/api/question/paper/ai/${selectedSubject}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Paper Generated Successfully 🎉");
      setShowPopup(false);
      navigate("/faculty/my-papers");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Error generating paper ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-wrapper">
      {/* HEADER */}
      <div className="top-header">
        <div>
          <h1>Generate Paper</h1>
          <p>Welcome, {user?.fullname || "Faculty"}</p>
        </div>
        <div className="user-avatar">
          {user?.fullname?.charAt(0).toUpperCase() || "F"}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="main-card">
        <div className="icon-circle">🧠</div>
        <h2>AI Question Paper Generator</h2>
        <p>Configure your exam settings and let AI create the perfect paper</p>

        <button
          className="generate-btn"
          onClick={() => setShowPopup(true)}
        >
          Start Generating
        </button>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Generate Question Paper</h2>

            {/* MARKS INFO BOX */}
            

            {/* SUBJECT + EXAM TYPE + MARKS */}
            <div className="form-top">
              <div>
                <label>Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">Choose Subject</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Exam Type</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                >
                  <option>Internal Exam</option>
                  <option>External Exam</option>
                </select>
              </div>

              <div>
                <label>Total Marks</label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                />
              </div>
            </div>

            {/* QUESTION PATTERN */}
            <div className="difficulty-row">
              <div>
                <label>MCQ (1 mark each)</label>
                <input
                  type="number"
                  value={pattern.MCQ}
                  onChange={(e) =>
                    setPattern({ ...pattern, MCQ: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label>Short (2 marks each)</label>
                <input
                  type="number"
                  value={pattern.SHORT}
                  onChange={(e) =>
                    setPattern({ ...pattern, SHORT: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label>Mid-Short (3 marks each)</label>
                <input
                  type="number"
                  value={pattern.MID_SHORT}
                  onChange={(e) =>
                    setPattern({ ...pattern, MID_SHORT: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label>Mid-Long (5 marks each)</label>
                <input
                  type="number"
                  value={pattern.MID_LONG}
                  onChange={(e) =>
                    setPattern({ ...pattern, MID_LONG: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label>Long (6 marks each)</label>
                <input
                  type="number"
                  value={pattern.LONG}
                  onChange={(e) =>
                    setPattern({ ...pattern, LONG: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            {/* CHECKBOX OPTIONS */}
            <div className="options-box">
              <label>
                <input
                  type="checkbox"
                  checked={useQuestionBank}
                  onChange={() =>
                    setUseQuestionBank(!useQuestionBank)
                  }
                />
                Use Question Bank
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={usePreviousPaper}
                  onChange={() =>
                    setUsePreviousPaper(!usePreviousPaper)
                  }
                />
                Use Previous Paper
              </label>
            </div>

            <div className="btn-row">
              <button
                className="cancel-btns"
                onClick={() => setShowPopup(false)}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                className="generate-btn2"
                onClick={generatePaper}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratePaper;
