import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Settings, Bell, LogOut } from "lucide-react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlUser = params.get("user");

        // 1️⃣ When coming from Google callback
        if (urlUser) {
          const decoded = JSON.parse(decodeURIComponent(urlUser));
          localStorage.setItem("user", JSON.stringify(decoded));
          localStorage.setItem("googleLogin", "true");
          setUser(decoded);
          return;
        }

        // 2️⃣ If user previously logged in with Google
        const googleFlag = localStorage.getItem("googleLogin");
        const savedUser = localStorage.getItem("user");

        if (googleFlag && savedUser) {
          setUser(JSON.parse(savedUser));
          return;
        }

        // 3️⃣ Manual login using token
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
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    await fetch("http://localhost:3000/api/users/logout", { credentials: "include" });

    navigate("/login");
  };

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

  // Timer logic
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
      {/* LEFT SIDEBAR */}
      <Sidebar />

      <div className="divider"></div>

      {/* MAIN BODY */}
      <main className="main-body">
        <div className="dashboard-top">
          <div className="top-right">
            <button aria-label="Open settings" className="icon icon-btn" onClick={() => navigate('/settings')}>
              <Settings size={18} />
            </button>
            <div className="icon"><Bell size={18} /></div>

            {/* USER PROFILE + LOGOUT */}
            {user && (
              <div className="profile">
                {/* Profile Picture Priority: Google Pic → First Letter */}
                {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" />
                ) : (
                  <div className="profile-initial">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <span>{user.name || user.email}</span>

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
                    ></div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>
      </main>

      {/* RIGHT SIDEBAR */}
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
            <h2>Total progress</h2>
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