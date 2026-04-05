import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import { closeSidebar } from '../../store/slices/uiSlice.js';

function Layout() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => dispatch(closeSidebar())}
      />

      <Sidebar />

      <div className="main-wrapper">
        <Topbar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout;
