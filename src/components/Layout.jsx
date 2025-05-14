// components/Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "./";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
