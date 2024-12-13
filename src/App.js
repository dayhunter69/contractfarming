import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="App">
      <Toaster richColors position="bottom-center" />
      <Outlet />
    </div>
  );
}

export default App;
