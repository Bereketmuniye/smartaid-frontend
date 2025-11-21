import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import InputField from "../../components/forms/InputField";
import Button from "../../components/common/Button";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success("Welcome back! 🎉", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            setTimeout(() => navigate("/dashboard"), 800);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                    "Invalid email or password. Please try again.",
                {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                fontFamily: "'Poppins', sans-serif",
            }}
        >
            <div
                style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    padding: "48px 40px",
                    borderRadius: "20px",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                    maxWidth: "420px",
                    width: "100%",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    animation: "fadeIn 0.8s ease-out",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <h1
                        style={{
                            fontSize: "2.5rem",
                            fontWeight: "700",
                            background:
                                "linear-gradient(to right, #667eea, #764ba2)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            margin: "0 0 8px 0",
                        }}
                    >
                        SmartAid
                    </h1>
                    <p style={{ color: "#666", fontSize: "1.1rem", margin: 0 }}>
                        Welcome back! Please login to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        style={{ marginBottom: "20px" }}
                    />

                    <div style={{ position: "relative", marginBottom: "24px" }}>
                        <InputField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "38px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#888",
                                fontSize: "1.2rem",
                            }}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            background: loading
                                ? "#999"
                                : "linear-gradient(to right, #667eea, #764ba2)",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: loading
                                ? "none"
                                : "0 10px 20px rgba(102, 126, 234, 0.3)",
                        }}
                        onMouseEnter={(e) =>
                            !loading &&
                            (e.target.style.transform = "translateY(-2px)")
                        }
                        onMouseLeave={(e) =>
                            !loading &&
                            (e.target.style.transform = "translateY(0)")
                        }
                    >
                        {loading ? "Logging in..." : "Login Now"}
                    </Button>
                </form>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "28px",
                        color: "#777",
                        fontSize: "0.95rem",
                    }}
                >
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        style={{
                            color: "#667eea",
                            fontWeight: "600",
                            textDecoration: "none",
                        }}
                    >
                        Register here →
                    </Link>
                </p>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
