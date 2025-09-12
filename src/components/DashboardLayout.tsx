import { useEffect, useState } from 'react';
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaTags,
  FaChevronCircleLeft,
  FaChevronCircleRight,
} from 'react-icons/fa';
import { NavLink, Outlet } from 'react-router-dom';
import './index.css';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  {
    path: '/dashboard/product-categories',
    label: 'Categories',
    icon: <FaTags />,
  },
  { path: '/dashboard/products', label: 'Products', icon: <FaBoxOpen /> },
  { path: '/dashboard/orders', label: 'Orders', icon: <FaClipboardList /> },
  { path: '/dashboard/users', label: 'Users', icon: <FaUsers /> },
];

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  // Collapse sidebar on small screens initially
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setCollapsed(true);
      }
    };
    handleResize(); // Trigger on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside className="d-flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`sidebar bg-dark text-white p-3 position-relative ${
          collapsed ? 'collapsed' : ''
        }`}
        style={{
          width: collapsed ? '80px' : '200px',
          minHeight: '100vh',
          transition: 'width 0.3s',
        }}
      >
        {/* Toggle Button */}
        <button
          className="btn toggle-btn d-flex align-items-center justify-content-center rounded-circle"
          onClick={toggleSidebar}
          title="Toggle Sidebar"
        >
          {collapsed ? (
            <FaChevronCircleRight className="fs-4" />
          ) : (
            <FaChevronCircleLeft className="fs-4" />
          )}
        </button>

        {/* Logo */}
        <NavLink to="/" className="navbar-brand fw-bold fs-4 d-block">
          <img
            src="/assets/logo.webp"
            alt="Logo"
            className="img-fluid"
            style={{
              height: collapsed ? '1em' : '2em',
              paddingLeft: collapsed ? '0' : '20px',
            }}
          />
        </NavLink>

        {/* Navigation Links */}
        <nav className="mt-4 nav flex-column">
          {navLinks.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/dashboard'}
              className="nav-link text-white my-1 d-flex align-items-center"
            >
              {icon}
              {!collapsed && <span className="ms-2">{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-grow-1 p-3 overflow-hidden" style={{ minHeight: '100vh' }}>
        <Outlet />
      </main>
    </aside>
  );
};

export default DashboardLayout;
