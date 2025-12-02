import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "../styles/Reports.css";
import { BarChart3, PieChart, TrendingUp, CheckCircle, AlertCircle, Clock } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from "recharts";

const Reports = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        todo: 0,
        overdue: 0
    });
    const [chartData, setChartData] = useState({
        status: [],
        priority: [],
        activity: []
    });

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    const PRIORITY_COLORS = {
        High: "#ef4444",
        Medium: "#f59e0b",
        Low: "#10b981"
    };

    useEffect(() => {
        // Fetch all projects
        fetch("http://localhost:3000/api/boards")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProjects(data);
                    if (data.length > 0) {
                        fetchProjectDetails(data[0].id);
                    }
                }
            })
            .catch(err => console.error("Error fetching projects:", err));
    }, []);

    const fetchProjectDetails = (projectId) => {
        fetch(`http://localhost:3000/api/boards/${projectId}`)
            .then(res => res.json())
            .then(data => {
                setSelectedProject(data);
                calculateStats(data);
            })
            .catch(err => console.error("Error fetching project details:", err));
    };

    const calculateStats = (project) => {
        if (!project || !project.lists) return;

        let total = 0;
        let completed = 0;
        let inProgress = 0;
        let todo = 0;
        let overdue = 0;
        const priorityCounts = { High: 0, Medium: 0, Low: 0, None: 0 };
        const now = new Date();

        project.lists.forEach(list => {
            list.cards.forEach(card => {
                total++;
                if (list.title.toLowerCase().includes("done") || card.completed) {
                    completed++;
                } else if (list.title.toLowerCase().includes("progress")) {
                    inProgress++;
                } else {
                    todo++;
                }

                if (card.dueDate && new Date(card.dueDate) < now && !card.completed) {
                    overdue++;
                }

                const priority = card.priority || "None";
                if (priorityCounts[priority] !== undefined) {
                    priorityCounts[priority]++;
                } else {
                    priorityCounts.None++;
                }
            });
        });

        setStats({ total, completed, inProgress, todo, overdue });

        // Prepare Chart Data
        setChartData({
            status: [
                { name: "To Do", value: todo },
                { name: "In Progress", value: inProgress },
                { name: "Done", value: completed }
            ],
            priority: [
                { name: "High", value: priorityCounts.High },
                { name: "Medium", value: priorityCounts.Medium },
                { name: "Low", value: priorityCounts.Low }
            ],
            // Mock activity data for now as real activity history might be complex to aggregate quickly
            activity: [
                { name: "Mon", tasks: Math.floor(Math.random() * 5) },
                { name: "Tue", tasks: Math.floor(Math.random() * 8) },
                { name: "Wed", tasks: Math.floor(Math.random() * 6) },
                { name: "Thu", tasks: Math.floor(Math.random() * 10) },
                { name: "Fri", tasks: Math.floor(Math.random() * 7) },
                { name: "Sat", tasks: Math.floor(Math.random() * 3) },
                { name: "Sun", tasks: Math.floor(Math.random() * 2) }
            ]
        });
    };

    return (
        <div className="reports-container">
            <Sidebar />

            {/* Left Sidebar - Project List */}
            <div className="reports-sidebar">
                <h2>Projects</h2>
                <div className="project-list">
                    {projects.map(project => (
                        <div
                            key={project.id}
                            className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
                            onClick={() => fetchProjectDetails(project.id)}
                        >
                            <div className="project-avatar">
                                {project.title.charAt(0).toUpperCase()}
                            </div>
                            <div className="project-info">
                                <span className="project-name">{project.title}</span>
                                <span className="project-meta">{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="reports-main">
                {selectedProject ? (
                    <>
                        <div className="reports-header">
                            <h1>{selectedProject.title} Analytics</h1>
                            <p>Overview of project performance and task statistics.</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="stats-grid">
                            <div className="report-stat-card">
                                <span className="stat-label">Total Tasks</span>
                                <span className="stat-value">{stats.total}</span>
                                <span className="stat-trend neutral"><BarChart3 size={14} /> All time</span>
                            </div>
                            <div className="report-stat-card">
                                <span className="stat-label">Completed</span>
                                <span className="stat-value">{stats.completed}</span>
                                <span className="stat-trend positive"><CheckCircle size={14} /> {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion</span>
                            </div>
                            <div className="report-stat-card">
                                <span className="stat-label">In Progress</span>
                                <span className="stat-value">{stats.inProgress}</span>
                                <span className="stat-trend neutral"><Clock size={14} /> Active tasks</span>
                            </div>
                            <div className="report-stat-card">
                                <span className="stat-label">Overdue</span>
                                <span className="stat-value" style={{ color: stats.overdue > 0 ? '#e74c3c' : '#333' }}>{stats.overdue}</span>
                                <span className="stat-trend negative"><AlertCircle size={14} /> Needs attention</span>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="charts-container">
                            {/* Status Distribution */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>Task Status</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RePieChart>
                                        <Pie
                                            data={chartData.status}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.status.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Priority Breakdown */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>Tasks by Priority</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData.priority}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#8884d8">
                                            {chartData.priority.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || "#8884d8"} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Activity Streak */}
                            <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
                                <div className="chart-header">
                                    <h3>Activity Streak (Last 7 Days)</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData.activity}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="tasks" stroke="#00b9b9" strokeWidth={3} dot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="no-selection">
                        <BarChart3 size={48} />
                        <p>Select a project to view analytics</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
