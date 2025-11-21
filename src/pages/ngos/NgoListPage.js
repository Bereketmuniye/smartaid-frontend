// src/pages/ngos/NgoListPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNGOs, createNGO, updateNGO } from "../../services/ngoService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { FaEdit, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "./NgoListPage.css";
import { useAuth } from "../../contexts/AuthContext";

const NgoListPage = () => {
  const { user } = useAuth();
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
      setNgos(data.data);
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

  const resetForm = () => setFormData({ name: "", address: "" });

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (ngo) => {
    setCurrentNgo(ngo);
    setFormData({ name: ngo.name, address: ngo.address || "" });
    setShowEditModal(true);
  };

  const handleSubmitAdd = async () => {
    if (!formData.name.trim() || !formData.address.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
        const dataToSend = {
        ...formData,
        user: user?._id,
      };
      await createNGO(dataToSend);
      toast.success("NGO created successfully!");
      setShowAddModal(false);
      fetchNgos();
    } catch (err) {
      toast.error("Failed to create NGO");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!formData.name.trim() || !formData.address.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      await updateNGO(currentNgo._id, formData);
      toast.success("NGO updated successfully!");
      setShowEditModal(false);
      fetchNgos();
    } catch (err) {
      toast.error("Failed to update NGO");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="ngo-list-container"><LoadingSpinner /></div>;
  if (error) return <div className="ngo-list-container"><div className="error-message">{error}</div></div>;

  return (
    <>
      <Toaster position="top-right" />

      <div className="ngo-list-container">
        <div className="page-header">
          <h1 className="page-title">NGOs Management</h1>
          <Button onClick={handleOpenAdd} variant="primary">
            <FaPlus className="icon" /> Add New NGO
          </Button>
        </div>

        {ngos.length === 0 ? (
          <div className="empty-state">
            <p>No NGOs found.</p>
            <Button onClick={handleOpenAdd}>Create your first NGO</Button>
          </div>
        ) : (
          <div className="table-wrapper">
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
                    <td>
                      <Link to={`/ngos/${ngo._id}`} className="ngo-link">
                        {ngo.name}
                      </Link>
                    </td>
                    <td>{ngo.address || "-"}</td>
                    <td>
                      {new Date(ngo.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </td>
                    <td>
                      <button
                        onClick={() => handleOpenEdit(ngo)}
                        className="action-btn edit-btn"
                        title="Edit NGO"
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

        {/* Add Modal */}
        <Modal open={showAddModal} title="Add New NGO" onClose={() => setShowAddModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }} className="modal-form">
            <input
              type="text"
              placeholder="NGO Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Creating..." : "Create NGO"}
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal open={showEditModal} title="Edit NGO" onClose={() => setShowEditModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitEdit(); }} className="modal-form">
            <input
              type="text"
              placeholder="NGO Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Updating..." : "Update NGO"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default NgoListPage;