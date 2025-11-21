import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {

    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    return (
        <header className="header">
            <Link to="/" className="header__logo">
                <h2 style={{ color: "#4a90e2" }}>SmartAid</h2>
            </Link>
            <nav className="header__nav">
                <button className="nav-link" onClick={handleLogout}>
                    <FaSignOutAlt />
                </button>
            </nav>

            <style>
                {`
                .header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 60px;
                    background-color: #fff;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                    z-index: 1000;
                }

                .header__logo h2 {
                    margin: 0;
                    font-size: 1.5rem;
                }

                .header__nav a {
                    color: #495057;
                    font-size: 1.2rem;
                    text-decoration: none;
                }
                `}
            </style>
        </header>
    );
};

export default Header;
