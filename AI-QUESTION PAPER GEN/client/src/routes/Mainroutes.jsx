import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../auth/Login";
import Register from "../auth/Register";
import Home from "../page/Home";
import AdminHome from "../page/AdminHome";
import PageNotfound from "../page/PageNotfound";
import ProtectedRoute from "../page/ProtectedRoute";

import Dashboard from "../components/admin/pages/Dashboard";
import UserManagment from "../components/admin/pages/UserManagment";
import SubjectManagment from "../components/admin/pages/SubjectManagment";
import SemesterSubjects from "../components/admin/pages/SemesterSubjects";
import Setting from "../components/admin/pages/Setting";

import DashboardFaculty from "../components/faculty/page/DashboardFaculty";
import QuestionBank from "../components/faculty/page/QuestionBank";
import GeneratePaper from "../components/faculty/page/GeneratePaper";
import Mypaper from "../components/faculty/page/Mypaper";
import SemesterQuestion from "../components/faculty/page/SemesterQuestion";
import FacultyLayout from "../components/faculty/page/FacultyLayout";
import EditPaper from "../components/faculty/page/EditPaper";
import Settings from "../components/faculty/page/Settings";
import QuestionPaper from "../components/admin/pages/QuestionPaper";
import StudentDashboard from "../components/student/Page/StudentDashboard";
import StudentLayout from "../components/student/StudentContent";
import SettingStudent from "../components/student/Page/SettingStudent";

import QuestionPapers from "../components/student/Page/QuestionPaper";
import StudentQuestionBank from "../components/student/Page/StudentQuestionBank";
import QuestionBankquestion from "../components/student/Page/QuestionBankquestion";
import StudentExam from "../components/student/Page/StudentExam";
import StudentTakeExam from "../components/student/Page/StudentTakeExam";

const Mainroutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/Admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminHome />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagment />} />
        <Route path="subjects" element={<SubjectManagment />} />
        <Route path="subjects/:sem" element={<SemesterSubjects />} />
        <Route path="papers" element={<QuestionPaper />} />
        <Route path="settings" element={<Setting />} />
      </Route>

      {/* ================= FACULTY ================= */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <FacultyLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardFaculty />} />
        <Route path="question-bank" element={<QuestionBank />} />
        <Route path="question-bank/:semester" element={<SemesterQuestion />} />
        <Route path="generate-paper" element={<GeneratePaper />} />
        <Route path="my-papers" element={<Mypaper />} />
        <Route path="settings" element={<Settings />} />

        {/* 🔥 NEW EDIT ROUTE */}
        <Route path="edit-paper/:id" element={<EditPaper />} />
      </Route>



      {/* ================= STUDENT ================= */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="QuestionPaper" element={<QuestionPapers />} />
        <Route path="questionBank" element={<StudentQuestionBank />} />
        <Route path="questionBank/:sem" element={<QuestionBankquestion />}></Route>
        <Route path="performance" element={<StudentExam />} />
        <Route path="settings" element={<SettingStudent />} />
        <Route path="exam/:id" element={<StudentTakeExam/>}/>

      </Route>


      {/* 404 */}
      <Route path="/404" element={<PageNotfound />} />
      <Route path="*" element={<PageNotfound />} />
    </Routes>
  );
};

export default Mainroutes;
