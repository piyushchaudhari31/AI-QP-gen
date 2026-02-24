import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../style/questionBankquestion.css";
import { authcontext } from "../../../context/Authcontext";
import jsPDF from "jspdf";


const QuestionBankquestion = () => {
    const { sem } = useParams();
    const [data, setData] = useState([]);
    const [openUnit, setOpenUnit] = useState({});
    const {url} = useContext(authcontext)

    useEffect(() => {
        fetchQB();
    }, []);

    const fetchQB = async () => {
        try {
            const res = await axios.get(
                `${url}/api/student/getAllQuestionBank/${sem}`,
                { withCredentials: true }
            );

            setData(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const toggleUnit = (subjectId, unitNo) => {
        setOpenUnit(prev => ({
            ...prev,
            [`${subjectId}-${unitNo}`]:
                !prev[`${subjectId}-${unitNo}`]
        }));
    };

    const downloadQuestions = subject => {

    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(16);
    doc.text(subject.subjectName, 10, y);

    y += 10;

    subject.units.forEach(unit => {

        doc.setFontSize(13);
        doc.text(`Unit ${unit.unitNo} - ${unit.unitName}`, 10, y);

        y += 8;

        doc.setFontSize(11);

        unit.questions.forEach((q, i) => {

            const lines = doc.splitTextToSize(`${i + 1}. ${q.text}`, 180);

            if (y > 270) {
                doc.addPage();
                y = 15;
            }

            doc.text(lines, 12, y);
            y += lines.length * 6 + 2;

        });

        y += 5;

    });

    doc.save(`${subject.subjectName}.pdf`);
};


    return (
        <div className="qb-container">

            <div className="subject-grid">

                {data.length === 0 ? (

                    <div className="no-data">
                        No Subject Found
                    </div>

                ) : (

                    data.map(subject => (

                        <div className="subject-card" key={subject._id}>

                            <div className="subject-header">
                                <div>
                                    <h2>{subject.subjectName}</h2>
                                </div>

                                <button
                                    className="download-btn"
                                    onClick={() => downloadQuestions(subject)}
                                >
                                    Download
                                </button>
                            </div>

                            <div className="unit-scroll">

                                {subject.units.map(unit => (

                                    <div key={unit._id}>

                                        <div
                                            className="unit-bar"
                                            onClick={() => toggleUnit(subject._id, unit.unitNo)}
                                        >
                                            Unit {unit.unitNo} - {unit.unitName}
                                            <span>▼</span>
                                        </div>

                                        {openUnit[`${subject._id}-${unit.unitNo}`] && (

                                            <div className="question-box">
                                                {unit.questions.map(q => (
                                                    <p key={q._id}>• {q.text}</p>
                                                ))}
                                            </div>

                                        )}

                                    </div>

                                ))}

                            </div>

                        </div>

                    ))

                )}

            </div>


        </div>
    );
};

export default QuestionBankquestion;
