import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/subjectmang.css";
import axios from "axios";
import { authcontext } from "../../../context/Authcontext";
import toast from 'react-hot-toast'

const SubjectManagment = () => {
  const navigate = useNavigate();
  const { url } = useContext(authcontext);

  const [semesterData, setSemesterData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* MODAL STATE */
  const [showModal, setShowModal] = useState(false);
  const [semesterInput, setSemesterInput] = useState("");

  /* FETCH SEMESTERS */
  const getAllSubject = async () => {
    try {
      const response = await axios.get(
        `${url}/api/subject/getAllBook`
      );

      setSemesterData(response?.data?.subject || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSubject();
  }, []);

  /* OPEN SEMESTER */
  const handleClick = (item) => {
    navigate(`/Admin/subjects/${item._id}`);
  };

  /* ADD SEMESTER API */
  const addSemester = async () => {
    if (!semesterInput) return alert("Enter semester");

    try {
      await axios.post(`${url}/api/admin/addSem`, {
        semester: semesterInput,
      });

      toast.success("Semester added");
      setShowModal(false);
      setSemesterInput("");
      getAllSubject();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    }
  };

  return (
    <div className="subject-page">

      {/* HEADER */}
      <div className="header-row">
        <div>
          <h1>Subject Management</h1>
          <p>Select semester to manage subjects</p>
        </div>

        <button
          className="add-semester-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Semester
        </button>
      </div>

      {/* SEMESTER LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="semester-grid">
          {semesterData.map((item) => (
            <div
              key={item._id}
              className="semester-card"
              onClick={() => handleClick(item)}
            >
              <h2>Semester {item.semester}</h2>
              <p className="available">Subjects available</p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Add Semester</h2>

            <input
              placeholder="Enter semester number"
              value={semesterInput}
              onChange={(e) =>
                setSemesterInput(e.target.value)
              }
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="create-btn"
                onClick={addSemester}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectManagment;
