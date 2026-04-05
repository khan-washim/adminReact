import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import QuestionBank from './pages/QuestionBank.jsx';
import UserQuestions from './pages/UserQuestions.jsx';
import ImportQuestions from './pages/ImportQuestions.jsx';
import Subjects from './pages/Subjects.jsx';
import ExamConfigs from './pages/ExamConfigs.jsx';
import ExamTypes from './pages/ExamTypes.jsx';
import Users from './pages/Users.jsx';
import ToastContainer from './components/common/ToastContainer.jsx';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="user-questions" element={<UserQuestions />} />
          <Route path="import-questions" element={<ImportQuestions />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="exam-configs" element={<ExamConfigs />} />
          <Route path="exam-types" element={<ExamTypes />} />
          <Route path="users" element={<Users />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
