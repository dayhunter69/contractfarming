import React, { useState, useEffect } from 'react';
import HomeComponent from '../components/HomeComponent';
import AdminDashboard from '../components/AdminDashboard';

const Dashboard = () => {
  const [showUserTab, setShowUserTab] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setShowUserTab(userRole === '0' || userRole === '1');
  }, []);

  return (
    <div className="">
      {showUserTab ? <AdminDashboard /> : <HomeComponent />}
    </div>
  );
};

export default Dashboard;
