import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getProjects } from "../../services/projectService";
import { getNGOs } from "../../services/ngoService";
import { getDonors } from "../../services/donorService";
import { getExpenses } from "../../services/expenseService";

import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

const DashboardPage = () => {
    const { user } = useAuth();

    const [totalProjects, setTotalProjects] = useState(0);
    const [activeNgos, setActiveNgos] = useState(0);
    const [totalDonors, setTotalDonors] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalExpenses, setTotalExpenses] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const [projectsRes, ngosRes, donorsRes, expensesRes] = await Promise.all([
                    getProjects(),
                    getNGOs(),
                    getDonors(),
                    getExpenses(),
                ]);
                setTotalProjects(projectsRes.count);
                setActiveNgos(ngosRes.count);
                setTotalDonors(donorsRes.count);
                setTotalExpenses(expensesRes.count);
            } catch (err) {
                setError(
                    "Failed to load dashboard data. Please try refreshing."
                );
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const data = [
        { name: "Projects", value: totalProjects },
        { name: "NGOs", value: activeNgos },
        { name: "Donors", value: totalDonors },
        { name: "Expenses", value: totalExpenses },
    ];

    const COLORS = ["#007BFF", "#28A745", "#FFC107"];

    if (loading) {
        return (
            <div className="dashboard-container">
                <div style={loadingStyle}>Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <div style={errorStyle}>{error}</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>
            {user && (
                <div className="welcome-section">
                    <p className="welcome-text">
                        Welcome, <span className="user-name">{user.name}</span>{" "}
                        ({user.role.name})!
                    </p>
                </div>
            )}

            <h2 className="section-title">Quick Stats</h2>
            <div className="stats-grid">
                <div
                    className="stat-card"
                    style={{ borderLeft: `4px solid ${COLORS[0]}` }}
                >
                    <h3 className="stat-title">Total Projects</h3>
                    <p className="stat-number" style={{ color: COLORS[0] }}>
                        {totalProjects}
                    </p>
                </div>

                <div
                    className="stat-card"
                    style={{ borderLeft: `4px solid ${COLORS[1]}` }}
                >
                    <h3 className="stat-title">Active NGOs</h3>
                    <p className="stat-number" style={{ color: COLORS[1] }}>
                        {activeNgos}
                    </p>
                </div>

                <div
                    className="stat-card"
                    style={{ borderLeft: `4px solid ${COLORS[2]}` }}
                >
                    <h3 className="stat-title">Total Donors</h3>
                    <p className="stat-number" style={{ color: COLORS[2] }}>
                        {totalDonors}
                    </p>
                </div>
                <div
                    className="stat-card"
                    style={{ borderLeft: `4px solid ${COLORS[3]}` }}
                >
                    <h3 className="stat-title">Total Expenses</h3>
                    <p className="stat-number" style={{ color: COLORS[3] }}>
                        {totalExpenses}
                    </p>
                </div>
            </div>

            <h2 className="section-title">Visual Overview</h2>
            <div className="charts-grid">
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0f0f0"
                            />
                            <XAxis
                                dataKey="name"
                                stroke="#6c757d"
                                fontSize={12}
                            />
                            <YAxis stroke="#6c757d" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #dee2e6",
                                    borderRadius: "4px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Bar
                                dataKey="value"
                                fill={COLORS[0]}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart
                            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                        >
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                                labelLine={false}
                                labelStyle={{
                                    fontSize: "12px",
                                    fill: "#6c757d",
                                }}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #dee2e6",
                                    borderRadius: "4px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const loadingStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
    fontSize: "1.2em",
    color: "#6c757d",
};

const errorStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
    fontSize: "1.2em",
    color: "#dc3545",
    textAlign: "center",
    padding: "0 20px",
};

const globalStyles = `
    .dashboard-container {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        min-height: 100vh;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }

    .dashboard-title {
        color: #212529;
        font-size: 2.5rem;
        font-weight: 300;
        margin-bottom: 10px;
        text-align: center;
    }

    .welcome-section {
        text-align: center;
        margin-bottom: 40px;
    }

    .welcome-text {
        color: #6c757d;
        font-size: 1.1rem;
        margin: 0;
    }

    .user-name {
        color: #007BFF;
        font-weight: 600;
    }

    .section-title {
        color: #212529;
        font-size: 1.5rem;
        font-weight: 500;
        margin-bottom: 20px;
        padding-left: 10px;
        border-left: 3px solid #007BFF;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
    }

    .stat-card {
        padding: 24px;
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border: 1px solid #e9ecef;
    }

    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }

    .stat-title {
        color: #6c757d;
        font-size: 1rem;
        font-weight: 500;
        margin: 0 0 10px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0;
        line-height: 1;
    }

    .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        width: 100%;
        margin-bottom: 40px;
    }

    .chart-container {
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        padding: 20px;
        border: 1px solid #e9ecef;
    }

    @media (max-width: 768px) {
        .dashboard-container {
            padding: 10px;
        }

        .dashboard-title {
            font-size: 2rem;
        }

        .stats-grid {
            grid-template-columns: 1fr;
            gap: 15px;
        }

        .charts-grid {
            grid-template-columns: 1fr;
        }

        .chart-container {
            padding: 15px;
        }

        .stat-number {
            font-size: 2rem;
        }
    }

    @media (max-width: 480px) {
        .section-title {
            font-size: 1.3rem;
        }

        .welcome-text {
            font-size: 1rem;
        }
    }
`;

if (typeof document !== "undefined") {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);
}

export default DashboardPage;
