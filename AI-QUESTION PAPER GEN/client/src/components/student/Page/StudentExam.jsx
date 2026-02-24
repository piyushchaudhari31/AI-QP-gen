import React, { useContext, useEffect, useState } from "react";
import "../style/studentExam.css";
import axios from "axios";
import { authcontext } from "../../../context/Authcontext";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const StudentExam = () => {

  const [openModal, setOpenModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { url } = useContext(authcontext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  let user = JSON.parse(localStorage.getItem("user"));

  // FETCH SUBJECTS
  useEffect(() => {
    axios.get(`${url}/api/subject/getAllBook`)
      .then((res) => {
        const allSubjects = res.data.subject.flatMap(
          (semester) => semester.subjects
        );
        setSubjects(allSubjects);
      })
      .catch((err) => console.log(err));
  }, []);

  // 🔥 PROGRESS BAR LOGIC
  useEffect(() => {

    if (!loading) return;

    let value = 0;

    const interval = setInterval(() => {

      value += Math.floor(Math.random() * 10) + 5;

      if (value >= 95) {
        value = 95;
        clearInterval(interval);
      }

      setProgress(value);

    }, 500);

    return () => clearInterval(interval);

  }, [loading]);

  // SUBMIT
  const handleStartTest = async (data) => {

    try {

      setLoading(true);
      setProgress(1);

      const res = await axios.post(
        `${url}/api/student/generate-mcq`,
        {
          subjectName: data.subjectName,
          count: data.count,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      setProgress(100);

      setTimeout(() => {
        reset();
        setOpenModal(false);
        navigate(`/student/exam/${res.data.testId}`);
      }, 600);

    } catch (err) {
      console.log(err);
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="student-exam-wrapper">

      <div className="student-exam-header">
        <div>
          <h1>Start Your Exam</h1>
          <p>Welcome, {user?.fullname}</p>
        </div>
      </div>

      <div className="exam-start-card">

        <div className="exam-icon">📝</div>

        <h2>AI Online Examination Portal</h2>
        <p>Configure your exam instructions and click below</p>

        <button 
          className="start-exam-btn" 
          onClick={() => setOpenModal(true)}
        >
          Start Exam
        </button>

      </div>

      {/* MODAL */}

      {openModal && (
        <div className="student-exam-modal-overlay">
          <div className="student-exam-modal">

            <h2>Exam Details</h2>

            <form onSubmit={handleSubmit(handleStartTest)}>

              <div className="modal-grid">

                <div className="modal-field">
                  <label>Subject</label>

                  <select {...register("subjectName", { required: true })}>
                    <option value="">Select Subject</option>
                    {subjects.map((item) => (
                      <option key={item._id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  {errors.subjectName && (
                    <small className="error">Subject required</small>
                  )}
                </div>

                <div className="modal-field">
                  <label>Total Questions</label>
                  <input
                    type="number"
                    defaultValue={10}
                    {...register("count", { required: true })}
                  />
                </div>

              </div>

              {/* 🔥 PROGRESS UI */}

              {loading && (
                <div className="progress-wrapper">

                  <p>Generating AI Paper... {progress}%</p>

                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                </div>
              )}

              <div className="modal-btns">

                <button
                  type="button"
                  className="cancel-btns"
                  onClick={() => setOpenModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button 
                  className="start-btn" 
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Start Test"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default StudentExam;
