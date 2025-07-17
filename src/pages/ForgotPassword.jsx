import { useState } from "react";
import axios from "../axios";
import { Button, Col, Container, Row } from "react-bootstrap";

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
    <Container className="my-3 py-3">
      <h1 className="text-center">Recover Password</h1>
      <hr />
      <Row className="my-4 h-100">
        <Col md={4} sm={8} className="mx-auto">
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
              <Button
                variant="dark"
                className="my-2 mx-auto"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  );
};
export default ForgotPassword;
