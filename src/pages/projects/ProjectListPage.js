// src/pages/projects/ProjectListPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getProjects,
  createProject,
  updateProject,
  createActivity,
  createBudget,
  getBudgets,
} from "../../services/projectService";
import { getNGOs } from "../../services/ngoService";
import { getUsers } from "../../services/userService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { FaEdit, FaPlus, FaProjectDiagram, FaMoneyBill } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "./ProjectListPage.css";

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const [currentProject, setCurrentProject] = useState(null);

  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    total_budget: "",
    status: "active",
    ngo: "",
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
    category: "",
    allocated_amount: "",
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

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchNgos();
    fetchUsers();
  }, []);

  const resetProjectForm = () => {
    setProjectForm({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      total_budget: "",
      status: "active",
      ngo: "",
    });
  };

  const resetActivityForm = () => {
    setActivityForm({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      total_budget: "",
      responsible_person: "",
    });
  };

  const resetBudgetForm = () => {
    setBudgetForm({
      category: "",
      allocated_amount: "",
    });
  };

  const handleOpenAdd = () => {
    resetProjectForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (project) => {
    setCurrentProject(project);
    setProjectForm({
      name: project.name,
      description: project.description || "",
      start_date: project.start_date.split("T")[0],
      end_date: project.end_date ? project.end_date.split("T")[0] : "",
      total_budget: project.total_budget,
      status: project.status,
      ngo: project.ngo?._id || "",
    });
    setShowEditModal(true);
  };

  const handleOpenActivities = (project) => {
    setCurrentProject(project);
    resetActivityForm();
    setShowActivityModal(true);
  };

  const handleOpenBudgets = (project) => {
    setCurrentProject(project);
    resetBudgetForm();
    setShowBudgetModal(true);
  };

  const handleSubmitProject = async (isEdit = false) => {
    const required = ["name", "description", "start_date", "end_date", "total_budget", "ngo"];
    if (required.some(field => !projectForm[field])) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateProject(currentProject._id, projectForm);
        toast.success("Project updated successfully!");
        setShowEditModal(false);
      } else {
        await createProject(projectForm);
        toast.success("Project created successfully!");
        setShowAddModal(false);
      }
      fetchProjects();
    } catch (err) {
      toast.error(`Failed to ${isEdit ? "update" : "create"} project`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitActivity = async () => {
    const required = ["name", "description", "start_date", "end_date", "total_budget", "responsible_person"];
    if (required.some(field => !activityForm[field])) {
      toast.error("Please fill all required activity fields");
      return;
    }

    setSubmitting(true);
    try {
      await createActivity({
        ...activityForm,
        project: currentProject._id,
      });
      toast.success("Activity created successfully!");
      resetActivityForm();
      fetchProjects();
    } catch (err) {
      toast.error("Failed to create activity");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitBudget = async () => {
    const required = ["category", "allocated_amount"];
    if (required.some(field => !budgetForm[field])) {
      toast.error("Please fill all required budget fields");
      return;
    }
    if (budgetForm.allocated_amount <= 0) {
      toast.error("Allocated amount must be greater than 0");
      return;
    }
    if (budgetForm.category === "") {
      toast.error("Category is required");
      return;
    }
    if (budgetForm.allocated_amount > currentProject.total_budget) {
      toast.error("Allocated amount cannot exceed project budget");
      return;
    }
    const existingBudgets = await getBudgets({ projectId: currentProject._id });
    if (!Array.isArray(existingBudgets)) {  
      toast.error("Failed to get existing budgets");
      return;
    }
    const existingBudgetAmount = existingBudgets.reduce((sum, budget) => sum + budget.allocated_amount, 0);
    if (existingBudgetAmount + budgetForm.allocated_amount > currentProject.total_budget) {
      toast.error("Total allocated amount cannot exceed project budget");
      return;
    }

    setSubmitting(true);
    try {
      await createBudget({
        ...budgetForm,
        project: currentProject._id,
      });
      toast.success("Budget created successfully!");
      resetBudgetForm();
      fetchProjects();
    } catch (err) {
      toast.error("Failed to create budget");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="project-list-container"><LoadingSpinner /></div>;
  if (error) return <div className="project-list-container"><div className="error-message">{error}</div></div>;

  return (
    <>
      <Toaster position="top-right" />

      <div className="project-list-container">
        <div className="page-header">
          <h1 className="page-title">Projects Management</h1>
          <Button onClick={handleOpenAdd} variant="primary">
            <FaPlus className="icon" /> Add New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <p>No projects found.</p>
            <Button onClick={handleOpenAdd}>Create your first project</Button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="project-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th style={{ minWidth: "150px" }}>Project Name</th>
                  <th style={{ minWidth: "100px" }}>NGO</th>
                  <th style={{ minWidth: "200px" }}>Activities</th>
                  <th style={{ minWidth: "250px" }}>Budget Breakdown</th>
                  <th style={{ minWidth: "100px" }}>Dates</th>
                  <th style={{ width: "100px" }}>Status</th>
                  <th style={{ minWidth: "140px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={project._id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/projects/${project._id}`} className="project-link" style={{ fontWeight: "bold", color: "#3b82f6" }}>
                        {project.name}
                      </Link>
                    </td>
                    <td>{project.ngo?.name || "N/A"}</td>
                    
                    <td style={{ verticalAlign: "top" }}>
                      {project.activities?.length > 0 ? (
                        <ul style={{ paddingLeft: "15px", margin: 0, fontSize: "0.9rem" }}>
                          {project.activities.map(a => (
                            <li key={a._id} style={{ marginBottom: "4px" }}>{a.name}</li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ color: "#999" }}>-</span>
                      )}
                    </td>

                    <td style={{ verticalAlign: "top" }}>
                      <div style={{ 
                        fontWeight: "700", 
                        fontSize: "14px", 
                        color: "#27ae60",
                        marginBottom: "8px" 
                      }}>
                        Total: {Number(project.total_budget).toLocaleString()} ETB
                      </div>

                      {project.budgets?.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                          {project.budgets.map((b) => (
                            <div
                              key={b._id}
                              style={{
                                background: "#f8f9fa",
                                padding: "6px 10px",
                                borderRadius: "4px",
                                border: "1px solid #e9ecef",
                                fontSize: "12px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                              }}
                            >
                              <span style={{ fontWeight: 500, color: "#555" }}>{b.category}</span>
                              <span style={{ fontWeight: 600, color: "#333" }}>
                                {Number(b.allocated_amount).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#9e9e9e", fontStyle: "italic" }}>
                          No category breakdown
                        </span>
                      )}
                    </td>

                    <td style={{ fontSize: "0.9rem" }}>
                      <div style={{ marginBottom: "4px" }}>
                        <small style={{ color: "#777" }}>Start:</small><br/>
                        {new Date(project.start_date).toLocaleDateString()}
                      </div>
                      <div>
                        <small style={{ color: "#777" }}>End:</small><br/>
                        {project.end_date ? new Date(project.end_date).toLocaleDateString() : "-"}
                      </div>
                    </td>


                    <td>
                      <span className={`status-badge status-${project.status}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </td>
                    
                    <td className="actions-cell">
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="action-btn edit-btn"
                          title="Edit Project"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleOpenActivities(project)}
                          className="action-btn activity-btn"
                          title="Manage Activities"
                        >
                          <FaProjectDiagram />
                        </button>
                        <button
                          onClick={() => handleOpenBudgets(project)}
                          className="action-btn budget-btn"
                          title="Manage Budgets"
                        >
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
            <input type="text" placeholder="Project Name" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} required />
            <textarea placeholder="Description" rows={4} value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} required />
            <input type="date" value={projectForm.start_date} onChange={e => setProjectForm({...projectForm, start_date: e.target.value})} required />
            <input type="date" value={projectForm.end_date} onChange={e => setProjectForm({...projectForm, end_date: e.target.value})} required />
            <input type="number" placeholder="Total Budget" value={projectForm.total_budget} onChange={e => setProjectForm({...projectForm, total_budget: e.target.value})} required />
            <select value={projectForm.ngo} onChange={e => setProjectForm({...projectForm, ngo: e.target.value})} required>
              <option value="">Select NGO</option>
              {ngos.map(ngo => (
                <option key={ngo._id} value={ngo._id}>{ngo.name}</option>
              ))}
            </select>
            <select value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>

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
            <input type="text" placeholder="Project Name" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} required />
            <textarea placeholder="Description" rows={4} value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} required />
            <input type="date" value={projectForm.start_date} onChange={e => setProjectForm({...projectForm, start_date: e.target.value})} required />
            <input type="date" value={projectForm.end_date} onChange={e => setProjectForm({...projectForm, end_date: e.target.value})} required />
            <input type="number" placeholder="Total Budget" value={projectForm.total_budget} onChange={e => setProjectForm({...projectForm, total_budget: e.target.value})} required />
            <select value={projectForm.ngo} onChange={e => setProjectForm({...projectForm, ngo: e.target.value})} required>
              <option value="">Select NGO</option>
              {ngos.map(ngo => (
                <option key={ngo._id} value={ngo._id}>{ngo.name}</option>
              ))}
            </select>
            <select value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Updating..." : "Update Project"}
              </button>
            </div>
          </form>
        </Modal>

        <Modal open={showActivityModal} title={`Activities - ${currentProject?.name || ""}`} onClose={() => setShowActivityModal(false)}>
          <div className="activities-container">
            {currentProject?.activities && currentProject.activities.length > 0 && (
              <div className="existing-activities">
                <h4>Existing Activities:</h4>
                <ul>
                  {currentProject.activities.map(act => (
                    <li key={act._id}>{act.name}</li>
                  ))}
                </ul>
              </div>
            )}

            <h4>Add New Activity</h4>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitActivity(); }} className="modal-form">
              <input
                type="text"
                placeholder="Activity Name"
                value={activityForm.name}
                onChange={e => setActivityForm({...activityForm, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                rows={4}
                value={activityForm.description}
                onChange={e => setActivityForm({...activityForm, description: e.target.value})}
                required
              />
              <input type="date" value={activityForm.start_date} onChange={e => setActivityForm({...activityForm, start_date: e.target.value})} required />
              <input type="date" value={activityForm.end_date} onChange={e => setActivityForm({...activityForm, end_date: e.target.value})} required />
              <input type="number" placeholder="Budget" value={activityForm.total_budget} onChange={e => setActivityForm({...activityForm, total_budget: e.target.value})} required />
              
              <select
                value={activityForm.responsible_person}
                onChange={e => setActivityForm({...activityForm, responsible_person: e.target.value})}
                required
              >
                <option value="">Select Responsible Person</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name || user.email}</option>
                ))}
              </select>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowActivityModal(false)}>
                  Close
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Activity"}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        <Modal open={showBudgetModal} title={`Budgets - ${currentProject?.name || ""}`} onClose={() => setShowBudgetModal(false)}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitBudget(); }} className="modal-form">
            <input
              type="text"
              placeholder="Category"
              value={budgetForm.category}
              onChange={e => setBudgetForm({...budgetForm, category: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Allocated Amount"
              value={budgetForm.allocated_amount}
              onChange={e => setBudgetForm({...budgetForm, allocated_amount: e.target.value})}
              required
            />
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowBudgetModal(false)}>
                Close
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Creating..." : "Create Budget"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default ProjectListPage;