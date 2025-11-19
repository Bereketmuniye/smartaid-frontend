// src/pages/ngos/NgoListPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNGOs, createNGO, updateNGO } from "../../services/ngoService"; // Assume NGO service with create and update
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { FaPlus } from "react-icons/fa";

const NgoListPage = () => {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentNgo, setCurrentNgo] = useState(null);
    const [formData, setFormData] = useState({ name: "", address: "" });
    const [submitting, setSubmitting] = useState(false);

    const fetchNgos = async () => {
        try {
            setError("");
            const data = await getNGOs();
            setNgos(data);
        } catch (err) {
            setError("Failed to fetch NGOs.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNgos();
    }, []);

    const handleOpenAdd = () => {
        setFormData({ name: "", address: "" });
        setShowAddModal(true);
    };

    const handleOpenEdit = (ngo) => {
        setCurrentNgo(ngo);
        setFormData({ name: ngo.name, address: ngo.address });
        setShowEditModal(true);
    };

    const handleSubmitAdd = async () => {
        if (!formData.name || !formData.address) {
            alert("Please fill in all fields.");
            return;
        }
        setSubmitting(true);
        try {
            await createNGO(formData);
            setShowAddModal(false);
            fetchNgos();
        } catch (err) {
            alert("Failed to create NGO.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitEdit = async () => {
        if (!formData.name || !formData.address) {
            alert("Please fill in all fields.");
            return;
        }
        setSubmitting(true);
        try {
            await updateNGO(currentNgo._id, formData);
            setShowEditModal(false);
            fetchNgos();
        } catch (err) {
            alert("Failed to update NGO.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const addForm = (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
                type="text"
                placeholder="NGO Name"
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
            <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            />
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                }}
            >
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
                    }}
                >
                    {submitting ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );

    const editForm = (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
                type="text"
                placeholder="NGO Name"
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
            <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                }
                style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    fontSize: "1rem",
                }}
            />
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                }}
            >
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
                    }}
                >
                    {submitting ? "Updating..." : "Update"}
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="ngo-list-container">
                <div className="loading-container">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ngo-list-container">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ngo-list-container">
            <h1 className="page-titles">NGOs</h1>
            <div className="button-section">
                <Button onClick={handleOpenAdd}><FaPlus /> Add New NGO</Button>
            </div>
            {ngos.length === 0 ? (
                <p className="empty-message">No NGOs found.</p>
            ) : (
                <div className="table-container">
                    <table className="ngo-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ngos.map((ngo, index) => (
                                <tr key={ngo._id}>
                                    <td>{index + 1}</td>
                                    <td style={{ color: "blue" }}>
                                        <Link to={`/ngos/${ngo._id}`}>{ngo.name}</Link>
                                    </td>
                                    <td>{ngo.address}</td>
                                    <td>
                                        {new Date(
                                            ngo.createdAt
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="actions-cell">
                                        <button
                                            onClick={() => handleOpenEdit(ngo)}
                                            className="edit-link"
                                            title="Edit NGO"
                                        >
                                            <span className="edit-icon">
                                                ✏️
                                            </span>
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
                title="Add New NGO"
                children={addForm}
                onClose={() => setShowAddModal(false)}
            />
            <Modal
                open={showEditModal}
                title="Edit NGO"
                children={editForm}
                onClose={() => setShowEditModal(false)}
            />
        </div>
    );
};

const globalStyles = `
    .ngo-list-container {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }

    .button-section {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 30px;
    }

    .table-container {
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        overflow-x: auto;
        border: 1px solid #e9ecef;
    }

    .ngo-table {
        width: 100%;
        border-collapse: collapse;
        margin: 0;
    }

    .ngo-table thead th {
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

    .ngo-table tbody td {
        padding: 16px 12px;
        border-bottom: 1px solid #dee2e6;
        color: #6c757d;
        font-size: 0.95rem;
    }

    .ngo-table tbody tr:hover {
        background-color: #f8f9fa;
        transition: background-color 0.2s ease;
    }

    .ngo-table tbody tr:nth-child(even) {
        background-color: #fafbfc;
    }

    .ngo-link {
        color: #007bff;
        text-decoration: none;
        font-weight: 600;
    }

    .ngo-link:hover {
        color: #0056b3;
        text-decoration: underline;
    }

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

    .edit-icon {
        font-size: 1.1rem;
        margin: 0;
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
        .ngo-list-container {
            padding: 10px;
        }

        .page-title {
            font-size: 2rem;
        }

        .ngo-table thead th,
        .ngo-table tbody td {
            padding: 12px 8px;
            font-size: 0.9rem;
        }

        .button-section {
            margin-bottom: 20px;
        }

        .edit-link {
            width: 28px;
            height: 28px;
        }

        .edit-icon {
            font-size: 1rem;
        }
    }

    @media (max-width: 480px) {
        .page-title {
            font-size: 1.8rem;
        }

        .empty-message {
            font-size: 1rem;
        }

        .ngo-table {
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

export default NgoListPage;
