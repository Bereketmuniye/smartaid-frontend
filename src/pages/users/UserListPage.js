import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getUsers,
  registerUser,
  updateUser,
  activateUser,
  deactivateUser
} from "../../services/userService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { FaEdit, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "./UserListPage.css";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

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

  const closeAllModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowActivateModal(false);
    setShowDeactivateModal(false);
    setCurrentUser(null);
    setFormData({ name: "", email: "", role: "" });
    setSubmitting(false);
  };

  const handleOpenAdd = () => {
    setFormData({ name: "", email: "", role: "" });
    setCurrentUser(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role?.name || "user",
    });
    setShowEditModal(true);
  };

  const handleOpenActivate = (user) => {
    setCurrentUser(user);
    setShowActivateModal(true);
  };

  const handleOpenDeactivate = (user) => {
    setCurrentUser(user);
    setShowDeactivateModal(true);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      toast.error("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      await registerUser(formData);
      toast.success("User created successfully!");
      closeAllModals();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!currentUser?._id) {
      toast.error("Invalid user selected.");
      return;
    }
    setSubmitting(true);
    try {
      await updateUser(currentUser._id, formData);
      toast.success("User updated successfully!");
      closeAllModals();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitActivate = async (e) => {
    e.preventDefault();
    if (!currentUser?._id) {
      toast.error("No user selected for activation.");
      return;
    }
    setSubmitting(true);
    try {
      await activateUser(currentUser._id);
      toast.success(`User "${currentUser.name}" activated successfully!`);
      closeAllModals();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to activate user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDeactivate = async (e) => {
    e.preventDefault();
    if (!currentUser?._id) {
      toast.error("No user selected for deactivation.");
      return;
    }
    setSubmitting(true);
    try {
      await deactivateUser(currentUser._id);
      toast.success(`User "${currentUser.name}" deactivated successfully!`);
      closeAllModals();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to deactivate user.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="user-list-container">
        <div className="error-message">{error}</div>
        <Button onClick={fetchUsers}>Retry</Button>
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
                    <td className="user-name">
                      {user.name}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${(user.role?.name || "user").toLowerCase()}`}>
                        {user.role?.name || "User"}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })}</td>
                    <td className="actions-cell">
                      <button onClick={() => handleOpenEdit(user)} className="action-btn edit-btn" title="Edit user">
                        <FaEdit />
                      </button>

                      {!user.isActive && (
                        <button onClick={() => handleOpenActivate(user)} className="action-btn activate-btn" title="Activate user">
                          <FaCheck />
                        </button>
                      )}

                        <button onClick={() => handleOpenDeactivate(user)} className="action-btn deactivate-btn" title="Deactivate user">
                          <FaTimes />
                        </button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add User Modal */}
        <Modal open={showAddModal} title="Add New User" onClose={closeAllModals}>
          <form onSubmit={handleSubmitAdd} className="modal-form">
            <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={closeAllModals}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Creating..." : "Create User"}</button>
            </div>
          </form>
        </Modal>

        {/* Edit User Modal */}
        <Modal open={showEditModal} title="Edit User" onClose={closeAllModals}>
          <form onSubmit={handleSubmitEdit} className="modal-form">
            <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={closeAllModals}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Updating..." : "Update User"}</button>
            </div>
          </form>
        </Modal>

        {/* Activate User Modal */}
        <Modal open={showActivateModal} title="Activate User" onClose={closeAllModals}>
          <form onSubmit={handleSubmitActivate} className="modal-form">
            <p>Are you sure you want to activate <strong>{currentUser?.name}</strong>?</p>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={closeAllModals}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Activating..." : "Activate User"}</button>
            </div>
          </form>
        </Modal>

        {/* Deactivate User Modal */}
        <Modal open={showDeactivateModal} title="Deactivate User" onClose={closeAllModals}>
          <form onSubmit={handleSubmitDeactivate} className="modal-form">
            <p>Are you sure you want to deactivate <strong>{currentUser?.name}</strong>?</p>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={closeAllModals}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Deactivating..." : "Deactivate User"}</button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default UserListPage;
