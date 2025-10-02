import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DonorDashboard } from './DonorDashboard';
import { RecipientDashboard } from './RecipientDashboard';
import { VolunteerDashboard } from './VolunteerDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to access your dashboard.</div>;
  }

  switch (user.role) {
    case 'business_donor':
      return <DonorDashboard />;
    case 'individual_recipient':
      return <RecipientDashboard />;
    case 'volunteer':
      return <VolunteerDashboard />;
    default:
      return <div>Invalid user role.</div>;
  }
};