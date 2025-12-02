import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import "../styles/Projects.css";
import { CalendarDays, Users, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import InviteModal from "./InviteModal";

const Projects = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteBoardId, setInviteBoardId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  const projectColors = [
    { bg: "#ccfafa", darkBg: "rgba(0, 185, 185, 0.15)", border: "#00b9b9" },
    { bg: "#e5f0ff", darkBg: "rgba(122, 175, 245, 0.15)", border: "#7aaff5" },
    { bg: "#edf4ef", darkBg: "rgba(180, 204, 185, 0.15)", border: "#b4ccb9" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    deadline: "",
    progress: 0,
    description: "",
    status: "Not Started",
    template: "",
    organization: "",
  });

  // Load projects
  useEffect(() => {
    const loadBoards = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return navigate("/login");

      try {
        const res = await fetch(`http://localhost:3000/api/boards?userId=${user.id}`);
        const data = await res.json();

        const mapped = data.map((b, index) => ({
          id: b.id,
          name: b.title,
          deadline: b.deadline,
          description: b.description,
          progress: b.progress,
          members: b.members?.length || 1,
          status: b.status,
          ...projectColors[index % projectColors.length],
        }));

        setProjects(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    loadBoards();
  }, [navigate]);

  // Close dropdown on outside click
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

  const createProject = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    if (!formData.name || !formData.deadline)
      return alert("Project Name & Deadline required!");

    const mappedStatus =
      formData.status === "Not Started"
        ? "NOT_STARTED"
        : formData.status === "In Progress"
          ? "IN_PROGRESS"
          : "COMPLETED";

    try {
      const res = await fetch("http://localhost:3000/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.name,
          description: formData.description,
          deadline: formData.deadline,
          progress: Number(formData.progress),
          status: mappedStatus,
          template: formData.template,
          organization: formData.organization,
          userId: user.id,
        }),
      });

      const newBoard = await res.json();
      if (!res.ok) return alert(newBoard.message || "Failed to create project");

      const index = projects.length % projectColors.length;
      const newColor = projectColors[index];

      setProjects([
        ...projects,
        {
          id: newBoard.id,
          name: newBoard.title,
          deadline: newBoard.deadline,
          progress: newBoard.progress,
          description: newBoard.description,
          members: 1,
          status: newBoard.status,
          ...newColor,
        },
      ]);

      setShowModal(false);
      setFormData({
        name: "",
        deadline: "",
        progress: 0,
        description: "",
        status: "Not Started",
        template: "",
        organization: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  const deleteProject = async (e, projectId) => {
    e.stopPropagation(); // Prevent navigation to details
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/boards/${projectId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== projectId));
      } else {
        alert("Failed to delete project");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Error deleting project");
    }
  };

  return (
    <div className="projects-container">
      <Sidebar />

      <main className="projects-main">

        <div className="projects-header-new">
          <h1>Projects</h1>
        </div>

        <div className="create-card" onClick={openDropdownAt}>
          <Plus size={35} />
          <p>Create New Project</p>
        </div>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="create-dropdown"
            style={{ top: dropdownPos.top, left: dropdownPos.left, position: "absolute" }}
          >
            <div className="dropdown-item" onClick={() => openCreateModal("Todo Template")}>Todo Template</div>
            <div className="dropdown-item" onClick={() => openCreateModal("Project Template")}>Project Template</div>
            <div className="dropdown-item" onClick={() => openCreateModal("Table")}>Table</div>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Create Project</h2>

              <label>Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <label>Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
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
                <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="create-btn-modal" onClick={createProject}>Create</button>
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
                <button
                  className="delete-project-btn"
                  onClick={(e) => deleteProject(e, project.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#ff4d4d",
                    padding: "4px",
                    marginLeft: "auto"
                  }}
                  title="Delete Project"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="project-info">
                <p><CalendarDays size={16} /> Due: {new Date(project.deadline).toLocaleDateString()}</p>
                <p><Users size={16} /> {project.members} Members</p>

                <div className="project-progress">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>

                <div className="progress-bar-proj">
                  <div
                    className="progress-fill-proj"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <Link
                to={`/project-detail/${project.id}`}
                className="details-btn"
                style={{ backgroundColor: project.border }}
              >
                View Project →
              </Link>
              <button
                className="invite-btn-card"
                onClick={(e) => {
                  e.preventDefault();
                  setInviteBoardId(project.id);
                  setShowInviteModal(true);
                }}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: `1px dashed ${project.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#555',
                  fontSize: '13px'
                }}
              >
                + Invite Member
              </button>
            </div>
          ))}
        </div>

        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          boardId={inviteBoardId}
        />

      </main>
    </div>
  );
};

export default Projects;
