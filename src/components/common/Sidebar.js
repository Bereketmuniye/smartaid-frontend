import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaTachometerAlt,
    FaUsers,
    FaHandsHelping,
    FaUserFriends,
    FaProjectDiagram,
    FaAngleDoubleUp,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext"; 

const Sidebar = () => {
    const { user } = useAuth();
    const links = [
        { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
        { to: "/donors", label: "Donors", icon: <FaUserFriends /> },
        { to: "/projects", label: "Projects", icon: <FaProjectDiagram /> },
        { to: "/ngos", label: "NGOs", icon: <FaHandsHelping /> },
        { to: "/expenses", label: "Expenses", icon: <FaAngleDoubleUp /> },
        { to: "/users", label: "Users", icon: <FaUsers /> }
    ];


    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    {links.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) =>
                                    isActive
                                        ? "sidebar__link active"
                                        : "sidebar__link"
                                }
                            >
                                <span className="icon">{link.icon}</span>
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <style jsx>{`
                .sidebar {
                    position: fixed;
                    top: 50px;
                    left: 0;
                    height: 100vh;
                    width: 220px;
                    background-color: #2c3e50;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }

                .sidebar nav ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .sidebar__link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 15px;
                    margin-bottom: 5px;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    transition: background-color 0.2s ease;
                    font-size: 1rem;
                }

                .sidebar__link:hover {
                    background-color: #4a6784;
                }

                .sidebar__link.active {
                    background-color: #4a90e2;
                    font-weight: bold;
                }

                .icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }

                .sidebar::-webkit-scrollbar {
                    width: 6px;
                }
                .sidebar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                }
            `}</style>
        </aside>
    );
};

export default Sidebar;
