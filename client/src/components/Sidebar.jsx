import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
import {
  Home, FolderKanban, FileText, CheckSquare,
  CalendarDays, BarChart3, FileStack, HelpCircle, Settings
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="left-panel">
      <h2 className="site-name">Project Manager</h2>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard"><Home size={20} /> Dashboard</NavLink>
        <NavLink to="/projects"><FolderKanban size={20} /> Projects</NavLink>
        <NavLink to="/task-detail"><CheckSquare size={20} /> Task Detail</NavLink>
        <NavLink to="/calendar"><CalendarDays size={20} /> Calendar</NavLink>
        <a><BarChart3 size={20} /> Reports</a>
        <a><FileStack size={20} /> Files</a>
        <NavLink to="/settings"><Settings size={20} /> Settings</NavLink>
      </nav>

      <div className="sidebar-footer">
        <a><HelpCircle size={20} /> Help</a>
      </div>
    </aside>
  );
};

export default Sidebar;
