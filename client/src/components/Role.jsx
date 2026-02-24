import "../style/role.css";
import { Shield, PenTool, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Role = () => {
  const navigate = useNavigate();

  return (
    <section className="rq-section">
      <h2 className="rq-title">Built for Everyone</h2>
      <p className="rq-subtitle">
        Tailored experiences for administrators, faculty, and students
      </p>

      <div className="rq-wrapper">

        {/* ADMIN */}
        <div className="rq-card">
          <div className="rq-icon rq-purple">
            <Shield size={34} />
          </div>

          <h3>Admin</h3>

          <ul className="rq-list">
            <li>Complete system management</li>
            <li>User & subject administration</li>
            <li>Question bank oversight</li>
            <li>System analytics & reports</li>
          </ul>

          <button className="rq-btn rq-purple" onClick={() => navigate("/login")}>
            Login as Admin
          </button>
        </div>

        {/* FACULTY */}
        <div className="rq-card">
          <div className="rq-icon rq-blue">
            <PenTool size={34} />
          </div>

          <h3>Faculty</h3>

          <ul className="rq-list ">
            <li>AI question generation</li>
            <li>Custom paper creation</li>
            <li>Answer key generation</li>
            <li>Blueprint-based exams</li>
          </ul>

          <button className="rq-btn rq-blue" onClick={() => navigate("/login")}>
            Login as Faculty
          </button>
        </div>

        {/* STUDENT */}
        <div className="rq-card">
          <div className="rq-icon rq-green">
            <GraduationCap size={34} />
          </div>

          <h3>Student</h3>

          <ul className="rq-list">
            <li>Practice mode access</li>
            <li>AI-generated tests</li>
            <li>Performance analytics</li>
            <li>Model answer review</li>
          </ul>

          <button className="rq-btn rq-green" onClick={() => navigate("/login")}>
            Login as Student
          </button>
        </div>

      </div>
    </section>
  );
};

export default Role;
