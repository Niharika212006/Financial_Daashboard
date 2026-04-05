import { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../FinanceContext';
import { CATEGORIES } from '../mockData';

export default function AddTransactionModal({ onClose }) {
  const { addTransaction, darkMode } = useFinance();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Salary',
    type: 'expense',
    amount: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.description && formData.amount) {
      addTransaction(formData);
      onClose();
    }
  };

  const cardBgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBgClass = darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300';
  const overlayBgClass = darkMode ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-40';

  return (
    <div className={`fixed inset-0 ${overlayBgClass} flex items-center justify-center z-50 p-4`}>
      <div className={`${cardBgClass} rounded-lg shadow-xl w-full max-w-md`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-xl font-bold ${textClass}`}>Add Transaction</h3>
          <button
            onClick={onClose}
            className={`${textMutedClass} hover:${textClass} transition`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Date */}
          <div>
            <label className={`${textMutedClass} text-sm font-medium block mb-2`}>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass}`}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={`${textMutedClass} text-sm font-medium block mb-2`}>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Grocery shopping"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass}`}
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className={`${textMutedClass} text-sm font-medium block mb-2`}>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass}`}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className={`${textMutedClass} text-sm font-medium block mb-2`}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass}`}
            >
              {CATEGORIES.filter(cat => cat !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className={`${textMutedClass} text-sm font-medium block mb-2`}>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBgClass}`}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 border rounded-lg transition ${
                darkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
