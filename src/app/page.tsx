'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import GroupsList from '../components/GroupsList';
import GroupDetail from '@/components/GroupDetail';
import CreateGroupModal from '../components/CreateGroupModal';
import { RootState } from '../store/store';

export default function Home() {
  const [currentView, setCurrentView] = useState('groups');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const handleCreateGroup = () => {
    setShowCreateGroup(true);
  };

  const handleGroupSelect = (group: any) => {
    setSelectedGroup(group);
    setCurrentView('group-detail');
  };

  const handleBackToGroups = () => {
    setCurrentView('groups');
    setSelectedGroup(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {currentView === 'groups' ? (
          <GroupsList 
            onCreateGroup={handleCreateGroup}
            onGroupSelect={handleGroupSelect}
          />
        ) : (
          <GroupDetail 
            group={selectedGroup}
            onBack={handleBackToGroups}
          />
        )}

        <CreateGroupModal
          isOpen={showCreateGroup}
          onClose={() => setShowCreateGroup(false)}
        />
      </div>
    </div>
  );
}
