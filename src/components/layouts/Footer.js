import React from "react";

const Footer = () => {
    return (
        <footer
            style={{
                padding: "60px 40px",
                background: "#1c1c2e", 
                color: "#b0b0b0", 
                textAlign: "center",
                borderTop: "1px solid #2a2a3e",
            }}
        >
            <p style={{ margin: 0, fontSize: "1rem" }}>
                © {new Date().getFullYear()}{" "}
                <strong style={{ color: "#8e2de2" }}>SmartAid</strong>. Made
                with ❤️ for social good.
            </p>
        </footer>
    );
};

export default Footer;
