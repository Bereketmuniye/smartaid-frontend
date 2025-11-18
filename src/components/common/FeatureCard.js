import React from "react";

const FeatureCard = ({ title, description, iconPath }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div
            style={{
                padding: "32px",
                borderRadius: "16px",
                background: "#fdfdff", 
                boxShadow: isHovered
                    ? "0 15px 40px rgba(0,0,0,0.12)" 
                    : "0 8px 25px rgba(0,0,0,0.06)", 
                transition: "all 0.3s ease",
                transform: isHovered ? "translateY(-12px)" : "translateY(0)",
                border: "1px solid #eee", 
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ marginBottom: "20px" }}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ width: "50px", height: "50px", color: "#663399" }} 
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={iconPath}
                    />
                </svg>
            </div>
            <h3
                style={{
                    fontSize: "1.6rem", 
                    margin: "0 0 12px 0",
                    color: "#333",
                    fontWeight: "600",
                }}
            >
                {title}
            </h3>
            <p
                style={{
                    color: "#666",
                    lineHeight: "1.7",
                    fontSize: "1.05rem",
                }}
            >
                {description}
            </p>
        </div>
    );
};

export default FeatureCard;
