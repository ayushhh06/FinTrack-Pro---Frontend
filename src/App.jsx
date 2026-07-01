import React, { useState, useEffect } from 'react';
import UserIdentityHeader from './components/UserIdentityHeader';
import MetricGrid from './components/MetricGrid';
import FinancialCharts from './components/FinancialCharts';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import Login from './components/Login';

export default function App() {
  // 1. Core State Management
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fintrack_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Fetch Expenses from Spring Boot Backend
  const fetchExpenses = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const token = user.token || user.jwt || (user.data && user.data.token);

      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8080/api/expenses?page=0&size=50`, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data.content || data || []);
      } else if (response.status === 403 || response.status === 401) {
        console.warn("Session expired or unauthorized access request.");
        handleLogout();
      }
    } catch (error) {
      console.error("Failed to connect to backend ledger API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. DELETE Expense Handler - Call backend API
  const handleDeleteExpense = async (expenseId) => {
    if (!user) return;

    try {
      const token = user.token || user.jwt || (user.data && user.data.token);

      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: headers,
        credentials: 'include'
      });

      if (response.ok) {
        console.log(`Expense ${expenseId} deleted successfully`);
        // Refresh the expenses list after deletion
        fetchExpenses();
      } else if (response.status === 403 || response.status === 401) {
        console.warn("Unauthorized delete attempt");
        handleLogout();
      } else {
        console.error(`Failed to delete expense: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Trigger fetch sync on session initialization
  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  // 4. Auth Session Handlers
  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    localStorage.setItem('fintrack_user', JSON.stringify(authenticatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    setExpenses([]);
    localStorage.removeItem('fintrack_user');
  };

  // ============================
  // RENDER LEVEL A: AUTH WALL
  // ============================
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // ============================
  // RENDER LEVEL B: CLEAN DASHBOARD
  // ============================
  return (
    <div className="min-h-screen bg-gray-50 text-gray-600 antialiased flex flex-col justify-start">

      {/* Structural Row 1: Main Header Navigation Row (Rendered ONCE) */}
      <UserIdentityHeader user={user} onLogout={handleLogout} />

      {/* Structural Row 2: Live Content Body Viewport Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Module A: Realtime Data Metric Analytics Panels */}
        <MetricGrid expenses={expenses} />

        {/* Module B: Data Visualization Trend Line & Pie Charts */}
        <FinancialCharts expenses={expenses} />

        {/* Module C: Ledger Inputs Form Panel and Spreadsheet Logs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Left Panel: Clean form wrapper container */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Log Transaction</h3>
            <ExpenseForm onExpenseAdded={fetchExpenses} />
          </div>

          {/* Right Panel: Data Table Viewport */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Transactions Log</h3>
              {isLoading && <span className="text-xs text-blue-500 animate-pulse">Syncing ledger...</span>}
            </div>
            <ExpenseTable
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>

        </div>

      </main>
    </div>
  );
}