import React from "react"; // Only one React import needed here
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/common/Button"; 
import Navbar from "../../components/layouts/Navbar";
import FeatureCard from "../../components/common/FeatureCard";
import Footer from "../../components/layouts/Footer";

const LandingPage = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            title: "Project Tracking",
            desc: "Monitor progress with real-time updates and clear visualizations.",
            icon: "M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm3-3a1 1 0 11-2 0 1 1 0 012 0z", 
        },
        {
            title: "Budget Management",
            desc: "Transparent expense tracking, reporting, and financial oversight.",
            icon: "M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15H3V6h18v13z",
        },
        {
            title: "Donor Engagement",
            desc: "Build lasting trust with automated impact reports and communication.",
            icon: "M17 20H7a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v9a4 4 0 01-4 4zm-1-8a4 4 0 100-8 4 4 0 000 8zm-8 2a2 2 0 100-4 2 2 0 000 4z",
        },
        {
            title: "Compliance Ready",
            desc: "Stay audit-ready with robust built-in controls and data security.",
            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        },
    ];

    return (
        <>
            <Navbar isAuthenticated={isAuthenticated} />

            <section
                style={{
                    minHeight: "100vh",
                    background:
                        "linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "0 20px",
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        maxWidth: "900px",
                        animation: "fadeUp 1s ease-out",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "4.5rem",
                            fontWeight: "800",
                            margin: "0 0 24px 0",
                            lineHeight: "1.1",
                            textShadow: "0 6px 20px rgba(0,0,0,0.3)",
                        }}
                    >
                        Empower NGOs with
                        <br />
                        <span style={{ color: "#e0e0e0" }}>SmartAid</span>
                    </h1>

                    <p
                        style={{
                            fontSize: "1.5rem",
                            margin: "0 0 40px 0",
                            opacity: 0.9,
                            lineHeight: "1.6",
                            fontWeight: "300",
                        }}
                    >
                        The all-in-one platform to manage projects, track
                        budgets, engage donors, and drive real impact —
                        seamlessly and transparently.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        {!isAuthenticated ? (
                            <>
                                <Link to="/register">
                                    <Button
                                        variant="primary"
                                        style={{
                                            padding: "16px 36px",
                                            fontSize: "1.2rem",
                                            background: "white",
                                            color: "#4a00e0", 
                                            boxShadow:
                                                "0 10px 30px rgba(0,0,0,0.2)",
                                            transition: "all 0.3s ease",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.target.style.transform =
                                                "translateY(-4px) scale(1.02)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.target.style.transform =
                                                "translateY(0) scale(1)")
                                        }
                                    >
                                        Start Free Today
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button
                                        variant="outline"
                                        style={{
                                            padding: "16px 36px",
                                            fontSize: "1.2rem",
                                            border: "2px solid white",
                                            background: "transparent",
                                            color: "white",
                                            transition: "all 0.3s ease",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.target.style.background =
                                                "rgba(255,255,255,0.1)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.target.style.background =
                                                "transparent")
                                        }
                                    >
                                        Login
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Link to="/dashboard">
                                <Button
                                    variant="primary"
                                    style={{
                                        padding: "16px 40px",
                                        fontSize: "1.3rem",
                                        background: "white",
                                        color: "#4a00e0",
                                    }}
                                >
                                    Go to Dashboard →
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "200px",
                        background: "white",
                        clipPath: "ellipse(100% 50% at 50% 100%)",
                        opacity: 0.1, 
                    }}
                />
            </section>

            <section
                style={{
                    padding: "100px 40px",
                    background: "white",
                    textAlign: "center",
                }}
            >
                <h2
                    style={{
                        fontSize: "2.8rem",
                        marginBottom: "60px",
                        color: "#222", 
                        fontWeight: "700",
                    }}
                >
                    Built for Real Impact
                </h2>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "40px",
                        maxWidth: "1200px",
                        margin: "0 auto",
                    }}
                >
                    {features.map((feature, i) => (
                        <FeatureCard
                            key={i}
                            title={feature.title}
                            description={feature.desc}
                            iconPath={feature.icon} 
                        />
                    ))}
                </div>
            </section>

            <Footer />

            <style jsx>{`
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
};

export default LandingPage;
