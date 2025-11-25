import React, { useState, useEffect } from "react";

import Sidebar from "./Sidebar";
// import "../styles/ProjectDetails.css";
import "/src/styles/ProjectDetails.css"
import { Users, CalendarDays, ClipboardList, CheckCircle } from "lucide-react";
import { useParams } from "react-router-dom";


const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/boards/${id}`);
        const data = await res.json();
        if (!res.ok) {
          console.error("Error:", data);
          return;
        }
        setProject(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    loadProject();
  }, [id]);
  if (loading) {
    return <div>Loading project...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }
  return (
    <div className="project-container">
      <Sidebar />

      <main className="project-main">


        <header className="project-header">
          <h1 className="project-title">{project.title}</h1>
          <p className="project-subtitle">
            {project.organization || "My Workspace"}
          </p>
        </header>


        <div className="project-overview">
          <div className="project-card">
            <ClipboardList size={20} />
            <div>
              <h4>Status</h4>
              <p>{project.status}</p>
            </div>
          </div>

          <div className="project-card">
            <CalendarDays size={20} />
            <div>
              <h4>Deadline</h4>
              <p>
                {project.deadline
                  ? new Date(project.deadline).toLocaleDateString()
                  : "No Deadline"}
              </p>
            </div>
          </div>

          <div className="project-card">
            <CheckCircle size={20} />
            <div>
              <h4>Progress</h4>
              <p>{project.progress}%</p>
            </div>
          </div>

          <div className="project-card">
            <Users size={20} />
            <div>
              <h4>Team Members</h4>
              <p>{project.members?.length || 1} Members</p>
            </div>
          </div>
        </div>


        {/* DESCRIPTION */}
        <section className="project-section">
          <h2>Description</h2>
          <p>{project.description || "No description added."}</p>
        </section>

        {/* KANBAN BOARD SECTION */}
        <section className="kanban-section">
          <h2>Task Board</h2>

          <div className="kanban-board">
            {project.lists.map((list) => (
              <div key={list.id} className="kanban-column">
                <h3>
                  {list.title} ({list.cards.length})
                </h3>

                {list.cards.map((card) => (
                  <div key={card.id} className="kanban-task">
                    <strong>{card.title}</strong>
                    {card.description && <p>{card.description}</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectDetails;






