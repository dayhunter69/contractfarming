import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
  Outlet,
  ScrollRestoration,
} from 'react-router-dom';

// Import your components
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
import Archieves from './components/Archieves';
import Accounts from './components/Accounts';
import EditFlock from './components/EditFlock';
import EditFlockDetail from './components/EditFlockDetail';

const getBaseRoute = (pathname) => {
  // Define the base routes and their child patterns
  const routePatterns = {
    '/myflock': ['/myflock/:id', '/myflock/:id/details'],
    '/users': ['/users/:id', '/users/:id/profile'],
    '/settings': ['/settings/:section', '/settings/:section/:subsection'],
  };

  // Check if the pathname matches any base route or its children
  for (const [baseRoute, patterns] of Object.entries(routePatterns)) {
    if (
      pathname === baseRoute ||
      patterns.some((pattern) => {
        // Convert route pattern to regex
        const regexPattern = pattern
          .replace(/:[^/]+/g, '[^/]+') // Replace :id with any non-slash characters
          .replace(/\//g, '\\/'); // Escape forward slashes
        return new RegExp(`^${regexPattern}$`).test(pathname);
      })
    ) {
      return baseRoute;
    }
  }

  return pathname;
};

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden md:ml-44 ml-0">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="mx-auto mt-2">
            <Outlet />
            <ScrollRestoration
              getKey={(location, matches) => {
                return getBaseRoute(location.pathname) || location.key;
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="myflock" element={<MyFlock />} />
          <Route path="myflock/:flockId" element={<FlockDetail />} />
          <Route path="myflock/:flockId/:flockDetailId" element={<Details />} />
          <Route path="users" element={<Users />} />
          <Route path="adduser" element={<AddUser />} />
          <Route path="settings" element={<Settings />} />
          <Route path="addflock" element={<AddFlock />} />
          <Route path="archieves" element={<Archieves />} />
          <Route path="accounts" element={<Accounts />} />
          <Route
            path="myflock/:flockId/addflockdetail"
            element={<AddFlockDetail />}
          />
          <Route path="/editflock/:id" element={<EditFlock />} />
          <Route path="/editflockdetail/:id" element={<EditFlockDetail />} />
          <Route path="capture" element={<Capture />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
