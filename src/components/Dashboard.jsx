import { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useFinance } from '../FinanceContext';
import { calculateSummary, generateBalanceTrend, getSpendingByCategory } from '../mockData';

// Color palette for charts
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function Dashboard() {
  const { transactions, darkMode } = useFinance();

  const summary = useMemo(() => calculateSummary(transactions), [transactions]);
  const balanceTrend = useMemo(() => generateBalanceTrend(transactions), [transactions]);
  const spendingByCategory = useMemo(() => getSpendingByCategory(transactions), [transactions]);

  const totalSpending = spendingByCategory.reduce((sum, cat) => sum + cat.amount, 0);
  const categoryDataWithPercentage = spendingByCategory.map(cat => ({
    ...cat,
    percentage: ((cat.amount / totalSpending) * 100).toFixed(1)
  }));

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`${bgClass} p-6 space-y-6`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Balance"
          amount={summary.totalBalance}
          icon="💰"
          darkMode={darkMode}
          trend={summary.netChange}
        />
        <SummaryCard
          title="Total Income"
          amount={summary.totalIncome}
          icon="📈"
          color="text-green-600"
          darkMode={darkMode}
          trend={summary.totalIncome}
        />
        <SummaryCard
          title="Total Expenses"
          amount={summary.totalExpenses}
          icon="📉"
          color="text-red-600"
          darkMode={darkMode}
          trend={-summary.totalExpenses}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Trend Chart */}
        <div className={`${cardBgClass} p-6 rounded-lg shadow-lg`}>
          <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Balance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={balanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4b5563' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#f3f4f6' : '#111827'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Spending by Category Chart */}
        <div className={`${cardBgClass} p-6 rounded-lg shadow-lg`}>
          <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDataWithPercentage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {categoryDataWithPercentage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#f3f4f6' : '#111827'
                }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className={`${cardBgClass} p-6 rounded-lg shadow-lg overflow-x-auto`}>
        <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Category Breakdown</h3>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className={`text-left py-3 px-4 font-semibold ${textClass}`}>Category</th>
              <th className={`text-right py-3 px-4 font-semibold ${textClass}`}>Amount</th>
              <th className={`text-right py-3 px-4 font-semibold ${textClass}`}>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {categoryDataWithPercentage.map((item, idx) => (
              <tr key={idx} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <td className={`py-3 px-4 ${textClass}`}>{item.category}</td>
                <td className={`text-right py-3 px-4 ${textClass}`}>₹{item.amount.toLocaleString()}</td>
                <td className={`text-right py-3 px-4 ${textMutedClass}`}>{item.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ title, amount, icon, color = 'text-blue-600', darkMode, trend }) {
  const cardBgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`${cardBgClass} p-6 rounded-lg shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`${textMutedClass} text-sm font-medium`}>{title}</p>
          <p className={`${textClass} text-3xl font-bold mt-2`}>₹{amount.toLocaleString()}</p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toLocaleString()}
            </p>
          )}
        </div>
        <div className={`${color} text-3xl`}>{icon}</div>
      </div>
    </div>
  );
}
