// src/pages/NotFoundPage.js
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                textAlign: "center",
                backgroundColor: "#f4f7f6",
            }}
        >
            <h1 style={{ fontSize: "5em", color: "#4a90e2" }}>404</h1>
            <h2 style={{ marginBottom: "20px" }}>Page Not Found</h2>
            <p
                style={{
                    fontSize: "1.2em",
                    color: "#666",
                    marginBottom: "30px",
                }}
            >
                The page you are looking for might have been removed, had its
                name changed, or is temporarily unavailable.
            </p>
            <Link
                to="/"
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#50e3c2",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "5px",
                    fontSize: "1.1em",
                }}
            >
                Go to Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
