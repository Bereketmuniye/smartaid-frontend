// src/pages/projects/ProjectDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../../services/projectService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const ProjectDetailPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProjectById(id);
                setProject(data);
            } catch (err) {
                setError("Failed to fetch project details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!project) return <p>Project not found.</p>;

    return (
        <div>
            <h1>{project.name}</h1>
            <p>
                <strong>NGO:</strong> {project.ngo?.name || "N/A"}
            </p>
            <p>
                <strong>Description:</strong> {project.description}
            </p>
            <p>
                <strong>Start Date:</strong>{" "}
                {new Date(project.start_date).toLocaleDateString()}
            </p>
            <p>
                <strong>End Date:</strong>{" "}
                {new Date(project.end_date).toLocaleDateString()}
            </p>
            <p>
                <strong>Total Budget:</strong> $
                {project.total_budget?.toLocaleString()}
            </p>

            {/* Placeholder for activities, budgets, donors */}
            <h2 style={{ marginTop: "30px" }}>Activities</h2>
            <p>List of activities here...</p>

            <h2 style={{ marginTop: "30px" }}>Budgets</h2>
            <p>Budget categories and allocations here...</p>

            <h2 style={{ marginTop: "30px" }}>Donors</h2>
            <p>Donors linked to this project here...</p>
        </div>
    );
};

export default ProjectDetailPage;
