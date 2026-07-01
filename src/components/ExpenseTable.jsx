import React from 'react';
import { Trash2, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

function ExpenseTable({
  expenses = [],
  currentPage = 0,
  totalPages = 1,
  onPageChange,
  selectedCategory,
  onCategoryChange,
  onDeleteExpense = () => {} // Default empty function if not provided
}) {

  // Extract the real array safely - handle both Page objects and plain arrays
  const expenseList = Array.isArray(expenses)
    ? expenses
    : (expenses?.content && Array.isArray(expenses.content) ? expenses.content : []);

  // Clean UI color mapping for transaction tags
  const getCategoryBadge = (category) => {
    const styles = {
      food: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      entertainment: 'bg-purple-50 text-purple-700 border-purple-100',
      utilities: 'bg-blue-50 text-blue-700 border-blue-100',
      gadgets: 'bg-amber-50 text-amber-700 border-amber-100',
      travel: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      other: 'bg-slate-50 text-slate-700 border-slate-100',
    };
    return styles[category.toLowerCase()] || styles.other;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

      {/* Table Management Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">Transactions Log</h3>

        {/* Dynamic Category Filtering Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-slate-400" />
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
            className="bg-white border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="food">Food</option>
            <option value="entertainment">Entertainment</option>
            <option value="utilities">Utilities</option>
            <option value="gadgets">Gadgets</option>
            <option value="travel">Travel</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Grid Layout Canvas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase bg-slate-50/30 tracking-wider">
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {expenseList.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-xs text-slate-400 font-medium">
                  No execution records discovered in this database scope.
                </td>
              </tr>
            ) : (
              expenseList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Description */}
                  <td className="py-3.5 px-4 font-medium text-slate-900">{item.description || item.title}</td>

                  {/* Category Badge */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getCategoryBadge(item.category)} capitalize`}>
                      {item.category}
                    </span>
                  </td>

                  {/* Formatted Date */}
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {new Date(item.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>

                  {/* Cost Figure */}
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                    ₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  {/* Delete Trigger */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this transaction?')) {
                          onDeleteExpense(item.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={currentPage === 0}
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={currentPage === totalPages - 1}
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              className="p-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseTable;