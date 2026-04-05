import { useState } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { useFinance } from '../FinanceContext';
import { CATEGORIES, ROLES } from '../mockData';
import AddTransactionModal from './AddTransactionModal';

export default function Transactions() {
  const {
    filterCategory,
    setFilterCategory,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    role,
    darkMode,
    getFilteredTransactions,
    deleteTransaction,
  } = useFinance();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const filteredTransactions = getFilteredTransactions();

  const cardBgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBgClass = darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300';
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';

  return (
    <div className={`${bgClass} p-6`}>
      {/* Header and Action Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${textClass}`}>Transactions</h2>
        {role === ROLES.ADMIN && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className={`${cardBgClass} p-4 rounded-lg shadow-lg mb-6 space-y-4`}>
        {/* Search Bar */}
        <div>
          <label className={`${textMutedClass} text-sm font-medium block mb-2`}>Search</label>
          <input
            type="text"
            placeholder="Search by description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass}`}
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className={`${textMutedClass} text-sm font-medium block mb-2`}>Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass}`}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className={`${textMutedClass} text-sm font-medium block mb-2`}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass}`}
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className={`${cardBgClass} rounded-lg shadow-lg overflow-x-auto`}>
        {filteredTransactions.length === 0 ? (
          <div className={`p-8 text-center ${textMutedClass}`}>
            <p className="text-lg">No transactions found</p>
            <p className="text-sm mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-100'}`}>
                <th className={`text-left py-4 px-6 font-semibold ${textClass}`}>Date</th>
                <th className={`text-left py-4 px-6 font-semibold ${textClass}`}>Description</th>
                <th className={`text-left py-4 px-6 font-semibold ${textClass}`}>Category</th>
                <th className={`text-left py-4 px-6 font-semibold ${textClass}`}>Type</th>
                <th className={`text-right py-4 px-6 font-semibold ${textClass}`}>Amount</th>
                {role === ROLES.ADMIN && <th className={`text-center py-4 px-6 font-semibold ${textClass}`}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <td className={`py-4 px-6 ${textClass}`}>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className={`py-4 px-6 ${textClass}`}>{transaction.description}</td>
                  <td className={`py-4 px-6 ${textClass}`}>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    } ${textMutedClass}`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className={`py-4 px-6 font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+ Income' : '- Expense'}
                  </td>
                  <td className={`text-right py-4 px-6 font-semibold ${textClass}`}>
                    ₹{transaction.amount.toLocaleString()}
                  </td>
                  {role === ROLES.ADMIN && (
                    <td className="py-4 px-6 text-center space-x-2">
                      <button
                        onClick={() => setEditingId(transaction.id)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                        title="Edit transaction"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                        title="Delete transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Transactions"
          value={filteredTransactions.length}
          darkMode={darkMode}
        />
        <StatCard
          label="Total Income (Filtered)"
          value={`₹${filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`}
          darkMode={darkMode}
          color="text-green-600"
        />
        <StatCard
          label="Total Expenses (Filtered)"
          value={`₹${filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`}
          darkMode={darkMode}
          color="text-red-600"
        />
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <AddTransactionModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function StatCard({ label, value, darkMode, color = '' }) {
  const cardBgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`${cardBgClass} p-4 rounded-lg shadow`}>
      <p className={`${textMutedClass} text-sm`}>{label}</p>
      <p className={`text-2xl font-bold mt-2 ${color || textClass}`}>{value}</p>
    </div>
  );
}
