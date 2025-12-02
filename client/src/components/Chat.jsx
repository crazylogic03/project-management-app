import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Sidebar from "./Sidebar";
import "../styles/Chat.css";
import { Send, Search, Edit, Phone, Video, MoreVertical, Paperclip, Smile, Mic } from "lucide-react";

const socket = io("http://localhost:3000");

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activeChat, setActiveChat] = useState({ type: 'global', id: 'global', name: 'Global Team Chat' });
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {
        // Fetch users
        fetch("http://localhost:3000/api/users")
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error("Error loading users:", err));

        // Fetch projects
        fetch("http://localhost:3000/api/boards")
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error("Error loading projects:", err));
    }, []);

    useEffect(() => {
        if (!user) return;

        // Load messages for active chat
        let url = "http://localhost:3000/api/messages";
        if (activeChat.type === 'project') {
            url += `?projectId=${activeChat.id}`;
        } else if (activeChat.type === 'user') {
            url += `?recipientId=${activeChat.id}&userId=${user.id}`;
        } else {
            url += `?projectId=global`;
        }

        fetch(url)
            .then((res) => res.json())
            .then((data) => setMessages(data))
            .catch((err) => console.error("Error loading messages:", err));

        // Join room
        if (activeChat.type === 'project') {
            socket.emit("join-project", activeChat.id);
        } else if (activeChat.type === 'user') {
            socket.emit("join-user", user.id); // Ensure I am in my own room to receive DMs
        } else {
            socket.emit("join-project", "global");
        }

    }, [activeChat, user]);

    useEffect(() => {
        socket.on("receive-message", (message) => {
            // Only add message if it belongs to current chat
            if (activeChat.type === 'project' && message.projectId === activeChat.id) {
                setMessages((prev) => [...prev, message]);
            } else if (activeChat.type === 'user' && (message.userId === activeChat.id || message.recipientId === activeChat.id)) {
                setMessages((prev) => [...prev, message]);
            } else if (activeChat.type === 'global' && !message.projectId && !message.recipientId) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            socket.off("receive-message");
        };
    }, [activeChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const messageData = {
            userId: user.id,
            messageText: newMessage,
        };

        if (activeChat.type === 'project') {
            messageData.projectId = activeChat.id;
        } else if (activeChat.type === 'user') {
            messageData.recipientId = activeChat.id;
        } else {
            messageData.projectId = "global";
        }

        socket.emit("send-message", messageData);
        setNewMessage("");
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="chat-layout">

                {/* LEFT SIDEBAR - MESSAGES LIST */}
                <div className="chat-sidebar">
                    <div className="chat-sidebar-header">
                        <h2>Messages</h2>
                        <div className="chat-sidebar-actions">
                            <button className="icon-btn"><Edit size={18} /></button>
                            <button className="icon-btn"><Search size={18} /></button>
                        </div>
                    </div>

                    <div className="chat-search">
                        <Search size={16} className="search-icon" />
                        <input type="text" placeholder="Search..." />
                    </div>

                    <div className="chat-list-section">
                        <h3>Projects</h3>
                        <div className="chat-list">
                            <div
                                className={`chat-item ${activeChat.type === 'global' ? 'active' : ''}`}
                                onClick={() => setActiveChat({ type: 'global', id: 'global', name: 'Global Team Chat' })}
                            >
                                <div className="chat-item-avatar">
                                    <div className="avatar-circle">G</div>
                                </div>
                                <div className="chat-item-info">
                                    <span className="chat-item-name">Global Chat</span>
                                </div>
                            </div>
                            {projects.map(p => (
                                <div
                                    key={`project-${p.id}`}
                                    className={`chat-item ${activeChat.type === 'project' && activeChat.id === p.id ? 'active' : ''}`}
                                    onClick={() => setActiveChat({ type: 'project', id: p.id, name: p.title })}
                                >
                                    <div className="chat-item-avatar">
                                        <div className="avatar-circle">{p.title.charAt(0).toUpperCase()}</div>
                                    </div>
                                    <div className="chat-item-info">
                                        <span className="chat-item-name">{p.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="chat-list-section">
                        <h3>Direct Messages</h3>
                        <div className="chat-list">
                            {users.filter(u => u.id !== user?.id).map(u => (
                                <div
                                    key={`user-${u.id}`}
                                    className={`chat-item ${activeChat.type === 'user' && activeChat.id === u.id ? 'active' : ''}`}
                                    onClick={() => setActiveChat({ type: 'user', id: u.id, name: u.name })}
                                >
                                    <div className="chat-item-avatar">
                                        {u.profilePic ? <img src={u.profilePic} alt={u.name} /> : u.name.charAt(0).toUpperCase()}
                                        <span className="status-dot online"></span>
                                    </div>
                                    <div className="chat-item-info">
                                        <div className="chat-item-top">
                                            <span className="chat-item-name">{u.name}</span>
                                        </div>
                                        <div className="chat-item-bottom">
                                            <span className="chat-item-preview">Click to chat</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - CHAT WINDOW */}
                <div className="chat-main">
                    <header className="chat-main-header">
                        <div className="chat-header-user">
                            <div className="chat-header-avatar">
                                <div className="avatar-circle">{activeChat.name.charAt(0).toUpperCase()}</div>
                            </div>
                            <div className="chat-header-info">
                                <h3>{activeChat.name}</h3>
                                <span className="status-text">Online</span>
                            </div>
                        </div>
                        <div className="chat-header-actions">
                            <button className="icon-btn"><Search size={20} /></button>
                            <button className="icon-btn"><MoreVertical size={20} /></button>
                        </div>
                    </header>

                    <div className="chat-content">
                        <div className="date-separator">
                            <span>Today</span>
                        </div>

                        {messages.map((msg, index) => {
                            const isMe = user && msg.userId === user.id;
                            return (
                                <div key={index} className={`chat-bubble-row ${isMe ? "me" : "other"}`}>
                                    {!isMe && (
                                        <div className="chat-bubble-avatar">
                                            {msg.user?.profilePic ? <img src={msg.user.profilePic} alt={msg.user.name} /> : (msg.user?.name?.charAt(0).toUpperCase() || "?")}
                                        </div>
                                    )}
                                    <div className="chat-bubble-content">
                                        {!isMe && <span className="sender-name">{msg.user?.name}</span>}
                                        <div className="chat-bubble">
                                            {msg.content}
                                        </div>
                                        <span className="chat-time">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-wrapper">
                        <button className="icon-btn"><Paperclip size={20} /></button>
                        <form className="chat-input-form" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="button" className="icon-btn"><Smile size={20} /></button>
                        </form>
                        <button className="send-btn" onClick={handleSendMessage}>
                            {newMessage.trim() ? <Send size={18} /> : <Mic size={20} />}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
