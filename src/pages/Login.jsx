import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

import axios from "../axios";
import { setAuth } from "../redux/reducer/authSlice";
import { toast } from "../utils/helper";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });

  const loginHandler = useMutation({
    mutationFn: async (formData) => {
      return axios.post("/user/login", formData);
    },
    onSuccess: (res) => {
      const { user, token } = res.data.data;
      Cookies.set("JWT", token, {
        expires: 2,
        secure: true,
        sameSite: "Strict",
      });

      dispatch(setAuth({ user }));

      if (user.role === "admin" || user.role === "superAdmin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    },
    onError: (err) => {
      toast(err.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginHandler.mutate(form);
  };

  return (
    <Container className="my-3 py-3">
      <h1 className="text-center">Login</h1>
      <hr />
      <Row className="my-4 h-100">
        <Col md={4} sm={8} className="mx-auto">
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
              <Button
                variant="dark"
                className="my-2 mx-auto "
                type="submit"
                disabled={loginHandler.isLoading}
              >
                {loginHandler.isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
