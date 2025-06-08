import React, { useState, useEffect } from 'react';
import { Users, BookOpen, DollarSign, TrendingUp, Menu } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminStats from '../../components/admin/AdminStats';
import AdminTable from '../../components/admin/AdminTable';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeInstructors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await getAdminStats();
      // setStats(response.data);
      
      // Temporary mock data
      setStats({
        totalUsers: 1250,
        totalCourses: 85,
        totalRevenue: 250000,
        activeInstructors: 45
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF6E9' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#A0C878' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAF6E9' }}>
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex justify-center items-start p-6">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg mr-4 hover:bg-[#DDEB9D]"
              >
                <Menu className="w-6 h-6" style={{ color: '#2E4057' }} />
              </button>
              <h1 className="text-2xl font-bold" style={{ color: '#2E4057' }}>Admin Dashboard</h1>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AdminStats
              icon={<Users className="w-6 h-6 text-white" />}
              title="Total Users"
              value={stats.totalUsers}
              color="#A0C878"
            />
            <AdminStats
              icon={<BookOpen className="w-6 h-6 text-white" />}
              title="Total Courses"
              value={stats.totalCourses}
              color="#A0C878"
            />
            <AdminStats
              icon={<DollarSign className="w-6 h-6 text-white" />}
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString()}`}
              color="#A0C878"
            />
            <AdminStats
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              title="Active Instructors"
              value={stats.activeInstructors}
              color="#A0C878"
            />
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm" style={{ backgroundColor: '#FFFDF6' }}>
              <h2 className="text-xl font-semibold mb-6" style={{ color: '#2E4057' }}>Recent Users</h2>
              <AdminTable type="users" />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm" style={{ backgroundColor: '#FFFDF6' }}>
              <h2 className="text-xl font-semibold mb-6" style={{ color: '#2E4057' }}>Recent Courses</h2>
              <AdminTable type="courses" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 