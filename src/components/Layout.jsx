// components/Layout.js
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "./";
import useCart from "../hooks/useCart";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import { setAuth } from "../redux/reducer/authSlice";

const Layout = () => {
  const { fetchCart } = useCart();

  const dispatch = useDispatch();
  function getSessionId() {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = crypto.randomUUID(); // modern browsers
      localStorage.setItem("sessionId", sessionId);
    }
    // return sessionId;
  }
  const authToken = Cookies.get("JWT");
  useEffect(() => {
    getSessionId();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      // setLoading(true);

      try {
        const res = await axios.get(`/user/me`, config);
        const userDetail = res.data.data;
        dispatch(setAuth({ user: userDetail }));
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    if (authToken) {
      fetchUserDetails();
      fetchCart();
    }
  }, [authToken]);

  return (
    <div style={{ backgroundColor: "var(--color-light)", minHeight: "100vh" }}>
      <Navbar />
      <main className="flex-grow-1 bg-custom-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
