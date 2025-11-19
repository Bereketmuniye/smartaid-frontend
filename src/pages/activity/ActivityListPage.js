// src/pages/activities/ActivityListPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getActivities,
  createActivity,
  updateActivity,
} from "../../services/projectService"; // Adjust path if needed
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { FaEdit, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "./ActivityListPage.css";

const ActivityListPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    responsible_person: "",
    budget_amount: "",
    status: "planned", // optional: you can add status later
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchActivities = async () => {
    try {
      setError("");
      const data = await getActivities();
      setActivities(data);
    } catch (err) {
      setError("Failed to fetch activities.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      responsible_person: "",
      budget_amount: "",
      status: "planned",
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (activity) => {
    setCurrentActivity(activity);
    setFormData({
      name: activity.name || "",
      description: activity.description || "",
      start_date: activity.start_date ? activity.start_date.split("T")[0] : "",
      end_date: activity.end_date ? activity.end_date.split("T")[0] : "",
      responsible_person: activity.responsible_person || "",
      budget_amount: activity.budget_amount || "",
      status: activity.status || "planned",
    });
    setShowEditModal(true);
  };

  const handleSubmitAdd = async () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.responsible_person.trim() ||
      !formData.budget_amount
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await createActivity(formData);
      toast.success("Activity created successfully!");
      setShowAddModal(false);
      fetchActivities();
    } catch (err) {
      toast.error("Failed to create activity");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.responsible_person.trim() ||
      !formData.budget_amount
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await updateActivity(currentActivity._id, formData);
      toast.success("Activity updated successfully!");
      setShowEditModal(false);
      fetchActivities();
    } catch (err) {
      toast.error("Failed to update activity");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="activity-list-container"><LoadingSpinner /></div>;
  if (error) return <div className="activity-list-container"><div className="error-message">{error}</div></div>;

  return (
    <>
      <Toaster position="top-right" />

      <div className="activity-list-container">
        <div className="page-header">
          <h1 className="page-title">Activities Management</h1>
          <Button onClick={handleOpenAdd} variant="primary">
            <FaPlus className="icon" /> Add New Activity
          </Button>
        </div>

        {activities.length === 0 ? (
          <div className="empty-state">
            <p>No activities found.</p>
            <Button onClick={handleOpenAdd}>Create your first activity</Button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Activity Name</th>
                  <th>Description</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Responsible</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr key={activity._id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/activities/${activity._id}`} className="activity-link">
                        {activity.name}
                      </Link>
                    </td>
                    <td className="description-cell">
                      {activity.description?.length > 60
                        ? `${activity.description.substring(0, 60)}...`
                        : activity.description || "-"}
                    </td>
                    <td>{activity.start_date ? new Date(activity.start_date).toLocaleDateString() : "-"}</td>
                    <td>{activity.end_date ? new Date(activity.end_date).toLocaleDateString() : "-"}</td>
                    <td>{activity.responsible_person || "-"}</td>
                    <td>${Number(activity.budget_amount || 0).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${activity.status || "planned"}`}>
                        {activity.status ? activity.status.charAt(0).toUpperCase() + activity.status.slice(1) : "Planned"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleOpenEdit(activity)}
                        className="action-btn edit-btn"
                        title="Edit Activity"
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
        <Modal open={showAddModal} title="Add New Activity" onClose={() => setShowAddModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }} className="modal-form">
            <input type="text" placeholder="Activity Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <textarea placeholder="Description" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required />
            <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required />
            <input type="text" placeholder="Responsible Person" value={formData.responsible_person} onChange={e => setFormData({...formData, responsible_person: e.target.value})} required />
            <input type="number" placeholder="Budget Amount" value={formData.budget_amount} onChange={e => setFormData({...formData, budget_amount: e.target.value})} required />

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Creating..." : "Create Activity"}
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal open={showEditModal} title="Edit Activity" onClose={() => setShowEditModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitEdit(); }} className="modal-form">
            <input type="text" placeholder="Activity Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <textarea placeholder="Description" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
            <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required />
            <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required />
            <input type="text" placeholder="Responsible Person" value={formData.responsible_person} onChange={e => setFormData({...formData, responsible_person: e.target.value})} required />
            <input type="number" placeholder="Budget Amount" value={formData.budget_amount} onChange={e => setFormData({...formData, budget_amount: e.target.value})} required />

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Updating..." : "Update Activity"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default ActivityListPage;