import React from "react";
import { motion } from "framer-motion";
import {
  Home,
  FolderKanban,
  FileText,
  CheckSquare,
  CalendarDays,
  BarChart3,
  FileStack,
  Settings,
  LogOut,
} from "lucide-react";
import "../styles/Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <motion.aside
        className="sidebar"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        {/* Close Button */}
        <div className="sidebar-header">
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav">
          <a href="#" className="active">
            <Home size={20} /> Dashboard
          </a>
          <a href="#">
            <FolderKanban size={20} /> Projects
          </a>
          <a href="#">
            <FileText size={20} /> Project Detail
          </a>
          <a href="#">
            <CheckSquare size={20} /> Task Detail
          </a>
          <a href="#">
            <CalendarDays size={20} /> Calendar
          </a>
          <a href="#">
            <BarChart3 size={20} /> Reports
          </a>
          <a href="#">
            <FileStack size={20} /> Files
          </a>
          <a href="#">
            <Settings size={20} /> Settings
          </a>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <a href="#">
            <LogOut size={20} /> Logout
          </a>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
