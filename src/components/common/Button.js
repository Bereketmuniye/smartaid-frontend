import React from "react";

const Button = ({ children, variant, style, onMouseEnter, onMouseLeave }) => {
    const baseStyle = {
        padding: "12px 24px",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: "pointer",
        border: "none",
        transition: "all 0.2s ease-in-out",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
    };

    const variants = {
        primary: {
            background: "linear-gradient(45deg, #4a00e0, #8e2de2)", // New primary gradient
            color: "white",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            "&:hover": {
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                transform: "translateY(-2px)",
            },
        },
        secondary: {
            background: "#6c757d",
            color: "white",
            "&:hover": {
                background: "#5a6268",
            },
        },
        ghost: {
            background: "transparent",
            color: "#6a6a6a", // Darker ghost text
            "&:hover": {
                background: "rgba(0,0,0,0.05)",
                color: "#333",
            },
        },
        outline: {
            background: "transparent",
            border: "1px solid #ccc",
            color: "#333",
            "&:hover": {
                background: "#f0f0f0",
                borderColor: "#aaa",
            },
        },
    };

    const currentVariantStyle = variants[variant] || variants.primary;

    return (
        <button
            style={{ ...baseStyle, ...currentVariantStyle, ...style }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </button>
    );
};

export default Button;
