import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "../style/semestersubject.css";
import { authcontext } from "../../../context/Authcontext";
import toast from "react-hot-toast";

const SemesterSubjects = () => {
  const { sem } = useParams(); // semester document _id
  const { url } = useContext(authcontext);

  const [subjects, setSubjects] = useState([]);
  const [topicsBySubject, setTopicsBySubject] = useState({});
  const [openUnitId, setOpenUnitId] = useState(null);
  const [search, setSearch] = useState("");

  /* SUBJECT MODAL */
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState(null);

  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [saving, setSaving] = useState(false);

  /* DELETE */
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);

  /* UNIT MODAL */
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [currentSubjectId, setCurrentSubjectId] = useState(null);
  const [unitNo, setUnitNo] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [topics, setTopics] = useState([""]);
  const [unitSaving, setUnitSaving] = useState(false);

  /* TOPIC EDIT MODAL */
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editTopicId, setEditTopicId] = useState(null);
  const [editTopicName, setEditTopicName] = useState("");
  const [topicSaving, setTopicSaving] = useState(false);

  const handleUpdateTopic = async () => {
    if (!editTopicName) return;

    setTopicSaving(true);
    const toastId = toast.loading("Updating...");

    try {
      await axios.put(`${url}/api/topic/update-topic/${editTopicId}`, {
        topicName: editTopicName,
      });

      toast("updated successfully", {
        id: toastId,
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        position: "bottom-right",
      });

      setShowTopicModal(false);
      setEditTopicId(null);
      setEditTopicName("");
      fetchSubjects();
    } catch (err) {
      console.log(err);
      toast.error("Failed", { id: toastId });
    } finally {
      setTopicSaving(false);
    }
  };

  /* ================= FETCH SUBJECTS ================= */
  const fetchSubjects = async () => {
    const res = await axios.get(`${url}/api/subject/getSubjectBySem/${sem}`);
    const subjectList = res?.data?.data?.subjects || [];
    setSubjects(subjectList);

    const requests = subjectList.map((sub) =>
      axios
        .get(`${url}/api/topic/subject-topics/${sub._id}`, {
          validateStatus: (s) => s === 200 || s === 404,
        })
        .then((r) => ({
          subjectId: sub._id,
          units: r.status === 200 ? r.data?.data?.units || [] : [],
        })),
    );

    const result = await Promise.all(requests);
    const map = {};
    result.forEach((r) => (map[r.subjectId] = r.units));
    setTopicsBySubject(map);
  };

  /* ================= FETCH FACULTY ================= */
  const fetchFaculties = async () => {
    const res = await axios.get(`${url}/api/admin/allteachers`);
    setFacultyList(res?.data?.user || []);
  };

  useEffect(() => {
    fetchSubjects();
    fetchFaculties();
  }, [sem]);

  /* ================= SUBJECT CREATE / UPDATE ================= */
  const handleSubmitSubject = async () => {
    if (!subjectName || !subjectCode || !selectedFaculty) {
      toast("All fields required", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Saving...");

    try {
      if (isEditMode) {
        await axios.put(`${url}/api/subject/update-subject/${editSubjectId}`, {
          name: subjectName,
          subjectCode,
          facultyId: selectedFaculty,
        });

        toast("Subject updated successfully", {
          id: toastId,
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          position: "bottom-right",
        });
      } else {
        await axios.post(`${url}/api/subject/create`, {
          name: subjectName,
          subjectCode,
          semester: sem,
          facultyId: selectedFaculty,
        });

        toast("Subject created successfully", {
          id: toastId,
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          position: "bottom-right",
        });
      }

      resetSubjectModal();
      fetchSubjects();
    } catch (error) {
      toast("Something went wrong!", {
        id: toastId,
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setSaving(false);
    }
  };

  const resetSubjectModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setEditSubjectId(null);
    setSubjectName("");
    setSubjectCode("");
    setSelectedFaculty("");
  };

  /* ================= EDIT ================= */
  const handleEditSubject = (sub) => {
    setIsEditMode(true);
    setEditSubjectId(sub._id);
    setSubjectName(sub.name);
    setSubjectCode(sub.subjectCode);
    setSelectedFaculty(sub.faculty?._id || "");
    setShowModal(true);
  };

  /* ================= DELETE ================= */
  const handleDeleteSubject = async () => {
    await axios.delete(`${url}/api/subject/delete-subject/${deleteSubjectId}`);
    setShowDeletePopup(false);
    fetchSubjects();
    toast("delete successfully", {
      icon: "✅",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
      position: "bottom-right",
    });
  };

  const handleDeleteTopic = async (topicId) => {
    const toastId = toast.loading("Deleting...");

    try {
      await axios.delete(`${url}/api/topic/delete-topic/${topicId}`);

      toast("Topic deleted successfully", {
        id: toastId,
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        position: "bottom-right",
      });

      fetchSubjects(); // refresh UI
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete", { id: toastId });
    }
  };
  /* ================= UNIT ================= */
  const handleCreateUnit = async () => {
    if (!unitNo || !chapterName) return;

    setUnitSaving(true);

    await axios.post(`${url}/api/topic/create/${currentSubjectId}`, {
      unit: unitNo,
      chapterName,
      topics: topics.filter((t) => t.trim()).map((t) => ({ name: t })),
    });

    setShowUnitModal(false);
    setUnitNo("");
    setChapterName("");
    setTopics([""]);
    fetchSubjects();
    setUnitSaving(false);
  };

  const toggleUnit = (id) => setOpenUnitId(openUnitId === id ? null : id);

  const filteredSubjects = subjects.filter((s) =>
    `${s.name} ${s.subjectCode}`.toLowerCase().includes(search.toLowerCase()),
  );

  /* ================= UI ================= */
  return (
    <div className="semester-subject-page">
      <div className="subject-top">
        <h1>Subject Management</h1>

        <div className="header-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              placeholder="Search subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className="add-subject-btn"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} /> Add Subject
          </button>
        </div>
      </div>
      <div className="subject-list-box">
        <div className="subject-list">
          {filteredSubjects.map((sub) => (
            <div className="subject-card" key={sub._id}>
              <div className="subject-header">
                <div>
                  <h2>{sub.name}</h2>
                  <span className="code">Code: {sub.subjectCode}</span>
                  <span className="code">
                    Faculty: {sub.faculty?.fullname || "Not Assigned"}
                  </span>
                </div>

                <div className="subject-actions">
                  <button
                    className="add-unit-btn"
                    onClick={() => {
                      setCurrentSubjectId(sub._id);
                      setShowUnitModal(true);
                    }}
                  >
                    <Plus size={16} /> Add Unit
                  </button>

                  <Pencil
                    size={18}
                    className="edit-icon"
                    onClick={() => handleEditSubject(sub)}
                  />

                  <Trash2
                    size={18}
                    className="delete-icon"
                    onClick={() => {
                      setDeleteSubjectId(sub._id);
                      setShowDeletePopup(true);
                    }}
                  />
                </div>
              </div>

              <div className="unit-box">
                {topicsBySubject[sub._id]?.map((unit) => (
                  <div key={unit._id} className="unit-block">
                    <div
                      className="unit-title"
                      onClick={() => toggleUnit(unit._id)}
                    >
                      <span>
                        Unit {unit.unitNo}: {unit.chapterName}
                      </span>

                      <div className="unit-actions">
                        <Pencil
                          size={16}
                          className="unit-edit-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditUnit(unit);
                          }}
                        />

                        {openUnitId === unit._id ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </div>
                    </div>

                    {openUnitId === unit._id && (
                      <div className="topic-chips">
                        {unit.topics.map((t) => (
                          <div key={t._id} className="topic-chip">
                            <span className="topic-text">{t.name}</span>

                            <div className="topic-edit-wrapper">
                              <Pencil
                                size={16}
                                className="topic-edit-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditTopicId(t._id);
                                  setEditTopicName(t.name);
                                  setShowTopicModal(true);
                                }}
                              />

                              <Trash2
                                size={16}
                                className="topic-delete-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTopic(t._id);
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUBJECT MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{isEditMode ? "Update Subject" : "Add Subject"}</h2>

            <input
              placeholder="Subject Name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />

            <input
              placeholder="Subject Code"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
            />

            <select
              className="faculty-select"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              <option value="">Select Faculty</option>
              {facultyList.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.fullname}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button className="cancel-btns" onClick={resetSubjectModal}>
                Cancel
              </button>
              <button
                className="create-btn"
                onClick={handleSubmitSubject}
                disabled={saving}
              >
                {saving ? "Saving..." : isEditMode ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIT MODAL */}
      {showUnitModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Add Unit</h2>

            <input
              placeholder="Unit Number"
              value={unitNo}
              onChange={(e) => setUnitNo(e.target.value)}
            />

            <input
              placeholder="Chapter Name"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
            />

            {topics.map((t, i) => (
              <div key={i} className="topic-row">
                <input
                  placeholder={`Topic ${i + 1}`}
                  value={t}
                  onChange={(e) => {
                    const copy = [...topics];
                    copy[i] = e.target.value;
                    setTopics(copy);
                  }}
                />

                {topics.length > 1 && (
                  <button
                    className="remove-topic-btn"
                    onClick={() => {
                      const copy = topics.filter((_, idx) => idx !== i);
                      setTopics(copy);
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              className="Topic"
              onClick={() => setTopics([...topics, ""])}
            >
              + Add Topic
            </button>

            <div className="modal-actions">
              <button
                className="cancel-btns"
                onClick={() => setShowUnitModal(false)}
              >
                Cancel
              </button>
              <button
                className="create-btn"
                onClick={handleCreateUnit}
                disabled={unitSaving}
              >
                {unitSaving ? "Saving..." : "Add Unit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Are you Sure Delete Subject?</h2>
            <div className="modal-actions">
              <button
                className="cancel-btns"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button className="delete-btn" onClick={handleDeleteSubject}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showTopicModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Update Topic</h2>

            <input
              placeholder="Topic Name"
              value={editTopicName}
              onChange={(e) => setEditTopicName(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="cancel-btns"
                onClick={() => setShowTopicModal(false)}
              >
                Cancel
              </button>

              <button
                className="create-btn"
                onClick={handleUpdateTopic}
                disabled={topicSaving}
              >
                {topicSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterSubjects;
