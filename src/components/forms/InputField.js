// src/components/forms/InputField.js
import React from "react";
// import styles from './InputField.module.css'; // If using CSS Modules

const InputField = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    error,
}) => {
    return (
        <div className="form-group">
            {label && <label htmlFor={name}>{label}</label>}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`form-control ${error ? "is-invalid" : ""}`}
            />
            {error && <div className="invalid-feedback">{error}</div>}
            <style jsx>{`
                /* Basic inline styles for forms */
                .form-group {
                    margin-bottom: 15px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #555;
                }
                .form-control {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 16px;
                    &:focus {
                        border-color: #4a90e2;
                        outline: none;
                        box-shadow: 0 0 0 0.2rem rgba(74, 144, 226, 0.25);
                    }
                }
                .form-control.is-invalid {
                    border-color: #dc3545;
                }
                .invalid-feedback {
                    color: #dc3545;
                    font-size: 0.875em;
                    margin-top: 5px;
                }
            `}</style>
        </div>
    );
};

export default InputField;
