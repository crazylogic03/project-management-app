# 🚀 Project Manager: Full-Stack Collaboration Platform

A comprehensive **full-stack collaboration and project management system** designed to empower distributed teams with real-time communication, task tracking, calendar scheduling, and analytics.  
Built using **React, Node.js, Express, Prisma, and Socket.io**, this platform delivers modern tools for productivity and seamless teamwork.

---

## ✨ Features

### 📋 1. Project & Task Management (Kanban Board)
- Dynamic **Kanban Board** with drag-and-drop (react-beautiful-dnd / @hello-pangea/dnd)
- Full CRUD for:
  - Boards  
  - Lists (columns)  
  - Tasks (cards)
- Advanced Task Modal:
  - Description editing
  - Priority (High / Medium / Low)
  - Due date selection
  - Labels add/remove
  - Status toggle (Completed/Pending)
- Real-time **Activity Logging** shown in Dashboard & Project Details

---

### 🗓️ 2. Calendar & Notifications
- Monthly Calendar to view/manage tasks & events  
- Drag & drop to change event/task due dates  
- **Desktop Notifications** using the Notification API for upcoming tasks  
- User-configurable reminders (e.g., notify 15 minutes before)

---

### 💬 3. Real-time Chat
- Powered by **Socket.io**
- Supports:
  - Global Team Chat
  - Direct Messages (DMs)
  - Project-Specific Chat Rooms
- File & Image sharing in chat

---

### 👤 4. Authentication & User Management
- JWT-based Sign Up / Sign In  
- Secure password hashing using Bcrypt  
- **Google OAuth** login via Passport.js  
- User Profile & Settings page:
  - Update profile details
  - Manage notification preferences
  - Change password
- User search & project board invitations

---

### 📊 5. Dashboard & Reporting
- Overview stats: Total Boards, Active Tasks, Completed Tasks  
- Upcoming Deadlines with countdown timer  
- Board completion progress visualization  
- **Reports Page** using Recharts:
  - Task Status Distribution — Pie Chart  
  - Priority Breakdown — Bar Chart  
  - Activity Trends — Line Chart  

---

## 🏗️ Project Structure

├── client/ # Frontend (React App)
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ │ ├── Calendar.jsx
│ │ │ ├── Chat.jsx
│ │ │ ├── ProjectDetails.jsx
│ │ │ ├── Projects.jsx
│ │ │ ├── Sidebar.jsx
│ │ │ └── Dashboard/Reports/Settings
│ │ ├── context/
│ │ ├── styles/
│ │ └── App.jsx
│
└── server/ # Backend (Node/Express/Prisma)
├── controllers/
│ ├── userController.js
│ ├── messageController.js
│ └── invitationController.js
├── middlewares/
│ └── authMiddleware.js
├── routes/
│ ├── userRoutes.js
│ ├── boards.js
│ ├── cards.js
│ └── lists.js
├── prisma/
├── server.js
└── passport.js

---

## 💻 Local Setup

### Backend Setup
```bash
cd server
npm install

**Set UP .env**
Add required variables to .env
JWT_SECRET, DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

npx prisma migrate dev --name init
npm start


### Frontend Setup
cd client
npm install
npm run dev


🧪 Test Credentials
| Role                 | Email                                                 | Password    | Notes                               |
| -------------------- | ----------------------------------------------------- | ----------- | ----------------------------------- |
| Test User 1 (Admin)  | [testuser1@example.com](mailto:testuser1@example.com) | password123 | For creating boards, managing tasks For invites & DM testing      |



