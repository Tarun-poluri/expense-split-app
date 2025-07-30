'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, ArrowRight, Check } from 'lucide-react';
import { addGroup } from '../store/slices/groupsSlice';
import { mockUsers } from '../utils/mockData';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupModal = ({ isOpen, onClose }: CreateGroupModalProps) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedUsers([]);
      setGroupName('');
      setSelectAll(false);
    }
  }, [isOpen]);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => {
      const newSelection = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      
      setSelectAll(newSelection.length === mockUsers.length);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
      setSelectAll(false);
    } else {
      setSelectedUsers(mockUsers.map(user => user.id));
      setSelectAll(true);
    }
  };

  const handleNext = () => {
    if (selectedUsers.length > 0) {
      setStep(2);
    }
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      const newGroup = {
        id: Date.now().toString(),
        name: groupName.trim(),
        members: selectedUsers,
        totalExpenses: 0,
        createdAt: new Date(),
      };
      
      dispatch(addGroup(newGroup));
      onClose();
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {step === 1 ? 'Select Members' : 'Create Group'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Choose group members</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                {selectAll ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {mockUsers.map((user) => (
                <Card key={user.id} className="p-0">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={user.id}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserToggle(user.id)}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      {selectedUsers.includes(user.id) && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-gray-500">
                {selectedUsers.length} member{selectedUsers.length !== 1 ? 's' : ''} selected
              </p>
              <Button 
                onClick={handleNext} 
                disabled={selectedUsers.length === 0}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected Members</Label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((userId) => {
                  const user = mockUsers.find(u => u.id === userId);
                  return (
                    <div key={userId} className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="text-xs">{getInitials(user?.name || '')}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{user?.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={handleCreateGroup}
                disabled={!groupName.trim()}
              >
                Create Group
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal; 