import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

import axios from "../axios";
import { setAuth } from "../redux/reducer/authSlice";
import { Col, Container, Row } from "react-bootstrap";

const ResetPassword = () => {
  const [form, setForm] = useState({
    password: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetPasswordHandler = useMutation({
    mutationFn: async (formData) => {
      if (token)
        return axios.post(`/user/reset-password/${token}`, {
          newPassword: formData.newPassword,
          newPasswordConfirm: formData.newPasswordConfirm,
        });
      else return axios.patch("/user/update-password", formData);
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
      console.error("Login error", err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPasswordHandler.mutate(form);
  };
  return (
    <Container className="my-3 py-3">
      <h1 className="text-center">Recover Password</h1>
      <hr />
      <Row className="my-4 h-100">
        <Col md={4} sm={8} className="mx-auto">
          <form onSubmit={handleSubmit}>
            {!token && (
              <div className="my-3">
                <label htmlFor="email">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
            )}
            <div className="my-3">
              <label htmlFor="email">New Password</label>
              <input
                type="password"
                className="form-control"
                id="new-password"
                placeholder="New Password"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
              />
            </div>
            <div className="my-3">
              <label htmlFor="email">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                id="confirm-new-password"
                placeholder="New Password Confirm"
                value={form.newPasswordConfirm}
                onChange={(e) =>
                  setForm({ ...form, newPasswordConfirm: e.target.value })
                }
              />
            </div>
            <div className="text-center">
              <button
                className="my-2 mx-auto btn btn-dark"
                type="submit"
                disabled={resetPasswordHandler.isLoading}
              >
                {resetPasswordHandler.isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  );
};
export default ResetPassword;
