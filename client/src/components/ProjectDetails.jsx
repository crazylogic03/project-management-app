import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "../styles/ProjectDetails.css";
import { Users, CalendarDays, ClipboardList, CheckCircle } from "lucide-react";

const ProjectDetails = () => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: 1, title: "Wireframe Homepage" },
      { id: 2, title: "Logo Design" },
    ],
    inprogress: [
      { id: 3, title: "API Integration" },
    ],
    review: [
      { id: 4, title: "UI Polish" },
    ],
    done: [
      { id: 5, title: "Database Schema" },
    ],
  });

  return (
    <div className="project-container">
      <Sidebar />
      <main className="project-main">
        <header className="project-header">
          <h1 className="project-title">E-commerce Website Development</h1>
          <p className="project-subtitle">Overview & Tasks</p>
        </header>

        <div className="project-overview">
          <div className="project-card">
            <ClipboardList size={20} />
            <div>
              <h4>Status</h4>
              <p>Active</p>
            </div>
          </div>

          <div className="project-card">
            <CalendarDays size={20} />
            <div>
              <h4>Due Date</h4>
              <p>30 Oct 2025</p>
            </div>
          </div>

          <div className="project-card">
            <CheckCircle size={20} />
            <div>
              <h4>Progress</h4>
              <p>58%</p>
            </div>
          </div>

          <div className="project-card">
            <Users size={20} />
            <div>
              <h4>Team Members</h4>
              <p>5 Members</p>
            </div>
          </div>
        </div>

        <section className="project-section">
          <h2>Description</h2>
          <p>
            This project involves creating a complete e-commerce website with features like 
            user authentication, product browsing, cart and payment gateway integration, 
            admin panel, and order tracking.  
          </p>
        </section>

        <section className="kanban-section">
          <h2>Task Board</h2>
          <div className="kanban-board">
            <div className="kanban-column">
              <h3>To-Do ({tasks.todo.length})</h3>
              {tasks.todo.map(task => (
                <div key={task.id} className="kanban-task">
                  {task.title}
                </div>
              ))}
            </div>

            <div className="kanban-column">
              <h3>In Progress ({tasks.inprogress.length})</h3>
              {tasks.inprogress.map(task => (
                <div key={task.id} className="kanban-task">
                  {task.title}
                </div>
              ))}
            </div>

            <div className="kanban-column">
              <h3>Review ({tasks.review.length})</h3>
              {tasks.review.map(task => (
                <div key={task.id} className="kanban-task">
                  {task.title}
                </div>
              ))}
            </div>

            <div className="kanban-column">
              <h3>Done ({tasks.done.length})</h3>
              {tasks.done.map(task => (
                <div key={task.id} className="kanban-task done">
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectDetails;
