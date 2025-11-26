import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import "../styles/Projects.css";
import { CalendarDays, Users, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Projects = () => {
  const { darkMode } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  const projectColors = [
    { bg: "#ccfafa", darkBg: "rgba(0, 185, 185, 0.15)", border: "#00b9b9" },
    { bg: "#e5f0ff", darkBg: "rgba(122, 175, 245, 0.15)", border: "#7aaff5" },
    { bg: "#edf4ef", darkBg: "rgba(180, 204, 185, 0.15)", border: "#b4ccb9" },
  ];

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "E-commerce Website",
      deadline: "2025-10-30",
      members: 5,
      progress: 58,
      description: "",
      status: "In Progress",
      ...projectColors[0],
    },
    {
      id: 2,
      name: "Mobile App UI",
      deadline: "2025-11-12",
      members: 3,
      progress: 72,
      description: "",
      status: "In Progress",
      ...projectColors[1],
    },
    {
      id: 3,
      name: "Marketing Dashboard",
      deadline: "2025-12-05",
      members: 4,
      progress: 40,
      description: "",
      status: "Not Started",
      ...projectColors[2],
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    deadline: "",
    members: 1,
    progress: 0,
    description: "",
    status: "Not Started",
    template: "",
  });

  useEffect(() => {
    const close = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".create-card")
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const openDropdownAt = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
    });
    setShowDropdown(true);
  };

  const openCreateModal = (template) => {
    setFormData({ ...formData, template });
    setShowDropdown(false);
    setShowModal(true);
  };

  const createProject = () => {
    if (!formData.name || !formData.deadline) return alert("Fill name & deadline!");

    const index = projects.length % 3;
    const newColor = projectColors[index];

    const newProject = {
      id: Date.now(),
      ...formData,
      ...newColor,
    };

    setProjects([...projects, newProject]);
    setShowModal(false);

    setFormData({
      name: "",
      deadline: "",
      members: 1,
      progress: 0,
      description: "",
      status: "Not Started",
      template: "",
    });
  };

  return (
    <div className="projects-container">
      <Sidebar />
      <main className="projects-main">
        <div className="projects-header-new">
          <h1>Projects</h1>
        </div>

        <div className="create-card" onClick={(e) => openDropdownAt(e)}>
          <Plus size={35} />
          <p>Create New Project</p>
        </div>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="create-dropdown"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
              position: "absolute",
            }}
          >
            <div className="dropdown-item" onClick={() => openCreateModal("Todo Template")}>
              Todo Template
            </div>

            <div className="dropdown-item" onClick={() => openCreateModal("Project Template")}>
              Project Template
            </div>

            <div className="dropdown-item" onClick={() => openCreateModal("Table")}>
              Table
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Create Project</h2>

              <label>Project Name</label>
              <input
                type="text"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <label>Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />

              <label>Members</label>
              <input
                type="number"
                min="1"
                value={formData.members}
                onChange={(e) => setFormData({ ...formData, members: e.target.value })}
              />

              <label>Progress</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              />

              <label>Description</label>
              <textarea
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>

                <button className="create-btn-modal" onClick={createProject}>
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        <h2 className="section-title">Your Boards</h2>

        <div className="projects-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              style={{
                backgroundColor: darkMode ? project.darkBg : project.bg,
                borderLeft: `6px solid ${project.border}`,
              }}
            >
              <div className="project-card-top">
                <h3>{project.name}</h3>
              </div>

              <div className="project-info">
                <p>
                  <CalendarDays size={16} /> Due:{" "}
                  {new Date(project.deadline).toLocaleDateString()}
                </p>

                <p>
                  <Users size={16} /> {project.members} Members
                </p>

                <div className="project-progress">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>

                <div className="progress-bar-proj">
                  <div
                    className="progress-fill-proj"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <Link
                to="/project-detail"
                className="details-btn"
                style={{ backgroundColor: project.border }}
              >
                View Project →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Projects;
