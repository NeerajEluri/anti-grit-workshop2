import React from 'react';
import { Farm } from '../../types';
import { FarmCard } from '../dashboard/FarmCard';
import { EmptyState } from '../common/EmptyState';
import { useNavigate } from 'react-router-dom';

interface FarmListProps {
  farms: Farm[];
}

export const FarmList: React.FC<FarmListProps> = ({ farms }) => {
  const navigate = useNavigate();

  if (farms.length === 0) {
    return (
      <EmptyState
        title="No Farm Profiles Registered"
        description="Add your first farm profile to unlock AI crop selection, pest diagnosis, and irrigation planning."
        actionLabel="Add New Farm Profile"
        onAction={() => navigate('/farms/new')}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {farms.map((farm) => (
        <FarmCard key={farm.id} farm={farm} />
      ))}
    </div>
  );
};
