import { useAuth } from '../../context/AuthContext.tsx';
import Layout from '../../components/layout.tsx';

// Import Main Seperate Dashboard Pages. Will be rendered conditionally.
import AdminDashboard from './boards/AdminDashboard.tsx';
import CreatorDashboardProvider from './boards/CreatorDashboard/CreatorWithProvider.tsx';
import MemberDashboard from './boards/MemberDashboard.tsx';

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
        return <CreatorDashboardProvider />;
      case 'member':
        return <MemberDashboard />;
      default:
        return <MemberDashboard />;
    }
  };

  return <Layout>{renderDashboard()}</Layout>;
};

export default Dashboard;
