import React, { useEffect, useRef, useState, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { authcontext } from "../../../context/Authcontext";
import "../style/editpaper.css";

const EditPaper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { url } = useContext(authcontext);

  const [paper, setPaper] = useState(null);
  const quillRef = useRef(null);

  // fetch paper
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${url}/api/question/paper/edit/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPaper(res.data.paper));
  }, [id, url]);

  // init ONE quill
  useEffect(() => {
    if (!paper || quillRef.current) return;

    const quill = new Quill("#main-editor", {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
      },
    });

    // merge all questions into one editor
    const mergedContent = paper.questions
      .map(
        (q, index) =>
          `<p><strong>Question ${index + 1}:</strong></p>${q.questionText}`
      )
      .join("<br/>");

    quill.root.innerHTML = mergedContent;

    quill.on("text-change", () => {
      paper.fullPaperText = quill.root.innerHTML;
    });

    quillRef.current = quill;
  }, [paper]);

  // save
  const handleSave = async () => {
    const token = localStorage.getItem("token");

    await axios.put(
      `${url}/api/question/updatePaper/${id}`,
      {
        ...paper,
        fullPaperText: quillRef.current.root.innerHTML,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate("/faculty/my-papers");
  };

  if (!paper) return <p>Loading...</p>;

  return (
    <div className="edit-paper">
      <h1>Edit Question Paper</h1>

      {/* ONE MAIN EDITOR */}
      <div id="main-editor" className="quill-editor"></div>

      <div className="edit-actions">
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
        <button className="cancel-btn" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditPaper;
