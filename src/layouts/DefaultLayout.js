import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext"; 
import "../assets/styles/layout/_defaultLayout.scss"; 

const DefaultLayout = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="default-layout">
            <Header />
            <Sidebar />
            <main className="main-content">
                <div className="content-area">
                    <Outlet /> {

                    }
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DefaultLayout;
