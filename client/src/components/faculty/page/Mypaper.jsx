import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../style/mypaper.css";
import { authcontext } from "../../../context/Authcontext";
import toast from "react-hot-toast";
import { Eye, Trash2, Search, Upload, Loader2, Download } from "lucide-react";
import PaperPreview from "./PaperPreview";
import { useOutletContext } from "react-router-dom";

const MyPapers = () => {

  const { url } = useContext(authcontext);
  const outlet = useOutletContext();
  const setOpen = outlet?.setOpen;

  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);


  

  // ================= GET PAPERS =================
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${url}/api/question/getQuestionPaper`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPapers(res.data.papers || []);
        setFilteredPapers(res.data.papers || []);
      })
      .catch(() => {
        setPapers([]);
        setFilteredPapers([]);
      });
  }, [url]);

  // ================= SEARCH =================
  useEffect(() => {
    const result = papers.filter(p =>
      p.subjectName?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPapers(result);
  }, [search, papers]);

  // ================= UPLOAD =================
  const handleUpload = async (paperId) => {

    const token = localStorage.getItem("token");

    try {

      setLoadingId(paperId);

      const res = await axios.patch(
        `${url}/api/question/upload-paper/${paperId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {

        toast.success("Paper Uploaded Successfully ✅");

        setPapers(prev =>
          prev.map(item =>
            item._id === paperId
              ? { ...item, isUploaded: true }
              : item
          )
        );
      }

    } catch (err) {
      toast.error("Upload Failed ❌");
    } finally {
      setLoadingId(null);
    }
  };

  // ================= DOWNLOAD =================
  const handleDownload = (paper) => {

    let content = `Subject: ${paper.subjectName}\n`;
    content += `Total Marks: ${paper.totalMarks}\n\n`;

    paper.questions.forEach((q, i) => {
      content += `${i + 1}. ${q.questionText}\n`;

      if (q.options?.length) {
        q.options.forEach((opt, idx) => {
          content += `   ${String.fromCharCode(65 + idx)}. ${opt}\n`;
        });
      }
      content += `\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${paper.subjectName}_Question_Paper.txt`;

    link.click();
  };

  return (
    <div className="papers-wrapper">

      <div className="papers-header search-header">
        <div>
          <h1>My Papers</h1>
          <p>Welcome Faculty</p>
        </div>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search Subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="papers-card">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Date</th>
              <th>Marks</th>
              <th>Questions</th>
              <th className="center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPapers.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No Papers Found 📄
                </td>
              </tr>
            ) : (
              filteredPapers.map((p) => (
                <tr key={p._id}>
                  <td>{p.subjectName}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>{p.totalMarks}</td>
                  <td>{p.questions?.length || 0}</td>

                  <td className="center">
                    <div className="action-buttons">

                      {/* VIEW */}
                      <button
                        className="btn view"
                        onClick={() => {
                          setOpen?.(false);
                          setSelectedPaper(p);
                        }}
                      >
                        <Eye size={16} /> View
                      </button>

                      {/* DOWNLOAD ALWAYS */}
                      <button
                        className="btn download"
                        onClick={() => handleDownload(p)}
                      >
                        <Download size={16} /> Download
                      </button>

                      {/* UPLOAD ONLY IF NOT UPLOADED */}
                      {
                        !p.isUploaded && (
                          <button
                            className="btn edit"
                            disabled={loadingId === p._id}
                            onClick={() => handleUpload(p._id)}
                          >
                            {
                              loadingId === p._id
                                ? <Loader2 className="spin" size={16} />
                                : <Upload size={16} />
                            }

                            {
                              loadingId === p._id
                                ? "Uploading..."
                                : "Upload"
                            }
                          </button>
                        )
                      }

                      {/* DELETE */}
                      <button className="btn delete">
                        <Trash2 size={16} /> Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedPaper && (
        <PaperPreview
          paper={selectedPaper}
          onClose={() => {
            setSelectedPaper(null);
            setOpen?.(true);
          }}
        />
      )}
    </div>
  );
};

export default MyPapers;
