import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Settings, Bell, LogOut, Moon } from "lucide-react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlUser = params.get("user");

        // 1️⃣ Google callback user
        if (urlUser) {
          const decoded = JSON.parse(decodeURIComponent(urlUser));
          localStorage.setItem("user", JSON.stringify(decoded));
          localStorage.setItem("googleLogin", "true");
          setUser(decoded);
          return;
        }

        // 2️⃣ Previously logged with Google
        const googleFlag = localStorage.getItem("googleLogin");
        const savedUser = localStorage.getItem("user");

        if (googleFlag && savedUser) {
          setUser(JSON.parse(savedUser));
          return;
        }

        // 3️⃣ Normal JWT login
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await fetch("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return navigate("/login");

        const userData = await res.json();
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.clear();
    await fetch("http://localhost:3000/api/users/logout", { credentials: "include" });
    navigate("/login");
  };

  const [tasks] = useState([
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
    const calculate = () => {
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
    };

    calculate();
    const interval = setInterval(calculate, 60000);
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

            {/* THEME BUTTON */}
            <button
              className="icon icon-btn"
              onClick={toggleTheme}
              title="Toggle Dark Mode"
              style={{ color: darkMode ? "#009688" : "inherit" }}
            >
              <Moon size={20} fill={darkMode ? "currentColor" : "none"} />
            </button>

            {/* SETTINGS */}
            <button aria-label="Open settings" className="icon icon-btn" onClick={() => navigate('/settings')}>
              <Settings size={18} />
            </button>

            {/* NOTIFICATIONS */}
            <div className="icon"><Bell size={18} /></div>

            {/* PROFILE */}
            {user && (
              <div className="profile">

                {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" />
                ) : (
                  <div className="profile-initial">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                <span>{user?.name || user?.email}</span>

                <button className="logout-btn" onClick={handleLogout}>
                  <LogOut size={18} />
                </button>
              </div>
            )}

          </div>
        </div>

        <div className="divider1"></div>

        {/* HEADER */}
        <header className="dashboard-header">
          <h1>Welcome back, {user?.name?.split(" ")[0] || "there"}!</h1>
          <p>
            Here’s what’s happening today —{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "2-digit",
              year: "numeric",
            })}
          </p>
        </header>

        <div className="stats-container">
          <div className="stat-card total"><h3>Total Projects</h3><p>{total}</p></div>
          <div className="stat-card active"><h3>Active Tasks</h3><p>{active}</p></div>
          <div className="stat-card completed"><h3>Completed Tasks</h3><p>{completed}</p></div>
        </div>

        <section className="upcoming-section">
          <h2>Upcoming Deadlines</h2>

          <div className="tasks-grid">
            {tasks.map((task) => (
              <div className="task-card" key={task.id}>
                <h3>{task.title}</h3>
                <p className="type">{task.type}</p>
                <p className="deadline">Deadline: {new Date(task.deadline).toLocaleString()}</p>
                <div className="countdown">⏰ {countdowns[task.id] || "Loading..."}</div>

                <div className="progress-container">
                  <div className="progress-info">
                    <span>Progress</span>
                    <span>{task.completed}/{task.total}</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(task.completed / task.total) * 100}%` }}
                    />
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
      </aside>

    </div>
  );
};

export default Dashboard;
