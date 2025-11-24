import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Settings, Bell } from "lucide-react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Design Landing Page", type: "UI/UX Design", deadline: "2025-10-30T15:30:00", completed: 2, total: 5 },
    { id: 2, title: "Database Optimization", type: "Backend Task", deadline: "2025-10-28T12:00:00", completed: 4, total: 4 },
    { id: 3, title: "Marketing Strategy Draft", type: "Planning", deadline: "2025-11-01T10:00:00", completed: 1, total: 3 },
  ]);

  const [countdowns, setCountdowns] = useState({});

  const notifications = [
    { id: 1, text: "New project 'Ecom Site' added", time: "2h ago" },
    { id: 2, text: "Task 'Wireframes' marked complete", time: "5h ago" },
    { id: 3, text: "Team meeting scheduled for Friday", time: "1d ago" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const updated = {};

      tasks.forEach((task) => {
        const diff = new Date(task.deadline).getTime() - now;
        if (diff > 0) {
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          updated[task.id] = `${d}d ${h}h ${m}m`;
        } else {
          updated[task.id] = "Expired";
        }
      });

      setCountdowns(updated);
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const total = tasks.length;
  const active = tasks.filter((t) => t.completed < t.total).length;
  const completed = tasks.filter((t) => t.completed === t.total).length;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="divider"></div>
      <main className="main-body">
        <div className="dashboard-top">
          <div className="top-right">
            <div className="icon"><Settings size={18} /></div>
            <div className="icon"><Bell size={18} /></div>
            <div className="profile">
              <span>David Muller</span>
              <img src="https://i.pravatar.cc/40" alt="" />
            </div>
          </div>
        </div>

        <div className="divider1"></div>

        <header className="dashboard-header">
          <h1>Welcome back, David!</h1>
          <p>
            Here’s what’s happening today,{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "2-digit",
              year: "numeric",
            })}
          </p>
        </header>

        <div className="stats-container">
          <div className="stat-card total">
            <h3>Total Projects</h3>
            <p>{total}</p>
          </div>

          <div className="stat-card active">
            <h3>Active Tasks</h3>
            <p>{active}</p>
          </div>

          <div className="stat-card completed">
            <h3>Completed Tasks</h3>
            <p>{completed}</p>
          </div>
        </div>

        <section className="upcoming-section">
          <h2>Upcoming Deadlines</h2>

          <div className="tasks-grid">
            {tasks.map((task) => (
              <div className="task-card" key={task.id}>
                <h3>{task.title}</h3>
                <p className="type">{task.type}</p>

                <p className="deadline">
                  Deadline: {new Date(task.deadline).toLocaleString()}
                </p>

                <div className="countdown">
                  ⏰ {countdowns[task.id] || "Loading..."}
                </div>

                <div className="progress-container">
                  <div className="progress-info">
                    <span>Progress</span>
                    <span>{task.completed}/{task.total}</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(task.completed / task.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>
      </main>

      <aside className="right-panel">
        <div className="widget-card">
          <h3>Recent Updates</h3>
          <ul>
            {notifications.map((n) => (
              <li key={n.id}>
                <p>{n.text}</p>
                <span>{n.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="widget-card1 stats-widget">
          <div className="stats-tabs">
            <span>Agenda</span>
            <span>Mentions <sup>69</sup></span>
            <button className="active">Statistics</button>
          </div>

          <div className="weekly-activity-card">
            <div className="activity-info">
              <h2>Weekly activity</h2>
              <p>58%</p>
            </div>
            <span className="percent">+7%</span>
          </div>

          <div className="total-progress-card">
            <div className="progress-info">
              <h2>Total progress</h2>
            </div>
            <span className="percent">+7%</span>
          </div>

          <div className="working-activities">
            <div className="header">
              <h4>Working activities</h4>
              <span className="month">June 2024</span>
            </div>

            <div className="days">
              {["Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                <div key={idx} className={`day ${day === "Fri" ? "active" : ""}`}>
                  <p>{day}</p>
                  <span>{12 + idx}</span>
                </div>
              ))}
            </div>

            <div className="chart">
              <div className="block block1"></div>
              <div className="block block2"></div>
              <div className="block block3"></div>
              <div className="block block4"></div>
              <div className="block block5"></div>
            </div>

            <p className="total-time">
              Total time: <b>24 hours</b>
            </p>
          </div>
        </div>

      </aside>

    </div>
  );
};

export default Dashboard;
