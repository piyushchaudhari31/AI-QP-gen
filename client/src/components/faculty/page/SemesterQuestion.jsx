import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Search, X, Trash2, Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import "../style/semesterQb.css";
import { authcontext } from "../../../context/Authcontext";

const SemesterQuestion = () => {
  const { semester } = useParams();
  const { url } = useContext(authcontext);
  const token = localStorage.getItem("token");

  const [subjects, setSubjects] = useState([]);
  const [unitsData, setUnitsData] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [openUnit, setOpenUnit] = useState(null);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);

  const [unitNo, setUnitNo] = useState("");
  const [topics, setTopics] = useState([""]);

  /* ================= FETCH SUBJECTS ================= */
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(
          `${url}/api/faculty/getsubjectbyAdmin/${semester}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const subjectsList = res.data.subjects || [];
        setSubjects(subjectsList);

        fetchUnits(subjectsList);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubjects();
    fetchQuestions();
  }, [semester]);

  /* ================= FETCH UNITS ================= */
  const fetchUnits = async (subjectsList) => {
    try {
      const allUnits = await Promise.all(
        subjectsList.map(async (sub) => {
          const res = await axios.get(
            `${url}/api/faculty/getunits/${sub.subjectId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          return {
            subjectId: sub.subjectId,
            units: res.data.units?.units || [],
          };
        })
      );

      setUnitsData(allUnits);
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= FETCH QUESTIONS ================= */
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `${url}/api/faculty/questionBank/question`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestionBank(res.data.questions || []);
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= ADD QUESTION ================= */
  const addQuestion = async () => {
    try {
      const id = toast.loading("Uploading...");

      await axios.post(
        `${url}/api/faculty/QuestionBank/${activeSubject.subjectId}`,
        { semester, unitNo, questions: topics },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Question Added", { id });

      fetchQuestions();
      setShowModal(false);
      setTopics([""]);
      setUnitNo("");
    } catch (err) {
      toast.error("Error adding question");
    }
  };

  const addTopic = () => setTopics([...topics, ""]);

  const handleTopicChange = (i, v) => {
    const copy = [...topics];
    copy[i] = v;
    setTopics(copy);
  };

  return (
    <div className="sq-container">
      {/* HEADER */}
      <div className="sq-header">
        <h2>Question Bank (Sem {semester})</h2>

        <div className="sq-search">
          <Search size={18} />
          <input
            placeholder="Search subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* SUBJECT LIST */}
      <div className="sq-list">
        {subjects
          .filter((s) =>
            s.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((sub) => {
            const unitDoc = unitsData.find(
              (u) => String(u.subjectId) === String(sub.subjectId)
            );

            const qb = questionBank.find(
              (q) => String(q.subjectId) === String(sub.subjectId)
            );

            return (
              <div key={sub.subjectId} className="sq-card">
                <div className="subject-header">
                  <div>
                    <h3>{sub.name}</h3>
                    <p>Code: {sub.subjectCode}</p>
                  </div>


                </div>

                {/* UNITS */}
                {unitDoc?.units?.map((unit) => {
                  const key = `${sub.subjectId}-${unit.unitNo}`;

                  return (
                    <div key={key}>
                      <div className="unit-title">

                        {/* LEFT TEXT */}
                        <div
                          className="unit-text"
                          onClick={() =>
                            setOpenUnit(openUnit === key ? null : key)
                          }
                        >
                          Unit {unit.unitNo} :- {unit.chapterName}
                        </div>

                        {/* RIGHT ICONS */}
                        <div className="unit-actions">

                          {/* ADD QUESTION */}
                          <button
                            className="add-q-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSubject(sub);
                              setUnitNo(unit.unitNo);
                              setShowModal(true);
                            }}
                          >
                            +
                          </button>

                          {/* DROPDOWN */}
                          <span>
                            {openUnit === key ? "▲" : "▼"}
                          </span>

                        </div>
                      </div>


                      {openUnit === key && (
                        <div className="question-scroll">
                          {qb?.units
                            ?.find((u) => u.unitNo === unit.unitNo)
                            ?.questions?.map((q) => (
                              <div
                                key={q._id}
                                className="question-card"
                              >
                                <span>{q.text}</span>

                                <button
                                  className="delete-question-btn"
                                  onClick={async () => {
                                    try {
                                      const id =
                                        toast.loading("Deleting...");

                                      await axios.delete(
                                        `${url}/api/faculty/deleteQuestion/${q._id}`,
                                        {
                                          headers: {
                                            Authorization: `Bearer ${token}`,
                                          },
                                        }
                                      );

                                      toast.success("Deleted Sucessfully", {
                                        id,
                                      });
                                      fetchQuestions();
                                    } catch {
                                      toast.error("Delete failed");
                                    }
                                  }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Add Question (Unit {unitNo})</h3>
              <X onClick={() => setShowModal(false)} />
            </div>

            <input className="unit-number"
              placeholder="Unit Number"
              value={unitNo}
              onChange={(e) => setUnitNo(e.target.value)}
              readOnly
            />

            {topics.map((topic, i) => (
              <div key={i} className="topic-row">
                <textarea
                  rows="1"
                  className="auto-textarea"
                  value={topic}
                  placeholder={`Question ${i + 1}`}
                  onChange={(e) => {
                    handleTopicChange(i, e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height =
                      e.target.scrollHeight + "px";
                  }}
                />

                {topics.length > 1 && (
                  <button
                    className="topic-delete-btn"
                    onClick={() =>
                      setTopics(
                        topics.filter((_, idx) => idx !== i)
                      )
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}

            <div className="modal-actions">
              <button
                className="add-topic-btn"
                onClick={addTopic}
              >
                + Add Question
              </button>

              <button
                className="primary-btn"
                onClick={addQuestion}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterQuestion;
