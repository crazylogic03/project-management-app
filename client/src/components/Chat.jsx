import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Sidebar from "./Sidebar";
import "../styles/Chat.css";
import { Send, Search, Edit, Phone, Video, MoreVertical, Paperclip, Smile, Mic } from "lucide-react";

// Initialize socket outside component to prevent multiple connections
const socket = io("https://project-management-app-89n4.onrender.com");

const Chat = () => {
    const [activeChat, setActiveChat] = useState({ type: 'global', id: 'global', name: 'Global Team Chat' });
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState(null); // Current user
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Fetch current user (mock or from local storage/context)
    useEffect(() => {
        // In a real app, this would come from auth context
        // For now, fetching the first user as "me" or using a hardcoded ID
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        } else {
            // Fallback or redirect to login
        }
    }, []);

    useEffect(() => {
        // Fetch users
        fetch("https://project-management-app-89n4.onrender.com/api/users")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.error("Expected users to be an array, got:", data);
                    setUsers([]);
                }
            })
            .catch((err) => console.error("Error loading users:", err));

        // Fetch projects
        fetch("https://project-management-app-89n4.onrender.com/api/boards")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProjects(data);
                } else {
                    console.error("Expected projects to be an array, got:", data);
                    setProjects([]);
                }
            })
            .catch((err) => console.error("Error loading projects:", err));
    }, []);

    useEffect(() => {
        if (!user) return;

        // Load messages for active chat
        let url = "https://project-management-app-89n4.onrender.com/api/messages";
        if (activeChat.type === 'project') {
            url += `?projectId=${activeChat.id}`;
        } else if (activeChat.type === 'user') {
            url += `?recipientId=${activeChat.id}&userId=${user.id}`;
        } else {
            url += `?projectId=global`;
        }

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setMessages(data);
                } else {
                    console.error("Expected messages to be an array, got:", data);
                    setMessages([]);
                }
            })
            .catch((err) => console.error("Error loading messages:", err));

        // Join room
        if (activeChat.type === 'project') {
            socket.emit("join-room", activeChat.id);
        } else if (activeChat.type === 'user') {
            socket.emit("join-room", `user-${user.id}`);
        } else {
            socket.emit("join-room", "global");
        }

        const handleReceiveMessage = (message) => {
            // Filter messages based on active chat
            if (activeChat.type === 'project' && message.projectId === activeChat.id) {
                setMessages((prev) => [...prev, message]);
            } else if (activeChat.type === 'user' && (message.userId === activeChat.id || message.recipientId === activeChat.id)) {
                setMessages((prev) => [...prev, message]);
            } else if (activeChat.type === 'global' && !message.projectId && !message.recipientId) {
                setMessages((prev) => [...prev, message]);
            }
        };

        socket.on("receive-message", handleReceiveMessage);

        return () => {
            socket.off("receive-message", handleReceiveMessage);
        };
    }, [activeChat, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if ((!newMessage.trim()) || !user) return;

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

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const messageData = {
                userId: user.id,
                messageText: "", // Optional text with file
                attachmentUrl: reader.result,
                fileName: file.name,
                fileType: file.type
            };

            if (activeChat.type === 'project') {
                messageData.projectId = activeChat.id;
            } else if (activeChat.type === 'user') {
                messageData.recipientId = activeChat.id;
            } else {
                messageData.projectId = "global";
            }

            socket.emit("send-message", messageData);
        };
    };

    return (
        <div>
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
                            {Array.isArray(projects) && projects.map(p => (
                                <div
                                    key={`project-${p.id}`}
                                    className={`chat-item ${activeChat.type === 'project' && activeChat.id === p.id ? 'active' : ''}`}
                                    onClick={() => setActiveChat({ type: 'project', id: p.id, name: p.title })}
                                >
                                    <div className="chat-item-avatar">
                                        <div className="avatar-circle">{p.title?.charAt(0).toUpperCase()}</div>
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
                            {Array.isArray(users) && users.filter(u => u.id !== user?.id).map(u => (
                                <div
                                    key={`user-${u.id}`}
                                    className={`chat-item ${activeChat.type === 'user' && activeChat.id === u.id ? 'active' : ''}`}
                                    onClick={() => setActiveChat({ type: 'user', id: u.id, name: u.name })}
                                >
                                    <div className="chat-item-avatar">
                                        {u.profilePic ? <img src={u.profilePic} alt={u.name} /> : u.name?.charAt(0).toUpperCase()}
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
                                <div className="avatar-circle">{activeChat.name?.charAt(0).toUpperCase()}</div>
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

                        {Array.isArray(messages) && messages.map((msg, index) => {
                            if (!msg) return null;
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
                                            {msg.attachmentUrl && (
                                                <div className="chat-attachment">
                                                    {typeof msg.fileType === 'string' && msg.fileType.startsWith("image/") ? (
                                                        <img src={msg.attachmentUrl} alt="attachment" className="chat-image-preview" style={{ maxWidth: "200px", borderRadius: "8px", marginBottom: "5px" }} />
                                                    ) : (
                                                        <a href={msg.attachmentUrl} download={msg.fileName || "attachment"} className="chat-file-link" style={{ color: "white", textDecoration: "underline" }}>
                                                            📎 {msg.fileName || "Attachment"}
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                            {msg.content}
                                        </div>
                                        <span className="chat-time">
                                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-wrapper">
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileUpload}
                        />
                        <button className="icon-btn" onClick={() => fileInputRef.current.click()}>
                            <Paperclip size={20} />
                        </button>
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
};

export default Chat;
