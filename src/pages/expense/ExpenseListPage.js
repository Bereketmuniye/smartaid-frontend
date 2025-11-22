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
  const [allActivities, setAllActivities] = useState([]);
  const [allBudgets, setAllBudgets] = useState([]);
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
  });

  // Helper to get name by ID
  const getNameById = (list, id, nameField = "name") =>
    list.find((item) => item._id === id)?.[nameField] || "-";

  // Fetch initial data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const projectsRes = await getProjects();
        const projectsData = projectsRes.data || projectsRes;
        setProjects(projectsData);

        // Fetch all activities and budgets for mapping
        const activitiesPromises = projectsData.map((p) => getActivities(p._id));
        const budgetsPromises = projectsData.map((p) => getBudgets(p._id));

        const activitiesResults = await Promise.all(activitiesPromises);
        const budgetsResults = await Promise.all(budgetsPromises);

        setAllActivities(
          activitiesResults.flatMap((res) => (res.data || res))
        );
        setAllBudgets(
          budgetsResults.flatMap((res) => (res.data || res))
        );

        await fetchExpenses();
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses();
      setExpenses(response.data || response);
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses");
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
    });
    setFilteredActivities([]);
    setFilteredBudgets([]);
  };

  const handleProjectChange = async (projectId) => {
    setFormData((prev) => ({ ...prev, project: projectId, activity: "", budget: "" }));

    if (!projectId) {
      setFilteredActivities([]);
      setFilteredBudgets([]);
      return;
    }

    // Filter already fetched activities & budgets
    setFilteredActivities(allActivities.filter((a) => a.project === projectId));
    setFilteredBudgets(allBudgets.filter((b) => b.project === projectId));
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (expense) => {
    setCurrentExpense(expense);

    setFormData({
      project: expense.project || "",
      activity: expense.activity || "",
      budget: expense.budget || "",
      expense_date: expense.expense_date?.split("T")[0] || "",
      amount: expense.amount || "",
      remaining_balance_to_spend: expense.remaining_balance_to_spend || "",
      re_forcast: expense.re_forcast || "",
      over_underspend: expense.over_underspend || "",
      actual_financial_ytd: expense.actual_financial_ytd || "",
      recent_financial_ytd: expense.recent_financial_ytd || "",
    });

    handleProjectChange(expense.project || "");
    setShowEditModal(true);
  };

  const handleSubmitAdd = async () => {
    if (!formData.project || !formData.activity || !formData.budget || !formData.expense_date || !formData.amount) {
      toast.error("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        projectId: formData.project,
        activityId: formData.activity,
        budgetId: formData.budget,
        expense_date: formData.expense_date,
        amount: Number(formData.amount),
        remaining_balance_to_spend: Number(formData.remaining_balance_to_spend) || 0,
        re_forcast: Number(formData.re_forcast) || 0,
        over_underspend: Number(formData.over_underspend) || 0,
        actual_financial_ytd: Number(formData.actual_financial_ytd) || 0,
        recent_financial_ytd: Number(formData.recent_financial_ytd) || 0,
        created_by: user._id,
      };

      await createExpense(payload);
      toast.success("Expense created successfully!");
      setShowAddModal(false);
      resetForm();
      fetchExpenses();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!formData.project || !formData.activity || !formData.budget || !formData.expense_date || !formData.amount) {
      toast.error("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        projectId: formData.project,
        activityId: formData.activity,
        budgetId: formData.budget,
        expense_date: formData.expense_date,
        amount: Number(formData.amount),
        remaining_balance_to_spend: Number(formData.remaining_balance_to_spend) || 0,
        re_forcast: Number(formData.re_forcast) || 0,
        over_underspend: Number(formData.over_underspend) || 0,
        actual_financial_ytd: Number(formData.actual_financial_ytd) || 0,
        recent_financial_ytd: Number(formData.recent_financial_ytd) || 0,
      };

      await updateExpense(currentExpense._id, payload);
      toast.success("Expense updated successfully!");
      setShowEditModal(false);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating expense");
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
            <p>No expenses found.</p>
            <Button onClick={handleOpenAdd}>Create the first expense</Button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="ngo-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Project</th>
                  <th>Activity</th>
                  <th>Budget Line</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Remaining Balance</th>
                  <th>Re-forecast</th>
                  <th>Over/Underspend</th>
                  <th>Actual YTD</th>
                  <th>Recent YTD</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, index) => (
                  <tr key={expense._id}>
                    <td>{index + 1}</td>
                    <td>{getNameById(projects, expense.project)}</td>
                    <td>{getNameById(allActivities, expense.activity)}</td>
                    <td>{getNameById(allBudgets, expense.budget, "budget_line_name")}</td>
                    <td>{expense.expense_date?.split("T")[0] || "-"}</td>
                    <td>{expense.amount} {projects.find(p => p._id === expense.project)?.currency}</td>
                    <td>{expense.remaining_balance_to_spend}</td>
                    <td>{expense.re_forcast}</td>
                    <td>{expense.over_underspend}</td>
                    <td>{expense.actual_financial_ytd}</td>
                    <td>{expense.recent_financial_ytd}</td>
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

        {/* ADD MODAL */}
        <Modal open={showAddModal} title="Add New Expense" onClose={() => setShowAddModal(false)}>
          <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSubmitAdd(); }}>
            <select value={formData.project} onChange={(e) => handleProjectChange(e.target.value)} required>
              <option value="">Select Project</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>

            <select value={formData.activity} onChange={(e) => setFormData({ ...formData, activity: e.target.value })} required disabled={!formData.project}>
              <option value="">Select Activity</option>
              {filteredActivities.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>

            <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} required disabled={!formData.project}>
              <option value="">Select Budget Line</option>
              {filteredBudgets.map((b) => <option key={b._id} value={b._id}>{b.budget_line_name}</option>)}
            </select>

            <input type="date" value={formData.expense_date} onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })} required />
            <input type="number" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
            <input type="number" placeholder="Remaining Balance" value={formData.remaining_balance_to_spend} onChange={(e) => setFormData({ ...formData, remaining_balance_to_spend: e.target.value })} />
            <input type="number" placeholder="Re-forecast" value={formData.re_forcast} onChange={(e) => setFormData({ ...formData, re_forcast: e.target.value })} />
            <input type="number" placeholder="Over/Underspend" value={formData.over_underspend} onChange={(e) => setFormData({ ...formData, over_underspend: e.target.value })} />
            <input type="number" placeholder="Actual YTD" value={formData.actual_financial_ytd} onChange={(e) => setFormData({ ...formData, actual_financial_ytd: e.target.value })} />
            <input type="number" placeholder="Recent YTD" value={formData.recent_financial_ytd} onChange={(e) => setFormData({ ...formData, recent_financial_ytd: e.target.value })} />

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Creating..." : "Create Expense"}
              </button>
            </div>
          </form>
        </Modal>

        {/* EDIT MODAL */}
        <Modal open={showEditModal} title="Edit Expense" onClose={() => setShowEditModal(false)}>
          <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSubmitEdit(); }}>
            <select value={formData.project} onChange={(e) => handleProjectChange(e.target.value)} required>
              <option value="">Select Project</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>

            <select value={formData.activity} onChange={(e) => setFormData({ ...formData, activity: e.target.value })} required>
              <option value="">Select Activity</option>
              {filteredActivities.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>

            <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} required>
              <option value="">Select Budget Line</option>
              {filteredBudgets.map((b) => <option key={b._id} value={b._id}>{b.budget_line_name}</option>)}
            </select>

            <input type="date" value={formData.expense_date} onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })} required />
            <input type="number" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
            <input type="number" placeholder="Remaining Balance" value={formData.remaining_balance_to_spend} onChange={(e) => setFormData({ ...formData, remaining_balance_to_spend: e.target.value })} />
            <input type="number" placeholder="Re-forecast" value={formData.re_forcast} onChange={(e) => setFormData({ ...formData, re_forcast: e.target.value })} />
            <input type="number" placeholder="Over/Underspend" value={formData.over_underspend} onChange={(e) => setFormData({ ...formData, over_underspend: e.target.value })} />
            <input type="number" placeholder="Actual YTD" value={formData.actual_financial_ytd} onChange={(e) => setFormData({ ...formData, actual_financial_ytd: e.target.value })} />
            <input type="number" placeholder="Recent YTD" value={formData.recent_financial_ytd} onChange={(e) => setFormData({ ...formData, recent_financial_ytd: e.target.value })} />

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Updating..." : "Update Expense"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default ExpenseListPage;
