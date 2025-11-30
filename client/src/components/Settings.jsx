import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Bell, LogOut, Upload, Shield, Database, AlertTriangle, Moon, Globe, Clock, Lock, Trash2, LogOut as LogoutIcon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "../styles/UserSettings.css";
import "../styles/Dashboard.css";

export default function SettingsPage() {
	const navigate = useNavigate();
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
		timezone: "UTC-5"
	});

	const { darkMode, toggleTheme } = useTheme();

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
	const fileInputRef = useRef(null);

	// Fetch user data on mount
	React.useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) return;

				const res = await fetch("http://localhost:3000/api/users/me", {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (res.ok) {
					const data = await res.json();
					setFormData({
						name: data.name || "",
						email: data.email || "",
						phone: data.phone || "",
						country: data.country || "",
						city: data.city || "",
						zipCode: data.zipCode || "",
						profilePic: data.profilePic || "",
					});
					if (data.notifications) setNotifications(data.notifications);
					if (data.preferences) setPreferences(prev => ({ ...prev, ...data.preferences }));
				}
			} catch (err) {
				console.error("Failed to fetch user", err);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleNotificationChange = (key) => {
		setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
	};

	const handlePreferenceChange = (e) => {
		const { name, value, type, checked } = e.target;
		setPreferences(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 2 * 1024 * 1024) {
				alert("File size must be less than 2MB");
				return;
			}
			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData(prev => ({ ...prev, profilePic: reader.result }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			const token = localStorage.getItem("token");
			const res = await fetch("http://localhost:3000/api/users/me", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					...formData,
					notifications,
					preferences
				}),
			});

			if (res.ok) {
				alert("Settings saved successfully!");
			} else {
				alert("Failed to save settings.");
			}
		} catch (err) {
			console.error("Error saving settings", err);
			alert("Error saving settings.");
		} finally {
			setSaving(false);
		}
	};

	const handlePasswordChange = async () => {
		if (passwordData.new !== passwordData.confirm) {
			alert("Passwords do not match");
			return;
		}
		// In a real app, you'd verify 'current' password on backend
		try {
			const token = localStorage.getItem("token");
			const res = await fetch("http://localhost:3000/api/users/me", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ password: passwordData.new }),
			});
			if (res.ok) {
				alert("Password updated successfully");
				setShowPasswordModal(false);
				setPasswordData({ current: "", new: "", confirm: "" });
			} else {
				alert("Failed to update password");
			}
		} catch (err) {
			console.error(err);
			alert("Error updating password");
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	// Apply dark mode - REMOVED (Handled globally now)
	// React.useEffect(() => {
	// 	if (preferences.darkMode) {
	// 		document.body.classList.add('dark-mode');
	// 	} else {
	// 		document.body.classList.remove('dark-mode');
	// 	}
	// }, [preferences.darkMode]);

	return (
		<div className="dashboard-container">
			<Sidebar />

			<main className="main-body" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', padding: '32px', boxSizing: 'border-box' }}>

				<header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', width: '100%' }}>
					<div>
						<h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Settings</h1>
						<p style={{ color: '#666' }}>Manage your account settings and preferences.</p>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
						<button onClick={handleLogout} className="btn secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
							<LogOut size={16} /> Sign Out
						</button>
					</div>
				</header>

				<section className="settings-card" style={{ width: '100%', marginBottom: '32px', boxSizing: 'border-box' }}>
					<div className="settings-inner">
						<div className="settings-avatar-col">
							<div className="settings-avatar-wrapper" onClick={() => fileInputRef.current.click()}>
								<div className="settings-avatar">
									{formData.profilePic ? (
										<img src={formData.profilePic} alt="Profile" />
									) : (
										formData.name.charAt(0).toUpperCase()
									)}
								</div>
								<div className="settings-avatar-overlay">
									<Upload size={24} />
								</div>
							</div>
							<label className="upload-label" onClick={() => fileInputRef.current.click()}>
								Change Photo
							</label>
							<input
								type="file"
								ref={fileInputRef}
								className="upload-input"
								accept="image/*"
								onChange={handleFileChange}
							/>
						</div>

						<form className="settings-form" onSubmit={handleSubmit}>
							<div className="settings-grid">
								<label>
									Full Name
									<input
										name="name"
										value={formData.name}
										onChange={handleChange}
										className="settings-input"
									/>
								</label>
								<label>
									Email Address
									<input
										name="email"
										value={formData.email}

										className="settings-input"
										title="Email cannot be changed"
									/>
								</label>
								<label>
									Phone Number
									<input
										name="phone"
										value={formData.phone}
										onChange={handleChange}
										className="settings-input"
										placeholder="+91 0000 0000 00"
									/>
								</label>
								<label>
									Country
									<input
										name="country"
										value={formData.country}
										onChange={handleChange}
										className="settings-input"
										placeholder="India"
									/>
								</label>
								<label>
									City
									<input
										name="city"
										value={formData.city}
										onChange={handleChange}
										className="settings-input"
										placeholder="Bangalore"
									/>
								</label>
								<label>
									Zip Code
									<input
										name="zipCode"
										value={formData.zipCode}
										onChange={handleChange}
										className="settings-input"
										placeholder="515001"
									/>
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

				<div className="settings-section-grid" style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', boxSizing: 'border-box' }}>

					{/* Notifications */}
					<section className="settings-sub-card" style={{ width: '100%', boxSizing: 'border-box' }}>
						<h3><Bell size={18} style={{ marginRight: 8, display: 'inline' }} /> Notifications</h3>
						<div style={{ marginTop: 12 }}>
							{[
								['Task updates', 'taskUpdate'],
								['Deadlines', 'deadlines'],
								['Comments & mentions', 'comments'],
								['Project status changes', 'status']
							].map(([label, key]) => (
								<div key={key} className="notification-item">
									<span>{label}</span>
									<label className="toggle-switch">
										<input
											type="checkbox"
											checked={notifications[key]}
											onChange={() => handleNotificationChange(key)}
										/>
										<span className="slider"></span>
									</label>
								</div>
							))}
						</div>
					</section>

					{/* Appearance */}
					<section className="settings-sub-card" style={{ width: '100%', boxSizing: 'border-box' }}>
						<h3>
							{darkMode ? <Moon size={18} style={{ marginRight: 8, display: 'inline' }} /> : <Sun size={18} style={{ marginRight: 8, display: 'inline' }} />}
							Appearance
						</h3>
						<div style={{ marginTop: 12 }}>
							<div className="notification-item">
								<span>Dark Mode</span>
								<label className="toggle-switch">
									<input
										type="checkbox"
										checked={darkMode}
										onChange={toggleTheme}
									/>
									<span className="slider"></span>
								</label>
							</div>
						</div>
					</section>

					{/* Account Security */}
					<section className="settings-sub-card" style={{ width: '100%', boxSizing: 'border-box' }}>
						<h3><Shield size={18} style={{ marginRight: 8, display: 'inline' }} /> Account Security</h3>
						<div style={{ marginTop: 12 }}>
							<div className="notification-item">
								<span>Two-factor authentication</span>
								<label className="toggle-switch">
									<input type="checkbox" disabled />
									<span className="slider"></span>
								</label>
							</div>
							<div className="notification-item" style={{ cursor: 'pointer' }} onClick={() => setShowPasswordModal(true)}>
								<span>Change Password</span>
								<Lock size={16} color="#666" />
							</div>
							<div className="notification-item" style={{ cursor: 'pointer' }} onClick={handleLogout}>
								<span>Logout from all devices</span>
								<LogoutIcon size={16} color="#666" />
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
			</main>

			{/* Password Modal */}
			{showPasswordModal && (
				<div className="modal-overlay">
					<div className="modal-content">
						<h3>Change Password</h3>
						<label>
							Current Password
							<input
								type="password"
								className="settings-input"
								value={passwordData.current}
								onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
							/>
						</label>
						<label>
							New Password
							<input
								type="password"
								className="settings-input"
								value={passwordData.new}
								onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
							/>
						</label>
						<label>
							Confirm Password
							<input
								type="password"
								className="settings-input"
								value={passwordData.confirm}
								onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
							/>
						</label>
						<div className="modal-actions">
							<button className="btn secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
							<button className="btn primary" onClick={handlePasswordChange}>Update</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
