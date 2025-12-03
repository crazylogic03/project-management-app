# 🚀 Project Manager: Full-Stack Collaboration Platform

A comprehensive **full-stack collaboration and project management system** designed to empower distributed teams with real-time communication, task tracking, calendar scheduling, and analytics. Built using **React, Node.js, Express, Prisma, and Socket.io**, this platform delivers modern tools for productivity and seamless teamwork.

---

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Test Credentials](#-test-credentials)

---

## ✨ Features

### 📋 1. Project & Task Management (Kanban Board)
- **Dynamic Kanban Board**: Drag-and-drop tasks using `react-beautiful-dnd`.
- **Full CRUD Operations**: Manage Boards, Lists (columns), and Tasks (cards).
- **Advanced Task Details**:
  - Edit descriptions
  - Set Priority (High / Medium / Low)
  - Assign Due Dates
  - Add/Remove Labels
  - Toggle Status (Completed/Pending)
- **Activity Logging**: Real-time tracking of actions in Dashboard & Project Details.

### 🗓️ 2. Calendar & Notifications
- **Monthly Calendar**: Visual overview of tasks and events.
- **Drag & Drop Scheduling**: Easily change due dates.
- **Desktop Notifications**: Alerts for upcoming tasks using the Notification API.
- **Custom Reminders**: User-configurable alerts (e.g., 15 minutes before).

### 💬 3. Real-time Chat
- **Socket.io Powered**: Instant messaging.
- **Chat Modes**:
  - Global Team Chat
  - Direct Messages (DMs)
  - Project-Specific Rooms
- **Media Sharing**: Send files and images directly in chat.

### 👤 4. Authentication & User Management
- **Secure Auth**: JWT-based Sign Up/In and Bcrypt password hashing.
- **Google OAuth**: Seamless login via Passport.js.
- **User Profile**: Manage details, notification preferences, and password.
- **Collaboration**: Search users and invite them to project boards.

### 📊 5. Dashboard & Reporting
- **Overview Stats**: Total Boards, Active/Completed Tasks.
- **Deadline Tracking**: Countdown timers for upcoming tasks.
- **Visual Reports**:
  - Task Status Distribution (Pie Chart)
  - Priority Breakdown (Bar Chart)
  - Activity Trends (Line Chart)

---

## 🛠 Tech Stack

| Area | Technologies |
|------|--------------|
| **Frontend** | React, Vite, Tailwind CSS, Recharts, react-beautiful-dnd |
| **Backend** | Node.js, Express.js, Passport.js |
| **Database** | PostgreSQL (via Prisma ORM) |
| **Real-time** | Socket.io |
| **Authentication** | JWT, Google OAuth 2.0, Bcrypt |

---

## 🏗️ Project Structure

```bash
├── client/                 # Frontend (React App)
│   ├── src/
│   │   ├── components/     # UI Components
│   │   │   ├── Calendar.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── InvitationHandler.jsx
│   │   │   ├── InviteModal.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── TaskDetails.jsx
│   │   ├── context/        # React Context
│   │   ├── styles/         # CSS Styles
│   │   └── App.jsx         # Main App Component
│   └── ...
│
└── server/                 # Backend (Node/Express)
    ├── controllers/        # Logic Handlers
    │   ├── invitationController.js
    │   ├── messageController.js
    │   └── userController.js
    ├── routes/             # API Routes
    │   ├── activity.js
    │   ├── boards.js
    │   ├── calendarRoutes.js
    │   ├── cards.js
    │   ├── dashboard.js
    │   ├── invitationRoutes.js
    │   ├── lists.js
    │   ├── messageRoutes.js
    │   ├── userRoutes.js
    │   └── ...
    ├── prisma/             # Database Schema
    ├── server.js           # Entry Point
    └── ...
```

---

## 💻 Local Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- PostgreSQL installed and running

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `server` directory and add:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/your_db_name"
   JWT_SECRET="your_super_secret_key"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   CLIENT_URL="http://localhost:5173"
   ```
4. Run Database Migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the Server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Development Server:
   ```bash
   npm run dev
   ```

---

## 🧪 Test Credentials

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| **Admin User** | `testuser1@example.com` | `password123` | Can create boards, manage tasks, and invite users. |

---
