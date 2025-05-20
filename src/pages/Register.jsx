import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import axios from "../axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../redux/reducer/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phoneNo: "",
  });

  const [errors, setErrors] = useState({});

  const loginHandler = useMutation({
    mutationFn: async (formData) => {
      return axios.post("/user/signup", formData);
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
      console.error("Signup error", err);
    },
  });

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phoneNo.trim()) newErrors.phoneNo = "Phone number is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.passwordConfirm) {
      newErrors.passwordConfirm = "Confirm your password";
    } else if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      loginHandler.mutate(form);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error as user types
  };

  return (
    <div className="container my-3 py-3">
      <h1 className="text-center">Register</h1>
      <hr />
      <div className="row my-4 h-100">
        <div className="col-md-6 col-lg-4 col-sm-8 mx-auto">
          <form onSubmit={handleSubmit}>
            {[
              { label: "Full Name", name: "name", type: "text" },
              { label: "Email address", name: "email", type: "email" },
              { label: "Phone Number", name: "phoneNo", type: "tel" },
              { label: "Password", name: "password", type: "password" },
              {
                label: "Confirm Password",
                name: "passwordConfirm",
                type: "password",
              },
            ].map(({ label, name, type }) => (
              <div className="form my-3" key={name}>
                <label htmlFor={name}>{label}</label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                  placeholder={label}
                  value={form[name]}
                  onChange={handleChange}
                />
                {errors[name] && (
                  <small className="text-danger">{errors[name]}</small>
                )}
              </div>
            ))}

            <div className="my-3">
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-decoration-underline text-info"
                >
                  Login
                </Link>
              </p>
            </div>

            <div className="text-center">
              <button
                className="my-2 mx-auto btn btn-dark"
                type="submit"
                disabled={loginHandler.isLoading}
              >
                {loginHandler.isLoading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
