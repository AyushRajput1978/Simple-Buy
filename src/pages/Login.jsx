import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../redux/reducer/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });

  const loginHandler = useMutation({
    mutationFn: async (formData) => {
      return axios.post("/users/login", formData);
    },
    onSuccess: (res) => {
      const { user, token } = res.data.data;
      Cookies.set("JWT", token, {
        expires: 2,
        secure: true,
        sameSite: "Strict",
      });
      // Store in Redux
      dispatch(setAuth({ user }));

      // Role-based redirect
      if (user.role === "admin" || user.role === "superAdmin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    },
    onError: (err) => {
      console.error("Login error", err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginHandler.mutate(form);
  };

  return (
    <div className="container my-3 py-3">
      <h1 className="text-center">Login</h1>
      <hr />
      <div className="row my-4 h-100">
        <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="my-3">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="my-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <Link className="text-info" to="/forgot-password">
                Forgot Password?
              </Link>
            </div>
            <div className="my-3">
              <p>
                New Here?{" "}
                <Link
                  to="/register"
                  className="text-decoration-underline text-info"
                >
                  Register
                </Link>
              </p>
            </div>
            <div className="text-center">
              <button
                className="my-2 mx-auto btn btn-dark"
                type="submit"
                disabled={loginHandler.isLoading}
              >
                {loginHandler.isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
