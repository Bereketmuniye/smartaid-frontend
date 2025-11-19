import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsers, registerUser, updateUser } from "../../services/userService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { FaEdit, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "./UserListPage.css"; // We'll add this file below

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "" });
    const [submitting, setSubmitting] = useState(false);

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
            toast.error("Please fill all fields");
            return;
        }

        setSubmitting(true);
        try {
            await registerUser(formData);
            toast.success("User created successfully!");
            setShowAddModal(false);
            fetchUsers();
        } catch (err) {
            toast.error("Failed to create user.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitEdit = async () => {
        if (!formData.name || !formData.email || !formData.role) {
            toast.error("Please fill in all fields.");
            return;
        }

        setSubmitting(true);
        try {
            await updateUser(currentUser._id, formData);
            toast.success("User updated successfully!");
            setShowEditModal(false);
            fetchUsers();
        } catch (err) {
            toast.error("Failed to update user.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="user-list-container">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-list-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />

            <div className="user-list-container">
                <div className="page-header">
                    <h1 className="page-title">Users Management</h1>
                    <Button onClick={handleOpenAdd} variant="primary">
                        <FaPlus className="icon" /> Add New User
                    </Button>
                </div>

                {users.length === 0 ? (
                    <div className="empty-state">
                        <p>No users found.</p>
                        <Button onClick={handleOpenAdd}>Create your first user</Button>
                    </div>
                ) : (
                    <div className="table-wrapper">
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
                                            <Link to={`/users/${user._id}`} className="user-link">
                                                {user.name}
                                            </Link>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`role-badge role-${(user.role?.name || "user").toLowerCase()}`}>
                                                {user.role?.name || "User"}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "2-digit",
                                            })}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleOpenEdit(user)}
                                                className="action-btn edit-btn"
                                                title="Edit user"
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

                {/* Add User Modal */}
                <Modal
                    open={showAddModal}
                    title="Add New User"
                    onClose={() => setShowAddModal(false)}
                >
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }} className="modal-form">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="user">User</option>
                        </select>

                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary" disabled={submitting}>
                                {submitting ? "Creating..." : "Create User"}
                            </button>
                        </div>
                    </form>
                </Modal>

               {/* Edit User Modal */}
                <Modal
                    open={showEditModal}
                    title="Edit User"
                    onClose={() => setShowEditModal(false)}
                >
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmitEdit(); }} className="modal-form">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        
                        {/* ← THIS IS THE NEW DROPDOWN FOR ROLE */}
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="user">User</option>
                        </select>

                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary" disabled={submitting}>
                                {submitting ? "Updating..." : "Update User"}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </>
    );
};

export default UserListPage;