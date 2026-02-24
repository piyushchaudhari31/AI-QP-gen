import React, { useContext, useEffect, useState } from "react";
import StatCard from "../pages/Stactcard";
import "../style/dashboard.css";
import { Users, Book, FileText, BarChart } from "lucide-react";
import { authcontext } from "../../../context/Authcontext";

const Dashboard = () => {
  const [stats, setStats] = useState({
    papercount: 0,
    facultycount: 0,
    studentcount: 0,
    subjectcount: 0,
  });

  const [recentPapers, setRecentPapers] = useState([]);
  const { url } = useContext(authcontext);

  useEffect(() => {
    fetch(`${url}/api/admin/allDetail`)
      .then((res) => res.json())
      .then((data) => setStats(data));

    fetch(`${url}/api/question/recent-papers`)
      .then((res) => res.json())
      .then((data) => setRecentPapers(data));
  }, []);

  return (
    <main className="dashboard">
      <div className="dash-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back 👋</p>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <StatCard icon={<Users />} value={stats.studentcount} label="Students" />
        <StatCard icon={<Book />} value={stats.subjectcount} label="Subjects" />
        <StatCard icon={<FileText />} value={stats.papercount} label="Papers" />
        <StatCard icon={<BarChart />} value={stats.facultycount} label="Faculty" />
      </div>

      {/* RECENT TABLE */}
      <div className="recent-box">
        <div className="recent-header">
          <h3>Recent Generated Papers</h3>
        </div>

        <table className="modern-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Faculty</th>
              <th>Date</th>
              <th>Marks</th>
            </tr>
          </thead>

          <tbody>
            {recentPapers.map((paper) => (
              <tr key={paper._id}>
                <td>{paper.subjectName}</td>
                <td>{paper.faculty?.fullname}</td>
                <td>
                  {new Date(paper.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>{paper.totalMarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Dashboard;