// Mock data for development and testing
export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  },
];

export const mockGroups = [
  {
    id: '1',
    name: 'Weekend Trip',
    members: ['1', '2', '3'],
    totalExpenses: 450.75,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Office Lunch',
    members: ['1', '4', '5'],
    totalExpenses: 89.50,
    createdAt: new Date('2024-01-20'),
  },
];

export const mockExpenses = [
  {
    id: '1',
    groupId: '1',
    description: 'Hotel booking',
    amount: 300,
    paidBy: '1',
    splitBetween: ['1', '2', '3'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    groupId: '1',
    description: 'Dinner',
    amount: 150.75,
    paidBy: '2',
    splitBetween: ['1', '2', '3'],
    createdAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    groupId: '2',
    description: 'Pizza lunch',
    amount: 89.50,
    paidBy: '4',
    splitBetween: ['1', '4', '5'],
    createdAt: new Date('2024-01-20'),
  },
]; 