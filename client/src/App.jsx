import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./components/SignUp";
import LoginPage from "./components/SignIn";
import ForgotPasswordPage from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import Projects from "./components/Projects";
import ProjectDetail from "./components/ProjectDetails";
import TaskDetails from "./components/TaskDetails";
import Calendar from "./components/Calendar";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project-detail/:id" element={<ProjectDetail />} />
          <Route path="/task-detail" element={<TaskDetails />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="*" element={<Navigate to="/signup" />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
