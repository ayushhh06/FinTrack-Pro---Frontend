import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// Distinct modern color palette matching your theme
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function FinancialCharts({ expenses }) {

  // Extract the real array safely - handle both Page objects and plain arrays
  const expenseList = useMemo(() => {
    if (!expenses) return [];
    if (Array.isArray(expenses)) return expenses;
    if (expenses.content && Array.isArray(expenses.content)) return expenses.content;
    return [];
  }, [expenses]);

  // 1. Transform raw transactions into aggregated Category Data for the Pie Chart
  const categoryData = useMemo(() => {
    const aggregates = {};
    expenseList.forEach(exp => {
      const cat = exp.category || 'Other';
      const amt = parseFloat(exp.amount) || 0;
      aggregates[cat] = (aggregates[cat] || 0) + amt;
    });

    return Object.keys(aggregates).map(key => ({
      name: key.toUpperCase(),
      value: aggregates[key]
    }));
  }, [expenseList]);

  // 2. Transform raw transactions into Date Data for the Trend Bar Chart
  const trendData = useMemo(() => {
    const aggregates = {};
    // Sort expenses chronologically to make the line/bar chart logical
    const sortedExpenses = [...expenseList].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedExpenses.forEach(exp => {
      // Formats date nicely to show days like "24 Jun" or "25 Jun"
      let formattedDate = exp.date;
      try {
        const d = new Date(exp.date);
        formattedDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      } catch (e) {}

      const amt = parseFloat(exp.amount) || 0;
      aggregates[formattedDate] = (aggregates[formattedDate] || 0) + amt;
    });

    return Object.keys(aggregates).map(key => ({
      date: key,
      amount: aggregates[key]
    }));
  }, [expenseList]);

  if (!expenseList || expenseList.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 text-center text-gray-400 my-6 shadow-sm">
        No transaction logs found to compile interactive metrics. Add an expense below to populate data charts.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto my-2">

      {/* CARD 1: CATEGORY BREAKDOWN PIE */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-gray-800 text-base font-semibold mb-2">Category Breakdown</h3>
        <p className="text-xs text-gray-400 mb-4">Distribution of total expenditure across divisions</p>
        <div className="flex-1 min-h-0" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Spent']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CARD 2: DAILY SPENDING TREND BAR */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-gray-800 text-base font-semibold mb-2">Spending History Trend</h3>
        <p className="text-xs text-gray-400 mb-4">Timeline view of daily transaction tallies</p>
        <div className="flex-1 min-h-0" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Total Outflow']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Bar dataKey="amount" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}