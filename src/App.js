import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./contexts/AuthContext";
import DefaultLayout from "./layouts/DefaultLayout";

import LandingPage from "./pages/home/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import NgoListPage from "./pages/ngos/NgoListPage";
import ProjectListPage from "./pages/projects/ProjectListPage";
import ProjectDetailPage from "./pages/projects/ProjectDetailPage";
import UserListPage from "./pages/users/UserListPage";
import DonorListPage from "./pages/donors/DonorListPage";
import NotFoundPage from "./pages/NotFoundPage";
import ActivityListPage from "./pages/activity/ActivityListPage";
import ExpenseListPage from "./pages/expense/ExpenseListPage";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    gutter={12}
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: "#333",
                            color: "#fff",
                            borderRadius: "12px",
                            padding: "16px",
                            fontSize: "15px",
                        },
                        success: {
                            icon: "🎉",
                            style: { background: "#10b981" },
                        },
                        error: {
                            icon: "❌",
                            style: { background: "#ef4444" },
                        },
                    }}
                />

                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route element={<DefaultLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/donors" element={<DonorListPage />} />
                        <Route path="/projects" element={<ProjectListPage />} />
                        <Route path="/ngos" element={<NgoListPage />} />
                        <Route path="/activities" element={<ActivityListPage />} />
                        <Route path="/expenses" element={<ExpenseListPage />} />
                        <Route
                            path="/projects/:id"
                            element={<ProjectDetailPage />}
                        />
                        <Route path="/users" element={<UserListPage />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
