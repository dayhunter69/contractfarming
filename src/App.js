import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyFlock from './components/MyFlock';
import AddFlock from './components/AddFlock';
import Capture from './pages/Capture';
import Users from './pages/Users';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import FlockDetail from './components/FlockDetail';
import Details from './components/Details';
import AddFlockDetail from './components/AddFlockDetail';
import AddUser from './pages/AddUser';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto mt-2">
            <Routes>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/myflock" element={<MyFlock />} />
              <Route path="/myflock/:flockId" element={<FlockDetail />} />
              <Route path="/myflock/:flockId/details" element={<Details />} />
              <Route path="/users" element={<Users />} />
              <Route path="/adduser" element={<AddUser />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/addflock" element={<AddFlock />} />
              <Route
                path="/myflock/:flockId/addflockdetail"
                element={<AddFlockDetail />}
              />
              <Route path="/capture" element={<Capture />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/*" element={<Layout />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
