import React from "react";

const Modal = ({ open, title, children }) => {
    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    width: "700px",
                    boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
                }}
            >
                <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>{title}</h2>
                <hr />
                <div style={{ marginTop: "10px" }}>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
