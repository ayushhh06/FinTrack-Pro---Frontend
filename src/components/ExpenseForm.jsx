import React, { useState } from 'react';

export default function ExpenseForm({ onExpenseAdded }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('FOOD');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!description || !amount) {
      setError('Please fill in all fields');
      return;
    }

    // Match the backend Expense entity field names exactly
    const transactionPayload = {
      description: description,      // ← Changed from "title" to "description"
      amount: parseFloat(amount),     // ← Spring will auto-convert to BigDecimal
      category: category.toUpperCase(),
      date: date                      // ← Already in "yyyy-MM-dd" format
    };

    setIsSubmitting(true);
    try {
      // Pulling auth token from storage safely
      const userStr = localStorage.getItem('fintrack_user');
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.token || user?.jwt;

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('http://localhost:8080/api/expenses', {
        method: 'POST',
        headers,
        body: JSON.stringify(transactionPayload)
      });

      if (response.ok) {
        // Clear forms out cleanly
        setDescription('');
        setAmount('');
        setCategory('FOOD');
        setDate(new Date().toISOString().split('T')[0]);
        if (onExpenseAdded) onExpenseAdded();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || `Error: ${response.status} ${response.statusText}`);
        console.error("Server error response:", errorData);
      }
    } catch (error) {
      console.error("Error adding transaction to ledger:", error);
      setError('Failed to add transaction. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

      {/* Error Message Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Description Field */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Cloud Server Subscription"
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Amount & Category Side-by-Side Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Amount (INR)
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            disabled={isSubmitting}
          >
            <option value="FOOD">Food</option>
            <option value="UTILITIES">Utilities</option>
            <option value="GADGETS">Gadgets</option>
            <option value="ENTERTAINMENT">Entertainment</option>
            <option value="TRAVEL">Travel</option>
          </select>
        </div>
      </div>

      {/* Date Field */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Submit button spans nicely at the bottom */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium py-2.5 px-4 rounded-xl text-sm shadow-sm transition-colors"
      >
        {isSubmitting ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  );
}