'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addExpense } from '../store/slices/expensesSlice';
import { updateGroup } from '../store/slices/groupsSlice';
import { useCollection } from '../hooks/useFirebase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Users, Check } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: any;
}

const AddExpenseModal = ({ isOpen, onClose, group }: AddExpenseModalProps) => {
  const dispatch = useAppDispatch();
  const { addDocument: addExpenseToFirebase } = useCollection('expenses');
  const { updateDocument: updateGroupInFirebase } = useCollection('groups');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDescription('');
      setAmount('');
      setPaidBy('');
      setSplitBetween([]);
      setSelectAll(false);
    } else if (group) {
      setSplitBetween(group.members);
      setSelectAll(true);
    }
  }, [isOpen, group]);

  const handleUserToggle = (userId: string) => {
    setSplitBetween(prev => {
      const newSelection = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      setSelectAll(newSelection.length === group.members.length);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSplitBetween([]);
      setSelectAll(false);
    } else {
      setSplitBetween(group.members);
      setSelectAll(true);
    }
  };

  const handleSubmit = async () => {
    if (description.trim() && amount && paidBy && splitBetween.length > 0) {
      const expenseAmount = parseFloat(amount);
      const amountPerPerson = expenseAmount / splitBetween.length;

      const newExpense = {
        groupId: group.id,
        description: description.trim(),
        amount: expenseAmount,
        paidBy,
        splitBetween,
        amountPerPerson,
        createdAt: new Date(),
      };

      try {
        const expenseId = await addExpenseToFirebase(newExpense);
        if (expenseId) {
          dispatch(addExpense({ ...newExpense, id: expenseId }));
          const updatedGroup = {
            ...group,
            totalExpenses: group.totalExpenses + expenseAmount,
          };
          await updateGroupInFirebase(group.id, { totalExpenses: updatedGroup.totalExpenses });
          dispatch(updateGroup(updatedGroup));
          onClose();
        }
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Add Expense
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this expense for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Paid by</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger>
                <SelectValue placeholder="Who paid for this?" />
              </SelectTrigger>
              <SelectContent>
                {group.members.map((userId: string) => {
                  const user = group.membersDetails.find((u: any) => u.id === userId);
                  return (
                    <SelectItem key={userId} value={userId}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback className="text-xs">{getInitials(user?.name)}</AvatarFallback>
                        </Avatar>
                        {user?.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Split between</Label>
              <Button variant="outline" size="sm" onClick={handleSelectAll} className="text-xs">
                {selectAll ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {group.members.map((userId: string) => {
                const user = group.membersDetails.find((u: any) => u.id === userId);
                return (
                  <Card key={userId} className="p-0">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`split-${userId}`}
                          checked={splitBetween.includes(userId)}
                          onCheckedChange={() => handleUserToggle(userId)}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user?.name}</p>
                          {amount && splitBetween.includes(userId) && (
                            <p className="text-xs text-green-600">
                              Owes: ${(parseFloat(amount) / splitBetween.length).toFixed(2)}
                            </p>
                          )}
                        </div>
                        {splitBetween.includes(userId) && <Check className="h-4 w-4 text-green-600" />}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {splitBetween.length > 0 && amount && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Split Summary:</strong> ${parseFloat(amount).toFixed(2)} ÷ {splitBetween.length} people = 
                  <strong> ${(parseFloat(amount) / splitBetween.length).toFixed(2)} per person</strong>
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              disabled={!description.trim() || !amount || !paidBy || splitBetween.length === 0}
            >
              Add Expense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;