import { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions, ROLES } from './mockData';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [role, setRole] = useState(ROLES.VIEWER);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // date-asc, date-desc, amount-asc, amount-desc
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Filter and sort transactions
  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    // Filter by category
    if (filterCategory !== 'All') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'amount-asc':
          return a.amount - b.amount;
        case 'amount-desc':
          return b.amount - a.amount;
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Add transaction (admin only)
  const addTransaction = (transaction) => {
    if (role === ROLES.ADMIN) {
      const newTransaction = {
        ...transaction,
        id: Math.max(...transactions.map(t => t.id), 0) + 1
      };
      setTransactions([newTransaction, ...transactions]);
      return true;
    }
    return false;
  };

  // Edit transaction (admin only)
  const editTransaction = (id, updates) => {
    if (role === ROLES.ADMIN) {
      setTransactions(transactions.map(t => (t.id === id ? { ...t, ...updates } : t)));
      return true;
    }
    return false;
  };

  // Delete transaction (admin only)
  const deleteTransaction = (id) => {
    if (role === ROLES.ADMIN) {
      setTransactions(transactions.filter(t => t.id !== id));
      return true;
    }
    return false;
  };

  const value = {
    transactions,
    role,
    setRole,
    filterCategory,
    setFilterCategory,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    darkMode,
    setDarkMode,
    getFilteredTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};
