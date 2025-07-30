'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Plus, TrendingUp } from 'lucide-react';
import { setGroups, setSelectedGroup } from '../store/slices/groupsSlice';
import { mockGroups, mockUsers } from '../utils/mockData';
import { RootState } from '../store/store';

interface GroupsListProps {
  onCreateGroup: () => void;
  onGroupSelect: (group: any) => void;
}

const GroupsList = ({ onCreateGroup, onGroupSelect }: GroupsListProps) => {
  const dispatch = useDispatch();
  const { groups } = useSelector((state: RootState) => state.groups);

  useEffect(() => {
    // Load mock data for development
    dispatch(setGroups(mockGroups));
  }, [dispatch]);

  const handleGroupClick = (group: any) => {
    dispatch(setSelectedGroup(group));
    onGroupSelect(group);
  };

  const getMemberNames = (memberIds: string[]) => {
    return memberIds
      .map(id => mockUsers.find(user => user.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SplitWise
          </h1>
          <p className="text-gray-600 mt-2">Manage your group expenses effortlessly</p>
        </div>
        <Button 
          onClick={onCreateGroup} 
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
      </div>

      {/* Stats Overview */}
      {groups.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3 animate-slide-up">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Groups</p>
                  <p className="text-2xl font-bold text-blue-700">{groups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold text-green-700">
                    ${groups.reduce((sum, group) => sum + group.totalExpenses, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Active Members</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {new Set(groups.flatMap(group => group.members)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {groups.length === 0 ? (
        <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2 border-gray-300 animate-scale-in">
          <CardContent>
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to SplitWise!</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Start by creating your first group to track and split expenses with friends, family, or colleagues.
              </p>
              <Button 
                onClick={onCreateGroup}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Group
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Your Groups</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group, index) => (
              <Card 
                key={group.id} 
                className="cursor-pointer hover-lift expense-card animate-slide-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleGroupClick(group)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {group.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="p-1 bg-blue-100 rounded">
                        <Users className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="font-medium">{group.members.length} members</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-1 bg-green-100 rounded">
                        <DollarSign className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="font-bold text-green-700">${group.totalExpenses.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Members:</p>
                    <div className="flex flex-wrap gap-1">
                      {group.members.slice(0, 3).map((memberId) => {
                        const user = mockUsers.find(u => u.id === memberId);
                        return (
                          <div key={memberId} className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                            <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {user?.name.charAt(0)}
                              </span>
                            </div>
                            <span className="text-xs text-gray-700">{user?.name.split(' ')[0]}</span>
                          </div>
                        );
                      })}
                      {group.members.length > 3 && (
                        <div className="flex items-center gap-1 bg-gray-200 rounded-full px-2 py-1">
                          <span className="text-xs text-gray-600">+{group.members.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Created {group.createdAt.toLocaleDateString()}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      ${(group.totalExpenses / group.members.length).toFixed(2)} per person
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsList; 