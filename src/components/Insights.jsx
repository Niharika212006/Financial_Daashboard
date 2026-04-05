import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFinance } from '../FinanceContext';
import { getSpendingByCategory, calculateSummary } from '../mockData';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

export default function Insights() {
  const { transactions, darkMode } = useFinance();

  const insights = useMemo(() => {
    const summary = calculateSummary(transactions);
    const spending = getSpendingByCategory(transactions);
    const income = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');

    // Get highest and lowest spending categories
    const highestCategory = spending.length > 0 ? spending.reduce((max, cat) => cat.amount > max.amount ? cat : max) : null;
    const lowestCategory = spending.length > 0 ? spending.reduce((min, cat) => cat.amount < min.amount ? cat : min) : null;

    // Calculate spending trend
    const avgDailyExpense = expenses.length > 0 ? summary.totalExpenses / Math.max(expenses.length, 1) : 0;

    // Monthly comparison (last 2 months)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return (date.getMonth() === currentMonth && date.getFullYear() === currentYear) ||
             (date.getMonth() === (currentMonth - 1) && date.getFullYear() === currentYear);
    });

    const currentMonthData = lastMonthTransactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const lastMonthData = lastMonthTransactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === (currentMonth - 1) && date.getFullYear() === currentYear;
    });

    const currentMonthExpenses = currentMonthData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpenses = lastMonthData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseChange = lastMonthExpenses > 0
      ? (((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100).toFixed(1)
      : 0;

    return {
      highestCategory,
      lowestCategory,
      avgDailyExpense,
      expenseChange,
      currentMonthExpenses,
      lastMonthExpenses,
      savingsRatio: summary.totalIncome > 0 ? ((summary.totalIncome - summary.totalExpenses) / summary.totalIncome * 100).toFixed(1) : 0,
      transactionCount: transactions.length,
      incomeCount: income.length,
      expenseCount: expenses.length
    };
  }, [transactions]);

  // Monthly comparison data for chart
  const monthlyData = [
    { month: 'Previous Month', expenses: insights.lastMonthExpenses },
    { month: 'Current Month', expenses: insights.currentMonthExpenses }
  ];

  const cardBgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';

  return (
    <div className={`${bgClass} p-6 space-y-6`}>
      <h2 className={`text-2xl font-bold ${textClass}`}>Insights</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InsightCard
          icon={<AlertCircle size={24} />}
          title="Highest Spending Category"
          value={insights.highestCategory?.category || 'N/A'}
          subtitle={insights.highestCategory ? `₹${insights.highestCategory.amount.toLocaleString()}` : 'No data'}
          color="bg-red-100 text-red-600"
          darkMode={darkMode}
        />

        <InsightCard
          icon={<TrendingUp size={24} />}
          title="Savings Ratio"
          value={`${insights.savingsRatio}%`}
          subtitle={`of income saved`}
          color="bg-green-100 text-green-600"
          darkMode={darkMode}
        />

        <InsightCard
          icon={<TrendingDown size={24} />}
          title="Monthly Expense Change"
          value={`${insights.expenseChange > 0 ? '+' : ''}${insights.expenseChange}%`}
          subtitle={insights.expenseChange > 0 ? 'Increased from last month' : 'Decreased from last month'}
          color={insights.expenseChange > 0 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}
          darkMode={darkMode}
        />

        <InsightCard
          icon={<CheckCircle size={24} />}
          title="Avg Daily Expense"
          value={`₹${Math.round(insights.avgDailyExpense).toLocaleString()}`}
          subtitle="per day"
          color="bg-blue-100 text-blue-600"
          darkMode={darkMode}
        />

        <InsightCard
          icon="📊"
          title="Total Transactions"
          value={insights.transactionCount}
          subtitle={`${insights.incomeCount} income, ${insights.expenseCount} expenses`}
          color="bg-purple-100 text-purple-600"
          darkMode={darkMode}
        />

        <InsightCard
          icon="🎯"
          title="Lowest Spending"
          value={insights.lowestCategory?.category || 'N/A'}
          subtitle={insights.lowestCategory ? `₹${insights.lowestCategory.amount.toLocaleString()}` : 'No data'}
          color="bg-indigo-100 text-indigo-600"
          darkMode={darkMode}
        />
      </div>

      {/* Monthly Comparison Chart */}
      <div className={`${cardBgClass} p-6 rounded-lg shadow-lg`}>
        <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Monthly Expense Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
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
              formatter={(value) => `₹${value.toLocaleString()}`}
            />
            <Legend />
            <Bar dataKey="expenses" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendations */}
      <div className={`${cardBgClass} p-6 rounded-lg shadow-lg`}>
        <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Recommendations</h3>
        <div className="space-y-3">
          {insights.highestCategory && (
            <RecommendationItem
              text={`Your highest spending is on ${insights.highestCategory.category}. Consider budgeting this category more strictly.`}
              darkMode={darkMode}
            />
          )}
          {insights.savingsRatio < 20 && (
            <RecommendationItem
              text={`Your savings ratio is ${insights.savingsRatio}%. Try to increase it to at least 20% for better financial health.`}
              darkMode={darkMode}
            />
          )}
          {insights.expenseChange > 10 && (
            <RecommendationItem
              text={`Your expenses have increased by ${insights.expenseChange}% compared to last month. Review your spending.`}
              darkMode={darkMode}
            />
          )}
          {insights.expenseChange <= 10 && insights.expenseChange >= -10 && (
            <RecommendationItem
              text={`Your expenses are stable month-over-month. Keep maintaining your current spending habits.`}
              darkMode={darkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function InsightCard({ icon, title, value, subtitle, color, darkMode }) {
  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textMutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`${bgClass} p-6 rounded-lg shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`${textMutedClass} text-sm font-medium`}>{title}</p>
          <p className={`text-2xl font-bold mt-2 ${textClass}`}>{value}</p>
          <p className={`text-sm mt-1 ${textMutedClass}`}>{subtitle}</p>
        </div>
        <div className={`text-3xl`}>{typeof icon === 'string' ? icon : icon}</div>
      </div>
    </div>
  );
}

function RecommendationItem({ text, darkMode }) {
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';

  return (
    <div className={`flex gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
      <span className="text-xl">💡</span>
      <p className={`text-sm ${textClass}`}>{text}</p>
    </div>
  );
}
