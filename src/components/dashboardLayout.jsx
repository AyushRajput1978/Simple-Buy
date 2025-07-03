// components/DashboardLayout.js
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaTags,
  FaChevronCircleLeft,
  FaChevronCircleRight,
} from "react-icons/fa";
import "./index.css"; // Optional for custom styling

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);
  // Collapse on small screens initially
  useEffect(() => {
    if (window.innerWidth < 600) {
      setCollapsed(true);
    }
  }, []);
  return (
    <aside className="d-flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-dark text-white p-3 sidebar position-relative ${
          collapsed ? "collapsed" : ""
        }`}
        style={{
          width: collapsed ? "80px" : "200px",
          minHeight: "100vh",
          transition: "width 0.3s",
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
        {/* <div className="d-flex justify-content-between align-items-center"> */}
        <NavLink className="navbar-brand fw-bold fs-4" to="/">
          <img
            className="card-img img-fluid"
            src="./assets/logo.webp"
            alt="Logo"
            style={{
              height: collapsed ? "1em" : "2em",
              paddingLeft: collapsed ? "0" : "20px",
            }}
          />
        </NavLink>
        {/* </div> */}
        <nav className="mt-4 nav flex-column">
          <NavLink to="/dashboard" end className="nav-link text-white my-1">
            <FaTachometerAlt className="me-2" />
            {!collapsed && "Dashboard"}
          </NavLink>
          <NavLink
            to="/dashboard/product-categories"
            className="nav-link text-white my-1"
          >
            <FaTags className="me-2" />
            {!collapsed && "Categories"}
          </NavLink>
          <NavLink
            to="/dashboard/products"
            className="nav-link text-white my-1"
          >
            <FaBoxOpen className="me-2" />
            {!collapsed && "Products"}
          </NavLink>

          <NavLink to="/dashboard/orders" className="nav-link text-white my-1">
            <FaClipboardList className="me-2" />
            {!collapsed && "Orders"}
          </NavLink>
          <NavLink to="/dashboard/users" className="nav-link text-white my-1">
            <FaUsers className="me-2" />
            {!collapsed && "Users"}
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1 p-3 overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        <Outlet />
      </div>
    </aside>
  );
};

export default DashboardLayout;
