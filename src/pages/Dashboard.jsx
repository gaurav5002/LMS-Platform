import React from 'react';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-[#A0C878] text-white rounded-md hover:bg-[#8fb862]"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium">Welcome, {user?.name}</h2>
          <p className="mt-1 text-sm text-gray-600">
            Email: {user?.email} | Role: {user?.role}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;