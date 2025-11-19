import React from "react";

const Button = ({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  style,
  ...rest
}) => {
  const baseStyle = {
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    transition: "all 0.2s ease-in-out",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    textDecoration: "none",
    opacity: disabled ? 0.65 : 1,
  };

  const variants = {
    primary: {
      background: "linear-gradient(45deg, #4a00e0, #8e2de2)",
      color: "white",
      boxShadow: "0 5px 15px rgba(74, 0, 224, 0.4)",
    },
    secondary: { background: "#6c757d", color: "white" },
    ghost: { background: "transparent", color: "#555" },
    outline: { background: "transparent", color: "#4a00e0", border: "2px solid #4a00e0" },
  };

  const hoverStyles = {
    primary: { boxShadow: "0 10px 25px rgba(74, 0, 224, 0.5)", transform: "translateY(-3px)" },
    secondary: { background: "#5a6268" },
    ghost: { background: "rgba(0,0,0,0.05)", color: "#000" },
    outline: { background: "rgba(74, 0, 224, 0.08)" },
  };

  const current = variants[variant] || variants.primary;
  const hover = hoverStyles[variant] || hoverStyles.primary;

  const handleMouseEnter = (e) => {
    if (!disabled) Object.assign(e.currentTarget.style, hover);
    rest.onMouseEnter?.(e);
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      Object.assign(e.currentTarget.style, { ...baseStyle, ...current, ...(style || {}), transform: "none" });
    }
    rest.onMouseLeave?.(e);
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      style={{ ...baseStyle, ...current, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;