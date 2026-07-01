import React, { useMemo } from 'react';
import { Wallet, Tag, BarChart3 } from 'lucide-react';

export default function MetricGrid({ expenses }) {

  // Extract the real array safely whether it's an array or a Spring Boot Page object
  const expenseList = useMemo(() => {
    if (!expenses) return [];
    if (Array.isArray(expenses)) return expenses;
    if (expenses.content && Array.isArray(expenses.content)) return expenses.content;
    return [];
  }, [expenses]);

  // Compute live metrics dynamically based on active data state
  const metrics = useMemo(() => {
    let totalSpend = 0;
    const categoryTotals = {};

    expenseList.forEach(exp => {
      const amt = parseFloat(exp.amount) || 0;
      totalSpend += amt;

      const cat = exp.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    });

    // Find the category with the highest total spend
    let highestCategory = 'N/A';
    let maxSpend = 0;
    Object.keys(categoryTotals).forEach(cat => {
      if (categoryTotals[cat] > maxSpend) {
        maxSpend = categoryTotals[cat];
        highestCategory = cat;
      }
    });

    return {
      total: totalSpend.toFixed(2),
      topCategory: highestCategory.toUpperCase(),
      count: expenseList.length
    };
  }, [expenseList]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">

      {/* CARD 1: TOTAL SPENT */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Expenses</p>
          <h3 className="text-2xl font-bold text-gray-800">₹{metrics.total}</h3>
          <p className="text-xs text-green-500 font-medium mt-1">Updated just now</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
          <Wallet className="w-6 h-6" />
        </div>
      </div>

      {/* CARD 2: TOP CATEGORY */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Top Category</p>
          <h3 className="text-2xl font-bold text-gray-800 truncate max-w-[180px]">{metrics.topCategory}</h3>
          <p className="text-xs text-gray-400 mt-1">Highest expenditure division</p>
        </div>
        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
          <Tag className="w-6 h-6" />
        </div>
      </div>

      {/* CARD 3: TRANSACTION COUNT */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Transaction Count</p>
          <h3 className="text-2xl font-bold text-gray-800">{metrics.count} <span className="text-sm font-medium text-gray-400">Items</span></h3>
          <p className="text-xs text-gray-400 mt-1">Active ledger records</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
          <BarChart3 className="w-6 h-6" />
        </div>
      </div>

    </div>
  );
}