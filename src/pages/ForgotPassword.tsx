import type { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import type { ApiError } from 'type';

import axios from '../axios';

interface SubmitResponse {
  message: string;
}

const ForgotPassword = () => {
  const resetUrl = `${import.meta.env.VITE_SITE_URL}/password-reset`;

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post<SubmitResponse>('/user/forgot-password', {
        email,
        resetUrl,
      });
      alert(res.data.message || 'Reset link sent to your email.');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const msg = error?.response?.data?.message || 'Something went wrong!';
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="my-3 py-3">
      <h1 className="text-center">Recover Password</h1>
      <hr />
      <Row className="my-4">
        <Col md={4} sm={8} className="mx-auto">
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="dark" type="submit" disabled={isLoading || !email}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
