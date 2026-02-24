import React from "react";

const PaperPreview = ({ paper, onClose }) => {
    return (
        <div className="preview-overlay">
            <div className="preview-modal">

                {/* Header */}
                <div className="preview-header">
                    <h3>Question Paper Preview</h3>
                    <button onClick={onClose}>✖</button>
                </div>

                {/* Body */}
                <div className="preview-body">
                    <div className="paper-page">

                        <div className="paper-header">
                            <h2>UKA TARSADIA UNIVERSITY</h2>
                            <p>B.Tech – Semester {paper.semester}</p>
                            <p>{paper.examType}</p>

                            <div className="paper-meta">
                                <span>Max Marks: {paper.totalMarks}</span>
                                
                            </div>
                        </div>

                        <hr />

                        {paper.questions.map((q, index) => (
                            <div key={q._id} className="question">
                                <p className="q-title">
                                    Q{index + 1}. {q.questionText}
                                    <span className="marks">[{q.marks}]</span>
                                </p>

                                {q.options.length > 0 && (
                                    <ul className="options">
                                        {q.options.map((op, i) => (
                                            <li key={i}>{op}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaperPreview;
