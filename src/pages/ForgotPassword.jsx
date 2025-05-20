import { useState } from "react";
import axios from "../axios";

const ForgotPassword = () => {
  const resetUrl = `${import.meta.env.VITE_SITE_URL}/password-reset`;
  const [form, setForm] = useState({
    email: "",
    resetUrl,
  });
  const [isLoading, setIsLoading] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post("/user/forgot-password", form);
      alert(res.data.message);
    } catch (err) {
      alert(err.resonse.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container my-3 py-3">
      <h1 className="text-center">Recover Password</h1>
      <hr />
      <div className="row my-4 h-100">
        <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
          <form onSubmit={submitHandler}>
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
            <div className="text-center">
              <button
                className="my-2 mx-auto btn btn-dark"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
