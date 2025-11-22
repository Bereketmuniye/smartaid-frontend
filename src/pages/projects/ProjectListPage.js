// src/pages/projects/ProjectListPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getProjects,
  createProject,
  updateProject,
  createActivity,
} from "../../services/projectService";
import { getDonors } from "../../services/donorService";
import { getUsers } from "../../services/userService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { getBudgets, createBudget } from "../../services/budgetService";
import {
  FaEdit,
  FaPlus,
  FaProjectDiagram,
  FaMoneyBill,
  FaCalendarAlt,
  FaUserTie,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "./ProjectListPage.css";

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [donors, setDonors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [projectForm, setProjectForm] = useState({
    name: "",
    project_code: "",
    project_number: "",
    theme: "",
    type_of_fund: "",
    financial_year: "",
    description: "",
    start_date: "",
    end_date: "",
    total_budget: "",
    donor_currency: "USD",
    current_value_in_donor_currency: "",
    status: "active",
    donor: "",
    user: "",
  });

  const [activityForm, setActivityForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    total_budget: "",
    responsible_person: "",
  });

  const [budgetForm, setBudgetForm] = useState({
    project_id: "",
    budget_line_code: "",
    budget_line_name: "",
    budget_line_amount: "",
    budget_line_description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proj, donorData, userData] = await Promise.all([
          getProjects(),
          getDonors(),
          getUsers(),
        ]);
        setProjects(Array.isArray(proj) ? proj : (proj?.data || []));
        setDonors(donorData.data);
        setUsers(userData);
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetProjectForm = () => {
    setProjectForm({
      name: "", project_code: "", project_number: "", theme: "", type_of_fund: "",
      financial_year: "", description: "", start_date: "", end_date: "", total_budget: "",
      donor_currency: "USD", current_value_in_donor_currency: "", status: "active",
      donor: "", user: "",
    });
  };

  const openEdit = (project) => {
    setCurrentProject(project);
    setProjectForm({
      ...project,
      donor: project.donor?._id || "",
      user: project.user?._id || "",
      financial_year: project.financial_year?.split("T")[0] || "",
      start_date: project.start_date?.split("T")[0] || "",
      end_date: project.end_date?.split("T")[0] || "",
    });
    setShowEditModal(true);
  };

  const handleSubmitProject = async (isEdit = false) => {
    const required = ["name", "project_code", "project_number", "theme", "donor", "user", "total_budget", "start_date"];
    if (required.some(f => !projectForm[f])) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateProject(currentProject._id, projectForm);
        toast.success("Project updated!");
        setShowEditModal(false);
      } else {
        await createProject(projectForm);
        toast.success("Project created!");
        setShowAddModal(false);
      }
      const proj = await getProjects();
      setProjects(Array.isArray(proj) ? proj : (proj?.data || []));
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddActivity = async () => {
    if (Object.values(activityForm).some(v => !v)) {
      toast.error("All activity fields required");
      return;
    }
    try {
      await createActivity({ ...activityForm, project: currentProject._id });
      toast.success("Activity added");
      setActivityForm({ name: "", description: "", start_date: "", end_date: "", total_budget: "", responsible_person: "" });
      const proj = await getProjects();
      setProjects(Array.isArray(proj) ? proj : (proj?.data || []));
    } catch (err) {
      toast.error("Failed to add activity");
    }
  };

  const handleAddBudget = async () => {
    if (!budgetForm.budget_line_code || !budgetForm.budget_line_name || !budgetForm.budget_line_amount || !budgetForm.budget_line_description || +budgetForm.budget_line_amount <= 0) {
      toast.error("Valid category and amount required");
      return;
    }

    const budgets = await getBudgets(currentProject._id);
    const newTotal = budgets.reduce((s, b) => s + +b.budget_line_amount, 0) + +budgetForm.budget_line_amount;

    if (newTotal > currentProject.total_budget) {
      toast.error(`Cannot exceed total budget (${currentProject.total_budget.toLocaleString()} ${currentProject.donor_currency})`);
      return;
    }

    try {
      await createBudget({ ...budgetForm, project_id: currentProject._id });
      toast.success("Budget added");
      setBudgetForm({ project_id: "", budget_line_code: "", budget_line_name: "", budget_line_amount: "", budget_line_description: "" });
      const proj = await getProjects();
      setProjects(Array.isArray(proj) ? proj : (proj?.data || []));
    } catch (err) {
      toast.error("Failed to add budget");
    }
  };

  const threeColumnGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginBottom: "1.5rem"
  };

  if (loading) return <div className="project-list-container"><LoadingSpinner /></div>;

  return (
    <>
      <Toaster position="top-right" />

      <div className="project-list-container">
        <div className="page-header">
          <h1 className="page-title">Projects Management</h1>
          <Button onClick={() => { resetProjectForm(); setShowAddModal(true); }} variant="primary">
            <FaPlus className="icon" /> Add New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <p>No projects found.</p>
            <Button onClick={() => { resetProjectForm(); setShowAddModal(true); }}>Create your first project</Button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="project-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project Name</th>
                  <th>Donor</th>
                  <th>Code / Number</th>
                  <th>Currency</th>
                  <th>Activities</th>
                  <th>Budget</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr key={p._id}>
                    <td>{i + 1}</td>
                    <td style={{ width: "300px" }}>
                      <Link to={`/projects/${p._id}`} className="project-link">
                        {p.name}
                      </Link>
                      <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "4px" }}>
                        {p.theme}
                      </div>
                    </td>
                    <td style={{ width: "300px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaUserTie style={{ color: "#666" }} />
                        {p.donor?.name || "N/A"}
                      </div>
                    </td>
                    <td>
                      <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                        {p.project_code}
                      </code>
                      <br />
                      <small style={{ color: "#666" }}>#{p.project_number}</small>
                    </td>
                    <td>
                      <div style={{ fontWeight: "600", color: "#16a34a" }}>
                        {Number(p.current_value_in_donor_currency).toLocaleString()} {p.donor_currency}
                      </div>
                      <small style={{ color: "#666" }}>
                        Total: {Number(p.total_budget).toLocaleString()} {p.donor_currency}
                      </small>
                    </td>
                    <td style={{ width: "250px" }}> 
                      {p.activities && p.activities.length > 0 ? (
                        <div style={{ fontSize: "0.9rem" }}>
                          {p.activities.map((a, idx) => (
                            <div key={a._id} style={{ marginBottom: idx < p.activities.length - 1 ? "6px" : 0 }}>
                              <strong style={{ color: "#16a34a" }}>
                                {a.name}
                              </strong>{" "}
                              <small style={{ color: "#666" }}>
                                {a.budget_amount} {p.donor_currency}
                              </small>
                            </div>
                          ))}
                          {p.activities.length > 1 && (
                            <div style={{ marginTop: "8px", fontSize: "0.85rem", color: "#999" }}>
                              + {p.activities.length - 1} more lines
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: "#999", fontStyle: "italic" }}>No activities yet</span>
                      )}
                    </td>
                     <td style={{ width: "250px" }}> 
                      {p.budgets && p.budgets.length > 0 ? (
                        <div style={{ fontSize: "0.9rem" }}>
                          {p.budgets.map((b, idx) => (
                            <div key={b._id} style={{ marginBottom: idx < p.budgets.length - 1 ? "6px" : 0 }}>
                              <strong style={{ color: "#16a34a" }}>
                                {Number(b.budget_line_amount).toLocaleString()}
                              </strong>{" "}
                              {p.donor_currency} <br />
                              <small style={{ color: "#666" }}>
                                {b.budget_line_code} - {b.budget_line_name}
                              </small>
                            </div>
                          ))}
                          {p.budgets.length > 1 && (
                            <div style={{ marginTop: "8px", fontSize: "0.85rem", color: "#999" }}>
                              + {p.budgets.length - 1} more lines
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: "#999", fontStyle: "italic" }}>No budget lines yet</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
                        <FaCalendarAlt style={{ color: "#666" }} />
                        {new Date(p.start_date).toLocaleDateString()}
                      </div>
                      → {p.end_date ? new Date(p.end_date).toLocaleDateString() : "Ongoing"}
                    </td>
                   
                    <td style={{ fontSize: "0.9rem", padding: "8px"}}>
                      <span className={`status-badge status-${p.status.toLowerCase().replace(" ", "")}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => openEdit(p)} className="action-btn edit-btn" title="Edit">
                          <FaEdit />
                        </button>
                        <button onClick={() => { setCurrentProject(p); setShowActivityModal(true); }} className="action-btn activity-btn" title="Activities">
                          <FaProjectDiagram />
                        </button>
                        <button onClick={() => { setCurrentProject(p); setShowBudgetModal(true); }} className="action-btn budget-btn" title="Budgets">
                          <FaMoneyBill />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal open={showAddModal} title="Add New Project" onClose={() => setShowAddModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitProject(false); }} className="modal-form">
            
            <div style={threeColumnGridStyle}>
              
              <div>
                <label className="input-label">Project Name *</label>
                <input type="text" placeholder="Name" value={projectForm.name} onChange={e => setProjectForm({ ...projectForm, name: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Project Code *</label>
                <input type="text" placeholder="Code" value={projectForm.project_code} onChange={e => setProjectForm({ ...projectForm, project_code: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Project Number *</label>
                <input type="text" placeholder="Number" value={projectForm.project_number} onChange={e => setProjectForm({ ...projectForm, project_number: e.target.value })} required />
              </div>

              <div>
                <label className="input-label">Theme *</label>
                <input type="text" placeholder="Theme" value={projectForm.theme} onChange={e => setProjectForm({ ...projectForm, theme: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Donor *</label>
                <select value={projectForm.donor} onChange={e => setProjectForm({ ...projectForm, donor: e.target.value })} required>
                  <option value="">Select Donor</option>
                  {donors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Project Manager *</label>
                <select value={projectForm.user} onChange={e => setProjectForm({ ...projectForm, user: e.target.value })} required>
                  <option value="">Select Manager</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name || u.email}</option>)}
                </select>
              </div>

              <div>
                <label className="input-label">Type of Fund *</label>
                <input type="text" placeholder="Type of Fund" value={projectForm.type_of_fund} onChange={e => setProjectForm({ ...projectForm, type_of_fund: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Financial Year *</label>
                <input type="date" value={projectForm.financial_year} onChange={e => setProjectForm({ ...projectForm, financial_year: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Donor Amount</label>
                <input type="number" placeholder="Amount" value={projectForm.current_value_in_donor_currency} onChange={e => setProjectForm({ ...projectForm, current_value_in_donor_currency: e.target.value })} />
              </div>

              <div>
                <label className="input-label">Currency</label>
                <select value={projectForm.donor_currency} onChange={e => setProjectForm({ ...projectForm, donor_currency: e.target.value })}>
                  <option>USD</option><option>EUR</option><option>GBP</option><option>ETB</option>
                </select>
              </div>
              <div>
                <label className="input-label">Start Date *</label>
                <input type="date" value={projectForm.start_date} onChange={e => setProjectForm({ ...projectForm, start_date: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">End Date</label>
                <input type="date" value={projectForm.end_date} onChange={e => setProjectForm({ ...projectForm, end_date: e.target.value })} />
              </div>

              <div>
                <label className="input-label">Total Budget ({projectForm.donor_currency}) *</label>
                <input type="number" placeholder="Total Budget" value={projectForm.total_budget} onChange={e => setProjectForm({ ...projectForm, total_budget: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Status</label>
                <select value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="Pipeline">Pipeline</option>
                  <option value="Closed">Closed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Draft">Draft</option>
                  <option value="Archieved">Archived</option>
                </select>
              </div>
               <div></div> 
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label className="input-label">Description *</label>
              <textarea 
                placeholder="Enter project details..." 
                rows={4} 
                value={projectForm.description} 
                onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} 
                required 
                style={{ width: "100%" }}
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </Modal>

        <Modal open={showEditModal} title="Edit Project" onClose={() => setShowEditModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitProject(true); }} className="modal-form">
            
            <div style={threeColumnGridStyle}>
               <div>
                <label className="input-label">Project Name *</label>
                <input type="text" value={projectForm.name} onChange={e => setProjectForm({ ...projectForm, name: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Project Code *</label>
                <input type="text" value={projectForm.project_code} onChange={e => setProjectForm({ ...projectForm, project_code: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Project Number *</label>
                <input type="text" value={projectForm.project_number} onChange={e => setProjectForm({ ...projectForm, project_number: e.target.value })} required />
              </div>

              <div>
                <label className="input-label">Theme *</label>
                <input type="text" value={projectForm.theme} onChange={e => setProjectForm({ ...projectForm, theme: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Donor *</label>
                <select value={projectForm.donor} onChange={e => setProjectForm({ ...projectForm, donor: e.target.value })} required>
                  <option value="">Select Donor</option>
                  {donors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Project Manager *</label>
                <select value={projectForm.user} onChange={e => setProjectForm({ ...projectForm, user: e.target.value })} required>
                  <option value="">Select Manager</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name || u.email}</option>)}
                </select>
              </div>

              <div>
                <label className="input-label">Type of Fund *</label>
                <input type="text" value={projectForm.type_of_fund} onChange={e => setProjectForm({ ...projectForm, type_of_fund: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Financial Year *</label>
                <input type="date" value={projectForm.financial_year} onChange={e => setProjectForm({ ...projectForm, financial_year: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Donor Amount</label>
                <input type="number" value={projectForm.current_value_in_donor_currency} onChange={e => setProjectForm({ ...projectForm, current_value_in_donor_currency: e.target.value })} />
              </div>

              <div>
                <label className="input-label">Currency</label>
                <select value={projectForm.donor_currency} onChange={e => setProjectForm({ ...projectForm, donor_currency: e.target.value })}>
                  <option>USD</option><option>EUR</option><option>GBP</option><option>ETB</option>
                </select>
              </div>
              <div>
                <label className="input-label">Start Date *</label>
                <input type="date" value={projectForm.start_date} onChange={e => setProjectForm({ ...projectForm, start_date: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">End Date</label>
                <input type="date" value={projectForm.end_date} onChange={e => setProjectForm({ ...projectForm, end_date: e.target.value })} />
              </div>

              <div>
                <label className="input-label">Total Budget ({projectForm.donor_currency}) *</label>
                <input type="number" value={projectForm.total_budget} onChange={e => setProjectForm({ ...projectForm, total_budget: e.target.value })} required />
              </div>
              <div>
                <label className="input-label">Status</label>
                <select value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="Pipeline">Pipeline</option>
                  <option value="Closed">Closed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Draft">Draft</option>
                  <option value="Archieved">Archived</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label className="input-label">Description *</label>
              <textarea 
                rows={4} 
                value={projectForm.description} 
                onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} 
                required 
                style={{ width: "100%" }}
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Updating..." : "Update Project"}
              </button>
            </div>
          </form>
        </Modal>

        <Modal open={showActivityModal} title={`Activities - ${currentProject?.name}`} onClose={() => setShowActivityModal(false)}>
          <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {currentProject?.activities?.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ marginBottom: "0.5rem" }}>Existing Activities</h4>
                {currentProject.activities.map(a => (
                  <div key={a._id} className="activity-item">
                    <strong>{a.name}</strong>
                  </div>
                ))}
              </div>
            )}
            <h4>Add New Activity</h4>
            <form onSubmit={(e) => { e.preventDefault(); handleAddActivity(); }} className="modal-form">
              <input type="text" placeholder="Name *" value={activityForm.name} onChange={e => setActivityForm({ ...activityForm, name: e.target.value })} required />
              <textarea placeholder="Description *" rows={3} value={activityForm.description} onChange={e => setActivityForm({ ...activityForm, description: e.target.value })} required />
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", margin: "1rem 0" }}>
                <input type="date" value={activityForm.start_date} onChange={e => setActivityForm({ ...activityForm, start_date: e.target.value })} required />
                <input type="date" value={activityForm.end_date} onChange={e => setActivityForm({ ...activityForm, end_date: e.target.value })} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <input type="number" placeholder="Budget" value={activityForm.total_budget} onChange={e => setActivityForm({ ...activityForm, total_budget: e.target.value })} required />
                <select value={activityForm.responsible_person} onChange={e => setActivityForm({ ...activityForm, responsible_person: e.target.value })} required>
                  <option value="">Responsible Person</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name || u.email}</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowActivityModal(false)}>Close</button>
                <button type="submit" className="btn-primary">Add Activity</button>
              </div>
            </form>
          </div>
        </Modal>

        <Modal open={showBudgetModal} title={`Budget - ${currentProject?.name}`} onClose={() => setShowBudgetModal(false)}>
          <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <div className="budget-summary">
              <strong>Total Budget:</strong> {currentProject?.total_budget?.toLocaleString()} {currentProject?.donor_currency}
            </div>
            {currentProject?.budgets?.length > 0 && (
              <div className="existing-budgets" style={{ marginBottom: "1.5rem" }}>
                {currentProject.budgets.map(b => (
                  <div key={b._id} className="budget-line">
                    <span>{b.budget_line_name}</span>
                    <span>{Number(b.budget_line_amount).toLocaleString()} {currentProject?.donor_currency}</span>
                  </div>
                ))}
              </div>
            )}
            <h4>Add Budget Category</h4>
            <form onSubmit={(e) => { e.preventDefault(); handleAddBudget(); }} className="modal-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <input type="text" placeholder="budget line code" value={budgetForm.budget_line_code} onChange={e => setBudgetForm({ ...budgetForm, budget_line_code: e.target.value })} required />
                <input type="text" placeholder="budget line name" value={budgetForm.budget_line_name} onChange={e => setBudgetForm({ ...budgetForm, budget_line_name: e.target.value })} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <input type="number" placeholder="budget line amount" value={budgetForm.budget_line_amount} onChange={e => setBudgetForm({ ...budgetForm, budget_line_amount: e.target.value })} required />
                <input type="text" placeholder="budget line description" value={budgetForm.budget_line_description} onChange={e => setBudgetForm({ ...budgetForm, budget_line_description: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowBudgetModal(false)}>Close</button>
                <button type="submit" className="btn-primary">Add Category</button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ProjectListPage;