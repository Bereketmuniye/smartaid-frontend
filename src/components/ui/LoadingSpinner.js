// src/components/ui/LoadingSpinner.js
import React from "react";
// import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
    return (
        <div className="spinner-container">
            <div className="loading-spinner"></div>
            <style jsx>{`
                .spinner-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100px;
                }
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-left-color: #4a90e2;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default LoadingSpinner;
