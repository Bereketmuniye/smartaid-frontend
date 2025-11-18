import React from "react";

const Footer = () => {
    return (
        <footer className="footer">
            <p>
                &copy; {new Date().getFullYear()} SmartAid. All rights reserved.
            </p>

            <style jsx>{`
                .footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background-color: #2c3e50;
                    color: white;
                    text-align: center;
                    padding: 10px 0;
                    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
                    z-index: 1000;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
