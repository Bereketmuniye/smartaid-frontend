// src/pages/expenses/ExpenseListPage.jsx
import React, { useState, useEffect } from "react";
import { getExpenses, createExpense, updateExpense } from "../../services/expenseService";
import { getProjects, getActivities } from "../../services/projectService";
import { getBudgets } from "../../services/budgetService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { FaEdit, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import "./ExpenseListPage.css";

const ExpenseListPage = () => {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    project: "",
    activity: "",
    budget: "",
    expense_date: "",
    amount: "",
    remaining_balance_to_spend: "",
    re_forcast: "",
    over_underspend: "",
    actual_financial_ytd: "",
    recent_financial_ytd: "",
    attachment: "",
    created_by: "",
  });

  // Fetch projects and expenses on mount
  useEffect(() => {
    const fetchProjectsAndExpenses = async () => {
      try {
        const projectsRes = await getProjects();
        setProjects(projectsRes.data);
        await fetchExpenses();
      } catch (err) {
        console.error(err);
        setError("Failed to fetch projects or expenses.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectsAndExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expenses.");
    }
  };

  const resetForm = () => {
    setFormData({
      project: "",
      activity: "",
      budget: "",
      expense_date: "",
      amount: "",
      remaining_balance_to_spend: "",
      re_forcast: "",
      over_underspend: "",
      actual_financial_ytd: "",
      recent_financial_ytd: "",
      attachment: "",
      created_by: "",
    });
    setFilteredActivities([]);
    setFilteredBudgets([]);
  };

  // When project changes, fetch activities and budgets for that project
  const handleProjectChange = async (projectId) => {
    setFormData({ ...formData, project: projectId, activity: "", budget: "" });

    try {
      const activitiesRes = await getActivities(projectId);
      setFilteredActivities(activitiesRes);
    } catch (err) {
      console.error(err);
      setFilteredActivities([]);
    }

    try {
      const budgetsRes = await getBudgets({ projectId });
      setFilteredBudgets(budgetsRes);
    } catch (err) {
      console.error(err);
      setFilteredBudgets([]);
    }
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (expense) => {
    setCurrentExpense(expense);
    setFormData({
      project: expense.project._id,
      activity: expense.activity._id,
      budget: expense.budget._id,
      expense_date: expense.expense_date,
      amount: expense.amount,
      remaining_balance_to_spend: expense.remaining_balance_to_spend,
      re_forcast: expense.re_forcast,
      over_underspend: expense.over_underspend,
      actual_financial_ytd: expense.actual_financial_ytd,
      recent_financial_ytd: expense.recent_financial_ytd,
      attachment: expense.attachment,
      created_by: expense.created_by,
    });
    handleProjectChange(expense.project._id);
    setShowEditModal(true);
  };

  const handleSubmitAdd = async () => {
    if (!formData.project || !formData.activity || !formData.budget || !formData.expense_date || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await createExpense({ ...formData, user: user._id });
      toast.success("Expense created successfully!");
      setShowAddModal(false);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!formData.project || !formData.activity || !formData.budget || !formData.expense_date || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await updateExpense(currentExpense._id, formData);
      toast.success("Expense updated successfully!");
      setShowEditModal(false);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update expense");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <Toaster position="top-right" />
      <div className="ngo-list-container">
        <div className="page-header">
          <h1 className="page-title">Expenses Management</h1>
          <Button onClick={handleOpenAdd} variant="primary">
            <FaPlus className="icon" /> Add New Expense
          </Button>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>No Expenses found.</p>
            <Button onClick={handleOpenAdd}>Create your first Expense</Button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="ngo-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project</th>
                  <th>Activity</th>
                  <th>Budget</th>
                  <th>Expense Date</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, index) => (
                  <tr key={expense._id}>
                    <td>{index + 1}</td>
                    <td>{expense.project?.name || "-"}</td>
                    <td>{expense.activity?.name || "-"}</td>
                    <td>{expense.budget?.name || "-"}</td>
                    <td>{expense.expense_date}</td>
                    <td>{expense.amount}</td>
                    <td>
                      <button onClick={() => handleOpenEdit(expense)} className="action-btn edit-btn">
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
        <Modal open={showAddModal} title="Add New Expense" onClose={() => setShowAddModal(false)}>
          <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }}>
            <select value={formData.project} onChange={(e) => handleProjectChange(e.target.value)} required>
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <select value={formData.activity} onChange={(e) => setFormData({ ...formData, activity: e.target.value })} required>
              <option value="">Select Activity</option>
              {filteredActivities.map((a) => (
                <option key={a._id} value={a._id}>{a.name}</option>
              ))}
            </select>

            <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} required>
              <option value="">Select Budget</option>
              {filteredBudgets.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>

            <input type="date" value={formData.expense_date} onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })} required />
            <input type="number" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
            <input type="text" placeholder="Remaining Balance" value={formData.remaining_balance_to_spend} onChange={(e) => setFormData({ ...formData, remaining_balance_to_spend: e.target.value })} />
            <input type="text" placeholder="Attachment" value={formData.attachment} onChange={(e) => setFormData({ ...formData, attachment: e.target.value })} />

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Creating..." : "Create Expense"}</button>
            </div>
          </form>
        </Modal>

        {/* Edit Modal */}
        <Modal open={showEditModal} title="Edit Expense" onClose={() => setShowEditModal(false)}>
          <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSubmitEdit(); }}>
            <select value={formData.project} onChange={(e) => handleProjectChange(e.target.value)} required>
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <select value={formData.activity} onChange={(e) => setFormData({ ...formData, activity: e.target.value })} required>
              <option value="">Select Activity</option>
              {filteredActivities.map((a) => (
                <option key={a._id} value={a._id}>{a.name}</option>
              ))}
            </select>

            <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} required>
              <option value="">Select Budget</option>
              {filteredBudgets.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>

            <input type="date" value={formData.expense_date} onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })} required />
            <input type="number" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
            <input type="text" placeholder="Remaining Balance" value={formData.remaining_balance_to_spend} onChange={(e) => setFormData({ ...formData, remaining_balance_to_spend: e.target.value })} />
            <input type="text" placeholder="Attachment" value={formData.attachment} onChange={(e) => setFormData({ ...formData, attachment: e.target.value })} />

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Updating..." : "Update Expense"}</button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default ExpenseListPage;
