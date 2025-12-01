import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Bell, LogOut, Upload, Shield, AlertTriangle, Lock } from "lucide-react";
import "../styles/UserSettings.css";

import "../styles/Dashboard.css";

const NOTIFICATION_OPTIONS = [
	{ key: "taskUpdate", label: "Task updates" },
	{ key: "deadlines", label: "Deadlines" },
	{ key: "comments", label: "Comments & mentions" },
	{ key: "status", label: "Project status changes" }
];

export default function SettingsPage() {
	const navigate = useNavigate();

	// Freeze user
	const userRef = useRef(JSON.parse(localStorage.getItem("user")));
	const user = userRef.current;

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		country: "",
		city: "",
		zipCode: "",
		profilePic: "",
	});

	const [notifications, setNotifications] = useState({
		taskUpdate: true,
		deadlines: true,
		comments: true,
		status: true
	});

	const [preferences, setPreferences] = useState({
		language: "English",
		timezone: "UTC-5",
		theme: "Default"
	});

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
	const fileInputRef = useRef(null);

	useEffect(() => {
		async function loadSettings() {
			if (!user?.id) return navigate("/login");

			const res = await fetch(`http://localhost:3000/api/settings/${user.id}`);
			const data = await res.json();

			if (!res.ok) return alert("Error loading settings");

			setFormData({
				name: data.name || "",
				email: data.email || "",
				phone: data.phone || "",
				country: data.country || "",
				city: data.city || "",
				zipCode: data.zipCode || "",
				profilePic: data.profilePic || "",
			});

			const defaultNotifications = {
				taskUpdate: true,
				deadlines: true,
				comments: true,
				status: true
			};

			// Merge backend data with defaults to ensure all keys exist
			setNotifications({ ...defaultNotifications, ...(data.notifications || {}) });
			setPreferences(data.preferences || {});
			setLoading(false);
		}

		loadSettings();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleNotificationChange = (key) => {
		setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => setFormData(prev => ({ ...prev, profilePic: reader.result }));
		reader.readAsDataURL(file);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);

		const res = await fetch(`http://localhost:3000/api/settings/${user.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				...formData,
				notifications,
				preferences,
			})
		});

		const data = await res.json();

		if (res.ok) {
			localStorage.setItem("user", JSON.stringify(data.user));
			alert("✅ Settings saved");
		} else {
			alert(data.message || "Failed to update");
		}

		setSaving(false);
	};

	const handlePasswordChange = async () => {
		if (passwordData.new !== passwordData.confirm) {
			alert("Passwords do not match");
			return;
		}

		await fetch(`http://localhost:3000/api/settings/${user.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password: passwordData.new })
		});

		setShowPasswordModal(false);
		setPasswordData({ current: "", new: "", confirm: "" });
		alert("Password updated");
	};

	const handleLogout = () => {
		localStorage.clear();
		navigate("/login");
	};

	return (
		<div className="dashboard-container">
			<Sidebar />

			<main
				style={{
					marginLeft: "300px",
					width: "calc(100vw - 300px)",
					flexGrow: 1,
					padding: "32px",
					boxSizing: "border-box",
					overflowY: "auto",
					height: "100vh"
				}}
			>
				<header className="dashboard-header"
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "30px",
					}}
				>
					<div>
						<h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Settings</h1>
						<p style={{ color: "#666" }}>Manage your account settings</p>
					</div>
					<button className="btn secondary" onClick={handleLogout}>
						<LogOut size={16} /> Sign Out
					</button>
				</header>

				{/* 🔥 MAIN PROFILE CARD */}
				<section className="settings-card" style={{ marginBottom: "32px" }}>
					<div className="settings-inner">

						{/* LEFT — AVATAR */}
						<div className="settings-avatar-col">
							<div
								className="settings-avatar-wrapper"
								onClick={() => fileInputRef.current.click()}
							>
								<div className="settings-avatar">
									{formData.profilePic ? (
										<img src={formData.profilePic} alt="Profile" />
									) : (
										formData.name.charAt(0).toUpperCase()
									)}
								</div>
								<div className="settings-avatar-overlay">
									<Upload size={22} />
								</div>
							</div>

							<label className="upload-label" onClick={() => fileInputRef.current.click()}>
								Change Photo
							</label>

							<input
								type="file"
								ref={fileInputRef}
								hidden
								accept="image/*"
								onChange={handleFileChange}
							/>
						</div>

						{/* RIGHT — FORM */}
						<form className="settings-form" onSubmit={handleSubmit}>
							<div className="settings-grid">

								<label>
									Full Name
									<input name="name" value={formData.name} onChange={handleChange} />
								</label>

								<label>
									Email Address
									<input name="email" value={formData.email} readOnly />
								</label>

								<label>
									Phone Number
									<input name="phone" value={formData.phone} onChange={handleChange} />
								</label>

								<label>
									Country
									<input name="country" value={formData.country} onChange={handleChange} />
								</label>

								<label>
									City
									<input name="city" value={formData.city} onChange={handleChange} />
								</label>

								<label>
									Zip Code
									<input name="zipCode" value={formData.zipCode} onChange={handleChange} />
								</label>


								<label>
									Role
									<div className="readonly-badge">Admin</div>
								</label>

							</div>

							<div className="settings-actions">
								<button className="btn primary" disabled={saving}>
									{saving ? "Saving..." : "Save Changes"}
								</button>
							</div>
						</form>
					</div>
				</section>

				{/* 🔥 LOWER GRID: Notifications / Security / Danger Zone */}
				<div className="settings-section-grid" style={{ gridTemplateColumns: "1fr" }}>

					<section className="settings-sub-card">
						<h3><Bell size={18} /> Notifications</h3>
						{NOTIFICATION_OPTIONS.map(({ key, label }) => (
							<div key={key} className="notification-item">
								<span>{label}</span>
								<label className="toggle-switch">
									<input
										type="checkbox"
										checked={!!notifications[key]}
										onChange={() => handleNotificationChange(key)}
									/>
									<span className="slider"></span>
								</label>
							</div>
						))}
					</section>



					{/* Account Security */}
					<section className="settings-sub-card" style={{ width: '100%', boxSizing: 'border-box' }}>
						<h3><Shield size={18} style={{ marginRight: 8, display: 'inline' }} /> Account Security</h3>
						<div style={{ marginTop: 12 }}>

							<div className="notification-item" style={{ cursor: 'pointer' }} onClick={() => setShowPasswordModal(true)}>
								<span>Change Password</span>
								<Lock size={16} color="#666" />
							</div>
							<div className="notification-item" style={{ cursor: 'pointer' }} onClick={handleLogout}>
								<span>Logout from all devices</span>
								<LogOut size={16} color="#666" />
							</div>
						</div>
					</section>

					{/* Danger Zone */}
					<section className="settings-sub-card danger-zone" style={{ width: '100%', gridColumn: 'span 2', boxSizing: 'border-box' }}>
						<h3><AlertTriangle size={18} style={{ marginRight: 8, display: 'inline' }} /> Danger Zone</h3>
						<div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<div>
								<p style={{ fontWeight: 500, color: '#333' }}>Delete Account</p>
								<p style={{ fontSize: 13, color: '#666' }}>Permanently delete your account and all data.</p>
							</div>
							<button className="btn danger" onClick={() => alert("This action cannot be undone.")}>Delete Account</button>
						</div>
					</section>

				</div>

				{/* PASSWORD MODAL */}
				{
					showPasswordModal && (
						<div className="modal-overlay">
							<div className="modal-content">

								<input
									type="password"
									placeholder="New Password"
									value={passwordData.new}
									onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
								/>

								<input
									type="password"
									placeholder="Confirm Password"
									value={passwordData.confirm}
									onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
								/>

								<button onClick={handlePasswordChange}>Update</button>
								<button onClick={() => setShowPasswordModal(false)}>Cancel</button>

							</div>
						</div>
					)
				}

			</main >
		</div >
	);
}