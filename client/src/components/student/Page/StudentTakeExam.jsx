import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { authcontext } from "../../../context/Authcontext";
import "../style/studenttakeexam.css";

const StudentTakeExam = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const token = localStorage.getItem("token");
  const { url } = useContext(authcontext);

  useEffect(() => {

    axios.get(`${url}/api/student/test/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setTest(res.data.data))
    .catch(()=>navigate("/404"));

  }, []);

  // prevent refresh
  useEffect(() => {

    const prevent = e => {
      e.preventDefault();
      e.returnValue="";
    };

    window.addEventListener("beforeunload",prevent);

    return ()=>window.removeEventListener("beforeunload",prevent);

  },[]);

  const handleSelect = (qid, option) => {
    setAnswers({...answers,[qid]:option});
  };

  const submitExam = async () => {

    const res = await axios.post(`${url}/api/student/submit/${id}`,
      { answers },
      { headers:{ Authorization:`Bearer ${token}` }}
    );

    setResult(res.data); // 🔥 store score

  };

  if(!test) return <h2>Loading...</h2>;

  return (

    <div className="exam-container">

      <div className="exam-header">
        <h2>{test.testTitle}</h2>
        <p>Total Questions : {test.questions.length}</p>
      </div>

      <div className="exam-body">

        {test.questions.map((q,i)=>(

          <div className="question-box" key={q._id}>

            <h4>{i+1}. {q.questionText}</h4>

            {q.options.map(op=>(
              <label className="option" key={op}>
                <input
                  type="radio"
                  name={q._id}
                  onChange={()=>handleSelect(q._id,op)}
                />
                {op}
              </label>
            ))}

          </div>

        ))}

        <button className="submit-btn" onClick={submitExam}>
          Submit Exam
        </button>

      </div>

      {/* RESULT MODAL */}

      {result && (
        <div className="result-overlay">

          <div className="result-modal">

            <h2>Exam Completed 🎉</h2>

            <p>Your Score</p>

            <h1>{result.score} / {result.total}</h1>

            <button onClick={()=>navigate("/student/dashboard")}>
              Go Dashboard
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default StudentTakeExam;
