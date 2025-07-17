
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import CreatorDashboard from '@/components/dashboard/CreatorDashboard';
import MemberDashboard from '@/components/dashboard/MemberDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-400">Please log in to access your dashboard.</p>
        </div>
      </Layout>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'creator':
        return <CreatorDashboard />;
      case 'member':
        return <MemberDashboard />;
      default:
        return <MemberDashboard />;
    }
  };

  return <Layout>{renderDashboard()}</Layout>;
};

export default Dashboard;
