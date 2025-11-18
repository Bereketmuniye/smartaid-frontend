// src/pages/projects/ProjectListPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    getProjects,
    createProject,
    updateProject,
} from "../../services/projectService";
import { getNGOs } from "../../services/ngoService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const ProjectListPage = () => {
    const [projects, setProjects] = useState([]);
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        total_budget: "",
        status: "active",
        ngo: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchProjects = async () => {
        try {
            setError("");
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            setError("Failed to fetch projects.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchNgos = async () => {
        try {
            const data = await getNGOs();
            setNgos(data);
        } catch (err) {
            console.error("Failed to fetch NGOs:", err);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchNgos();
    }, []);

    const handleOpenAdd = () => {
        setFormData({
            name: "",
            description: "",
            start_date: "",
            end_date: "",
            total_budget: "",
            status: "active",
            ngo: "",
        });
        setShowAddModal(true);
    };

    const handleOpenEdit = (project) => {
        setCurrentProject(project);
        setFormData({
            name: project.name,
            description: project.description,
            start_date: project.start_date.split("T")[0],
            end_date: project.end_date.split("T")[0],
            total_budget: project.total_budget,
            status: project.status,
            ngo: project.ngo._id,
        });
        setShowEditModal(true);
    };

    const handleSubmitAdd = async () => {
        if (
            !formData.name ||
            !formData.description ||
            !formData.start_date ||
            !formData.end_date ||
            !formData.total_budget ||
            !formData.ngo ||
            !formData.status
        ) {
            alert("Please fill in all fields.");
            return;
        }
        setSubmitting(true);
        try {
            await createProject(formData);
            setShowAddModal(false);
            fetchProjects();
        } catch (err) {
            alert("Failed to create project.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitEdit = async () => {
        if (
            !formData.name ||
            !formData.description ||
            !formData.start_date ||
            !formData.end_date ||
            !formData.total_budget ||
            !formData.ngo ||
            !formData.status
        ) {
            alert("Please fill in all fields.");
            return;
        }
        setSubmitting(true);
        try {
            await updateProject(currentProject._id, formData);
            setShowEditModal(false);
            fetchProjects();
        } catch (err) {
            alert("Failed to update project.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const addForm = (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
                type="text"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            />
            <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    resize: "vertical",
                }}
            />
            <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            />
            <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            />
            <input
                type="number"
                placeholder="Total Budget"
                value={formData.total_budget}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        total_budget: parseFloat(e.target.value) || "",
                    })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            />
            <select
                value={formData.ngo}
                onChange={(e) =>
                    setFormData({ ...formData, ngo: e.target.value })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            >
                <option value="">Select NGO</option>
                {ngos.map((ngo) => (
                    <option key={ngo._id} value={ngo._id}>
                        {ngo.name}
                    </option>
                ))}
            </select>
            <select
                value={formData.status}
                onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
            </select>
            <button
                onClick={handleSubmitAdd}
                disabled={submitting}
                style={{
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    opacity: submitting ? 0.7 : 1,
                    marginTop: "10px",
                }}
            >
                {submitting ? "Saving..." : "Save"}
            </button>
            <button
                onClick={() => setShowAddModal(false)}
                style={{
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                Cancel
            </button>
        </div>
    );

    const editForm = (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
                type="text"
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            />
            <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    resize: "vertical",
                }}
            />
            <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            />
            <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            />
            <input
                type="number"
                placeholder="Total Budget"
                value={formData.total_budget}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        total_budget: parseFloat(e.target.value) || "",
                    })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            />
            <select
                value={formData.ngo}
                onChange={(e) =>
                    setFormData({ ...formData, ngo: e.target.value })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            >
                <option value="">Select NGO</option>
                {ngos.map((ngo) => (
                    <option key={ngo._id} value={ngo._id}>
                        {ngo.name}
                    </option>
                ))}
            </select>
            <select
                value={formData.status}
                onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
            </select>
            <button
                onClick={handleSubmitEdit}
                disabled={submitting}
                style={{
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    opacity: submitting ? 0.7 : 1,
                    marginTop: "10px",
                }}
            >
                {submitting ? "Updating..." : "Update"}
            </button>
            <button
                onClick={() => setShowEditModal(false)}
                style={{
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                Cancel
            </button>
        </div>
    );

    if (loading) {
        return (
            <div className="project-list-container">
                <div className="loading-container">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="project-list-container">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="project-list-container">
            <div className="header-section">
                <h1 className="page-title">Projects</h1>
                <Button onClick={handleOpenAdd}><FaPlus/>Add New Project</Button>
            </div>
            {projects.length === 0 ? (
                <p className="empty-message">No projects found.</p>
            ) : (
                <div className="table-container">
                    <table className="project-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Project Name</th>
                                <th>NGO</th>
                                <th>Activity</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Budget</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project, index) => (
                                <tr key={project._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Link
                                            to={`/projects/${project._id}`}
                                            className="project-link"
                                        >
                                            {project.name}
                                        </Link>
                                    </td>
                                    <td>{project.ngo?.name || "N/A"}</td>
                                    <td>
                                        {project.activities &&
                                        project.activities.length > 0
                                            ? project.activities
                                                  .map((a) => a.name)
                                                  .join(", ")
                                            : "-"}
                                    </td>
                                    <td>
                                        {new Date(
                                            project.start_date
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {new Date(
                                            project.end_date
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        $
                                        {project.total_budget?.toLocaleString() ||
                                            "0"}
                                    </td>
                                    <td>
                                        <span
                                            className={`status-badge status-${project.status.toLowerCase()}`}
                                        >
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button
                                            onClick={() =>
                                                handleOpenEdit(project)
                                            }
                                            className="edit-link"
                                            title="Edit Project"
                                        >
                                            <FaEdit />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Modal
                open={showAddModal}
                title="Add New Project"
                children={addForm}
                onClose={() => setShowAddModal(false)}
            />
            <Modal
                open={showEditModal}
                title="Edit Project"
                children={editForm}
                onClose={() => setShowEditModal(false)}
            />
        </div>
    );
};

const globalStyles = `
    .project-list-container {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        min-height: 100vh;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }

    .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }

    .page-title {
        color: #212529;
        font-size: 2.5rem;
        font-weight: 300;
        margin: 0;
    }

    .table-container {
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        overflow-x: auto;
        border: 1px solid #e9ecef;
    }

    .project-table {
        width: 100%;
        border-collapse: collapse;
        margin: 0;
    }

    .project-table thead th {
        background-color: #f8f9fa;
        color: #495057;
        font-weight: 600;
        padding: 16px 12px;
        text-align: left;
        border-bottom: 2px solid #dee2e6;
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .project-table tbody td {
        padding: 16px 12px;
        border-bottom: 1px solid #dee2e6;
        color: #6c757d;
        font-size: 0.95rem;
    }

    .project-table tbody tr:hover {
        background-color: #f8f9fa;
        transition: background-color 0.2s ease;
    }

    .project-table tbody tr:nth-child(even) {
        background-color: #fafbfc;
    }

    .project-link {
        color: #007bff;
        text-decoration: none;
        font-weight: 600;
    }

    .project-link:hover {
        color: #0056b3;
        text-decoration: underline;
    }

    .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
    }

    .status-active { background-color: #d4edda; color: #155724; }
    .status-inactive { background-color: #f8d7da; color: #721c24; }
    .status-completed { background-color: #d1ecf1; color: #0c5460; }

    .actions-cell {
        text-align: center;
        white-space: nowrap;
    }

    .edit-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        color: #6c757d;
        text-decoration: none;
        transition: all 0.2s ease;
        background-color: #fff;
        cursor: pointer;
        border: none;
    }

    .edit-link:hover {
        background-color: #e3f2fd;
        color: #007bff;
        border-color: #007bff;
        transform: scale(1.05);
    }

    .empty-message {
        text-align: center;
        color: #6c757d;
        font-size: 1.1rem;
        margin-top: 40px;
        padding: 20px;
    }

    .loading-container,
    .error-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 50vh;
    }

    .error-message {
        color: #dc3545;
        font-size: 1.2rem;
        text-align: center;
        padding: 20px;
    }

    @media (max-width: 768px) {
        .project-list-container {
            padding: 10px;
        }

        .page-title {
            font-size: 2rem;
        }

        .header-section {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
        }

        .project-table thead th,
        .project-table tbody td {
            padding: 12px 8px;
            font-size: 0.9rem;
        }

        .edit-link {
            width: 28px;
            height: 28px;
        }

        .status-badge {
            font-size: 0.75rem;
            padding: 3px 6px;
        }
    }

    @media (max-width: 480px) {
        .page-title {
            font-size: 1.8rem;
        }

        .empty-message {
            font-size: 1rem;
        }

        .project-table {
            font-size: 0.85rem;
        }
    }
`;

if (typeof document !== "undefined") {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);
}

export default ProjectListPage;
