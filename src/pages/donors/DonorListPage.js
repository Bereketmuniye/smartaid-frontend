// src/pages/donors/DonorListPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDonors, createDonor, updateDonor } from "../../services/donorService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { FaEdit, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "./DonorListPage.css";
import { useAuth } from "../../contexts/AuthContext";

const DonorListPage = () => {
  const { user } = useAuth();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDonor, setCurrentDonor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    level1: "",
    level2: "",
    donor_reporting_category: "",
    budget_heading: "",
    amount: "",
    donor_type: "",
    user: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDonors = async () => {
    try {
      setError("");
      const data = await getDonors();
      setDonors(data.data);
    } catch (err) {
      setError("Failed to fetch donors.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const resetForm = () => setFormData({ name: "", level1: "", level2: "", donor_reporting_category: "", budget_heading: "", amount: "", donor_type: "", user: "" });

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (donor) => {
    setCurrentDonor(donor);
    setFormData({
      name: donor.name || "",
      level1: donor.level1 || "",
      level2: donor.level2 || "",
      donor_reporting_category: donor.donor_reporting_category || "",
      budget_heading: donor.budget_heading || "",
      amount: donor.amount || "",
      donor_type: donor.donor_type || "",
      user: donor.user || "",
    });
    setShowEditModal(true);
  };

  const handleSubmitAdd = async () => {
    if (!formData.name || !formData.level1 || !formData.level2 || !formData.donor_reporting_category || !formData.budget_heading || !formData.amount || !formData.donor_type) {
      toast.error("Please fill in all fields");
      return;
    }
    if (typeof formData.name !== 'string' || typeof formData.level1 !== 'string' || typeof formData.level2 !== 'string' || typeof formData.donor_reporting_category !== 'string' || typeof formData.budget_heading !== 'string' || typeof formData.amount !== 'string' || typeof formData.donor_type !== 'string') {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      const dataToSend = {
        ...formData,
        user: user?._id,
      };
      await createDonor(dataToSend);
      toast.success("Donor created successfully!");
      setShowAddModal(false);
      fetchDonors();
    } catch (err) {
      toast.error("Failed to create donor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!formData.name.trim() || !formData.contact.trim() || !formData.donor_type.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      await updateDonor(currentDonor._id, formData);
      toast.success("Donor updated successfully!");
      setShowEditModal(false);
      fetchDonors();
    } catch (err) {
      toast.error("Failed to update donor");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="donor-list-container"><LoadingSpinner /></div>;
  if (error) return <div className="donor-list-container"><div className="error-message">{error}</div></div>;

  return (
    <>
      <Toaster position="top-right" />

      <div className="donor-list-container">
        <div className="page-header">
          <h1 className="page-title">Donors Management</h1>
          <Button onClick={handleOpenAdd} variant="primary">
            <FaPlus className="icon" /> Add New Donor
          </Button>
        </div>

        {donors.length === 0 ? (
          <div className="empty-state">
            <p>No donors found.</p>
            <Button onClick={handleOpenAdd}>Create your first donor</Button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="donor-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th style={{ width: "400px" }}>Name</th>
                  <th style={{ width: "400px" }}>Level 1</th>
                  <th style={{ width: "400px" }}>Level 2</th>
                  <th style={{ width: "400px" }}>Donor Reporting Category</th>
                  <th style={{ width: "400px" }}>Budget Heading</th>
                  <th style={{ width: "400px" }}>Amount</th>
                  <th style={{ width: "400px" }}>Type</th>
                  <th style={{ width: "400px" }}>Created At</th>
                  <th style={{ width: "400px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((donor, index) => (
                  <tr key={donor._id}>
                    <td>{index + 1}</td>
                    <td style={{ textTransform: "capitalize", width: "400px" }}>
                      <Link to={`/donors/${donor._id}`} className="donor-link">
                        {donor.name}
                      </Link>
                    </td>
                    <td style={{ textTransform: "capitalize", width: "300px" }}>{donor.level1 || "-"}</td>
                    <td style={{ textTransform: "capitalize", width: "400px" }}>{donor.level2 || "-"}</td>
                    <td style={{ textTransform: "capitalize", width: "300px" }}>{donor.donor_reporting_category || "-"}</td>
                    <td style={{ textTransform: "capitalize", width: "300px" }}>{donor.budget_heading || "-"}</td>
                    <td style={{ textTransform: "capitalize", width: "300px" }}>{donor.amount || "-"}</td>
                    <td style={{ textTransform: "capitalize", width: "300px" }}>
                      <span className={`type-badge type-${(donor.donor_type || "individual").toLowerCase()}`}>
                        {donor.donor_type ? donor.donor_type.charAt(0).toUpperCase() + donor.donor_type.slice(1) : "Individual"}
                      </span>
                    </td>
                    <td style={{ textTransform: "capitalize", width: "200px" }}>
                      {new Date(donor.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </td>
                    <td>
                      <button
                        onClick={() => handleOpenEdit(donor)}
                        className="action-btn edit-btn"
                        title="Edit Donor"
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
        <Modal open={showAddModal} title="Add New Donor" onClose={() => setShowAddModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }} className="modal-form">
            <input
              type="text"
              placeholder="Level 1"
              value={formData.level1}
              onChange={(e) => setFormData({ ...formData, level1: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Level 2"
              value={formData.level2}
              onChange={(e) => setFormData({ ...formData, level2: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Donor Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Donor Reporting Category"
              value={formData.donor_reporting_category}
              onChange={(e) => setFormData({ ...formData, donor_reporting_category: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Budget Heading"
              value={formData.budget_heading}
              onChange={(e) => setFormData({ ...formData, budget_heading: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <select
              value={formData.donor_type}
              onChange={(e) => setFormData({ ...formData, donor_type: e.target.value })}
              required
            >
              <option value="">Select Donor Type</option>
              <option value="individual">Individual</option>
              <option value="corporate">Corporate</option>
              <option value="foundation">Foundation</option>
              <option value="government">Government</option>
              <option value="other">Other</option>
            </select>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Creating..." : "Create Donor"}
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal open={showEditModal} title="Edit Donor" onClose={() => setShowEditModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitEdit(); }} className="modal-form">
            <input
              type="text"
              placeholder="User"
              value={formData.user}
              onChange={(e) => setFormData({ ...formData, user: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Level 1"
              value={formData.level1}
              onChange={(e) => setFormData({ ...formData, level1: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Level 2"
              value={formData.level2}
              onChange={(e) => setFormData({ ...formData, level2: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Donor Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Donor Reporting Category"
              value={formData.donor_reporting_category}
              onChange={(e) => setFormData({ ...formData, donor_reporting_category: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Budget Heading"
              value={formData.budget_heading}
              onChange={(e) => setFormData({ ...formData, budget_heading: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <select
              value={formData.donor_type}
              onChange={(e) => setFormData({ ...formData, donor_type: e.target.value })}
              required
            >
              <option value="">Select Donor Type</option>
              <option value="individual">Individual</option>
              <option value="corporate">Corporate</option>
              <option value="foundation">Foundation</option>
              <option value="government">Government</option>
              <option value="other">Other</option>
            </select>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Updating..." : "Update Donor"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default DonorListPage;