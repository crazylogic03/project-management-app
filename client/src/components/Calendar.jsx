import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { ChevronLeft, ChevronRight, Plus, X, Clock, Calendar as CalIcon, Bell } from "lucide-react";
import "../styles/Calendar.css";
import "../styles/Dashboard.css";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState("month"); // month, week, day, agenda
    const [events, setEvents] = useState(() => {
        const saved = localStorage.getItem("calendarEvents");
        return saved ? JSON.parse(saved) : [
            { id: 1, title: "Design Landing Page", date: "2025-10-30", type: "task", time: "10:00", priority: "High", project: "Website Redesign" },
            { id: 2, title: "Client Meeting", date: "2025-10-28", type: "meeting", time: "14:00", priority: "Medium", project: "Consulting" },
        ];
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: "",
        type: "task",
        date: "",
        time: "",
        description: "",
        project: "",
        assignee: "",
        priority: "Medium",
        reminder: "15" // minutes before
    });

    // Save events to localStorage
    useEffect(() => {
        localStorage.setItem("calendarEvents", JSON.stringify(events));
    }, [events]);

    // Request Notification Permission
    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // Notification Scheduler
    useEffect(() => {
        const checkNotifications = () => {
            const now = new Date();
            events.forEach(event => {
                if (!event.date || !event.time || event.notified) return;

                const eventTime = new Date(`${event.date}T${event.time}`);
                const reminderTime = new Date(eventTime.getTime() - (parseInt(event.reminder || 0) * 60000));

                if (now >= reminderTime && now < eventTime) {
                    // Trigger Notification
                    if (Notification.permission === "granted") {
                        new Notification(`Upcoming: ${event.title}`, {
                            body: `Due at ${event.time}. Priority: ${event.priority}`,
                            icon: "/vite.svg" // Placeholder icon
                        });
                    }

                    // Mark as notified to prevent duplicate alerts
                    const updatedEvents = events.map(e => e.id === event.id ? { ...e, notified: true } : e);
                    setEvents(updatedEvents);
                }
            });
        };

        const interval = setInterval(checkNotifications, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [events]);

    // Helper to get days in month
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (dateStr) => {
        setSelectedDate(dateStr);
        setNewEvent({ ...newEvent, date: dateStr });
        setShowModal(true);
    };

    const handleAddEvent = (e) => {
        e.preventDefault();
        const event = {
            id: Date.now(),
            ...newEvent,
            notified: false
        };
        setEvents([...events, event]);
        setShowModal(false);
        setNewEvent({
            title: "", type: "task", date: "", time: "", description: "",
            project: "", assignee: "", priority: "Medium", reminder: "15"
        });
    };

    const handleDragStart = (e, eventId) => {
        e.dataTransfer.setData("eventId", eventId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, dateStr) => {
        e.preventDefault();
        const eventId = parseInt(e.dataTransfer.getData("eventId"));
        const updatedEvents = events.map(ev => {
            if (ev.id === eventId) {
                return { ...ev, date: dateStr, notified: false }; // Reset notification on move
            }
            return ev;
        });
        setEvents(updatedEvents);
    };

    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const gridDays = [];

        // Previous month days
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const date = new Date(year, month - 1, day);
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            gridDays.push({ day, dateStr, isCurrentMonth: false });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            gridDays.push({ day: i, dateStr, isCurrentMonth: true });
        }

        // Next month days to fill 42 cells
        const remainingCells = 42 - gridDays.length;
        for (let i = 1; i <= remainingCells; i++) {
            const date = new Date(year, month + 1, i);
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            gridDays.push({ day: i, dateStr, isCurrentMonth: false });
        }

        const grid = [];

        // Weekday headers
        const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        weekDays.forEach(day => {
            grid.push(<div key={`header-${day}`} className="calendar-day-header">{day}</div>);
        });

        // Render grid cells
        gridDays.forEach((cell, index) => {
            const dayEvents = events.filter(e => e.date === cell.dateStr);
            const isToday = cell.dateStr === new Date().toISOString().split('T')[0];

            grid.push(
                <div
                    key={index}
                    className={`calendar-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDateClick(cell.dateStr)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, cell.dateStr)}
                >
                    <span className="day-number">{cell.day}</span>
                    <div className="day-events">
                        {dayEvents.map(ev => (
                            <div
                                key={ev.id}
                                className={`event-item event-${ev.type}`}
                                title={`${ev.title} (${ev.time}) - ${ev.priority}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, ev.id)}
                            >
                                <span className={`event-dot dot-${ev.type}`}></span>
                                {ev.time && <span className="event-time">{ev.time}</span>}
                                {ev.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        });

        return grid;
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-body" style={{ width: '100vw', paddingLeft: '330px', paddingRight: '30px', paddingTop: '30px', paddingBottom: '30px', marginLeft: 0, boxSizing: 'border-box', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="calendar-page">

                    {/* Header */}
                    <div className="calendar-header">
                        <div className="calendar-title">
                            <h2>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                        </div>

                        <div className="calendar-controls">


                            <button className="nav-btn" onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
                            <button className="nav-btn" onClick={handleNextMonth}><ChevronRight size={20} /></button>

                            <button className="btn primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Plus size={18} /> Add Event
                            </button>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="calendar-grid">
                        {renderMonthView()}
                    </div>

                </div>
            </main>

            {/* Add Event Modal */}
            {showModal && (
                <div className="calendar-modal-overlay">
                    <div className="calendar-modal">
                        <div className="modal-header">
                            <h3>Add New Event</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form className="modal-form" onSubmit={handleAddEvent}>
                            <div className="form-group">
                                <label>Event Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                    required
                                    placeholder="e.g., Team Meeting"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type</label>
                                    <select
                                        className="form-select"
                                        value={newEvent.type}
                                        onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                    >
                                        <option value="task">Task</option>
                                        <option value="deadline">Deadline</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="milestone">Milestone</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select
                                        className="form-select"
                                        value={newEvent.priority}
                                        onChange={e => setNewEvent({ ...newEvent, priority: e.target.value })}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={newEvent.date}
                                        onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Time</label>
                                    <input
                                        type="time"
                                        className="form-input"
                                        value={newEvent.time}
                                        onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Project</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newEvent.project}
                                        onChange={e => setNewEvent({ ...newEvent, project: e.target.value })}
                                        placeholder="Project Name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Assign To</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newEvent.assignee}
                                        onChange={e => setNewEvent({ ...newEvent, assignee: e.target.value })}
                                        placeholder="User Name"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Reminder</label>
                                <select
                                    className="form-select"
                                    value={newEvent.reminder}
                                    onChange={e => setNewEvent({ ...newEvent, reminder: e.target.value })}
                                >
                                    <option value="0">At time of event</option>
                                    <option value="15">15 minutes before</option>
                                    <option value="60">1 hour before</option>
                                    <option value="1440">1 day before</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={newEvent.description}
                                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                    placeholder="Add details..."
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn primary">Save Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
