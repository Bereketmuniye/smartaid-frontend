import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

const Navbar = ({ isAuthenticated }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                padding: "16px 40px",
                background: scrolled
                    ? "rgba(255, 255, 255, 0.98)" 
                    : "transparent",
                backdropFilter: scrolled ? "blur(15px)" : "none", 
                boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "none", 
                transition: "all 0.4s ease",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <h2
                style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    background: "linear-gradient(to right, #4a00e0, #8e2de2)", 
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    margin: 0,
                }}
            >
                SmartAid
            </h2>

            <div>
                {isAuthenticated ? (
                    <Link to="/dashboard">
                        <Button variant="primary">Dashboard →</Button>
                    </Link>
                ) : (
                    <>
                        <Link to="/login">
                            <Button
                                variant="ghost"
                                style={{ marginRight: "12px", color: "#555" }} 
                            >
                                Login
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary">Get Started</Button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
