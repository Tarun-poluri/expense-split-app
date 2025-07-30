'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Users, DollarSign } from 'lucide-react';
import { setExpenses } from '../store/slices/expensesSlice';
import { mockExpenses, mockUsers } from '../utils/mockData';
import AddExpenseModal from '@/components/AddExpenseModal';
import { RootState } from '../store/store';

interface GroupDetailProps {
  group: any;
  onBack: () => void;
}

const GroupDetail = ({ group, onBack }: GroupDetailProps) => {
  const dispatch = useDispatch();
  const { expenses } = useSelector((state: RootState) => state.expenses);
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    // Load expenses for this group
    const groupExpenses = mockExpenses.filter(expense => expense.groupId === group.id);
    dispatch(setExpenses(groupExpenses));
  }, [group.id, dispatch]);

  const getMemberNames = (memberIds: string[]) => {
    return memberIds
      .map(id => mockUsers.find(user => user.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getUserName = (userId: string) => {
    return mockUsers.find(user => user.id === userId)?.name || 'Unknown';
  };

  const groupExpenses = expenses.filter(expense => expense.groupId === group.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
          <p className="text-gray-600 mt-1">
            {group.members.length} members • ${group.totalExpenses.toFixed(2)} total expenses
          </p>
        </div>
        <Button onClick={() => setShowAddExpense(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Group Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {group.members.map((memberId: string) => {
                const user = mockUsers.find(u => u.id === memberId);
                return (
                  <div key={memberId} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {user?.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm">{user?.name}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${group.totalExpenses.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {groupExpenses.length} expense{groupExpenses.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Average per Person</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${(group.totalExpenses / group.members.length).toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Split among {group.members.length} members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {groupExpenses.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
              <p className="text-gray-500 mb-4">Add your first expense to start tracking</p>
              <Button onClick={() => setShowAddExpense(true)}>Add First Expense</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {groupExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{expense.description}</h4>
                    <p className="text-sm text-gray-500">
                      Paid by {getUserName(expense.paidBy)} • 
                      Split between {getMemberNames(expense.splitBetween)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {expense.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">${expense.amount.toFixed(2)}</div>
                    <Badge variant="secondary" className="text-xs">
                      ${(expense.amount / expense.splitBetween.length).toFixed(2)} each
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        group={group}
      />
    </div>
  );
};

export default GroupDetail; 