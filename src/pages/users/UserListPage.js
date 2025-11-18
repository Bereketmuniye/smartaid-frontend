import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsers, registerUser, updateUser } from "../../services/userService"; // Assume user service with updateUser
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "" });
    const [submitting, setSubmitting] = useState(false);

    // Fetch users
    const fetchUsers = async () => {
        try {
            setError("");
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError("Failed to fetch users.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenAdd = () => {
        setFormData({ name: "", email: "", role: "" });
        setShowAddModal(true);
    };

    const handleOpenEdit = (user) => {
        setCurrentUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role?.name || "",
        });
        setShowEditModal(true);
    };

    const handleSubmitAdd = async () => {
        if (!formData.name || !formData.email || !formData.role) {
            alert("Please fill in all fields.");
            return;
        }
        setSubmitting(true);
        try {
            await registerUser(formData);
            setShowAddModal(false);
            fetchUsers();
        } catch (err) {
            alert("Failed to create user.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitEdit = async () => {
        if (!formData.name || !formData.email || !formData.role) {
            alert("Please fill in all fields.");
            return;
        }
        setSubmitting(true);
        try {
            await updateUser(currentUser._id, formData);
            setShowEditModal(false);
            fetchUsers();
        } catch (err) {
            alert("Failed to update user.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const addForm = (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
                type="text"
                placeholder="Name"
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
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
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
                placeholder="Role"
                value={formData.role}
                onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
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
                placeholder="Name"
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
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
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
                placeholder="Role"
                value={formData.role}
                onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
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
            <div className="user-list-container">
                <div className="loading-container">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-list-container">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-list-container">
            <h1 className="page-titles">Users</h1>
            <div className="button-section">
                <Button onClick={handleOpenAdd}><FaPlus /> Add New User</Button>
            </div>
            {users.length === 0 ? (
                <p className="empty-message">No users found.</p>
            ) : (
                <div className="table-container">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Link
                                            to={`/users/${user._id}`}
                                            className="user-link"
                                        >
                                            {user.name}
                                        </Link>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className="role-badge">
                                            {user.role?.name || "N/A"}
                                        </span>
                                    </td>
                                    <td>
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="actions-cell">
                                        <button
                                            onClick={() => handleOpenEdit(user)}
                                            className="edit-link"
                                            title="Edit User"
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
                title="Add New User"
                children={addForm}
                onClose={() => setShowAddModal(false)}
            />
            <Modal
                open={showEditModal}
                title="Edit User"
                children={editForm}
                onClose={() => setShowEditModal(false)}
            />
        </div>
    );
};

const globalStyles = `
    .user-list-container {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        min-height: 100vh;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }
    .page-title {
        color: #212529;
        font-size: 2.5rem;
        font-weight: 300;
        margin-bottom: 10px;
        text-align: center;
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
    .user-table {
        width: 100%;
        border-collapse: collapse;
        margin: 0;
    }
    .user-table thead th {
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
    .user-table tbody td {
        padding: 16px 12px;
        border-bottom: 1px solid #dee2e6;
        color: #6c757d;
        font-size: 0.95rem;
    }
    .user-table tbody tr:hover {
        background-color: #f8f9fa;
        transition: background-color 0.2s ease;
    }
    .user-table tbody tr:nth-child(even) {
        background-color: #fafbfc;
    }
    .user-link {
        color: #007bff;
        text-decoration: none;
        font-weight: 600;
    }
    .user-link:hover {
        color: #0056b3;
        text-decoration: underline;
    }
    .role-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
        background-color: #e9ecef;
        color: #495057;
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
        .user-list-container {
            padding: 10px;
        }
        .page-title {
            font-size: 2rem;
        }
        .user-table thead th,
        .user-table tbody td {
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
        .role-badge {
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
        .user-table {
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

export default UserListPage;
