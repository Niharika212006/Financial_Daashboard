// Mock financial data for the dashboard
export const mockTransactions = [
  { id: 1, date: '2024-12-20', amount: 5000, category: 'Salary', type: 'income', description: 'Monthly salary' },
  { id: 2, date: '2024-12-19', amount: 150, category: 'Food & Dining', type: 'expense', description: 'Restaurant' },
  { id: 3, date: '2024-12-18', amount: 2500, category: 'Rent', type: 'expense', description: 'Monthly rent' },
  { id: 4, date: '2024-12-17', amount: 75, category: 'Transportation', type: 'expense', description: 'Fuel' },
  { id: 5, date: '2024-12-16', amount: 200, category: 'Entertainment', type: 'expense', description: 'Movie tickets' },
  { id: 6, date: '2024-12-15', amount: 3000, category: 'Freelance', type: 'income', description: 'Project payment' },
  { id: 7, date: '2024-12-14', amount: 120, category: 'Utilities', type: 'expense', description: 'Electricity bill' },
  { id: 8, date: '2024-12-13', amount: 80, category: 'Food & Dining', type: 'expense', description: 'Groceries' },
  { id: 9, date: '2024-12-12', amount: 500, category: 'Shopping', type: 'expense', description: 'Clothes' },
  { id: 10, date: '2024-12-11', amount: 100, category: 'Health & Fitness', type: 'expense', description: 'Gym membership' },
  { id: 11, date: '2024-12-10', amount: 4000, category: 'Salary', type: 'income', description: 'Bonus' },
  { id: 12, date: '2024-12-09', amount: 250, category: 'Food & Dining', type: 'expense', description: 'Dining out' },
  { id: 13, date: '2024-12-08', amount: 60, category: 'Transportation', type: 'expense', description: 'Taxi ride' },
  { id: 14, date: '2024-12-07', amount: 300, category: 'Shopping', type: 'expense', description: 'Electronics' },
  { id: 15, date: '2024-12-06', amount: 2000, category: 'Freelance', type: 'income', description: 'Consulting work' },
  { id: 16, date: '2024-12-05', amount: 450, category: 'Entertainment', type: 'expense', description: 'Concert tickets' },
  { id: 17, date: '2024-12-04', amount: 180, category: 'Utilities', type: 'expense', description: 'Internet bill' },
  { id: 18, date: '2024-12-03', amount: 90, category: 'Food & Dining', type: 'expense', description: 'Coffee shop' },
  { id: 19, date: '2024-12-02', amount: 550, category: 'Shopping', type: 'expense', description: 'Books' },
  { id: 20, date: '2024-12-01', amount: 5000, category: 'Salary', type: 'income', description: 'Monthly salary' },
];

// Calculate balance over time for chart
export const generateBalanceTrend = (transactions) => {
  let balance = 50000; // Starting balance
  const trend = [];
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  sortedTransactions.forEach(transaction => {
    if (transaction.type === 'income') {
      balance += transaction.amount;
    } else {
      balance -= transaction.amount;
    }
    trend.push({
      date: transaction.date,
      balance: balance,
      month: new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  });
  
  return trend;
};

// Get spending by category
export const getSpendingByCategory = (transactions) => {
  const spending = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      if (!spending[transaction.category]) {
        spending[transaction.category] = 0;
      }
      spending[transaction.category] += transaction.amount;
    });
  
  return Object.entries(spending).map(([category, amount]) => ({
    category,
    amount,
    percentage: 0 // Will be calculated in component
  }));
};

// Calculate financial summary
export const calculateSummary = (transactions) => {
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  });

  return {
    totalBalance: 50000 + totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
    netChange: totalIncome - totalExpenses
  };
};

// Categories for filtering
export const CATEGORIES = [
  'Salary',
  'Freelance',
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Rent',
  'Health & Fitness',
  'All'
];

// Roles for RBAC
export const ROLES = {
  VIEWER: 'viewer',
  ADMIN: 'admin'
};
