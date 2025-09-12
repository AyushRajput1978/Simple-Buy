import { useMutation } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { ApiError, User } from 'type';

import axios from '../axios';
import useCart from '../hooks/useCart';
import { setAuth } from '../redux/reducer/authSlice';
import { toast } from '../utils/helper';

interface LoginResponse {
  data: {
    user: User;
    token: string;
  };
}
interface LoginFormData {
  email: string;
  password: string;
}
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchCart } = useCart();
  const [form, setForm] = useState<LoginFormData>({ email: '', password: '' });

  const loginHandler = useMutation<AxiosResponse<LoginResponse>, ApiError, LoginFormData>({
    mutationFn: async (formData: LoginFormData) => {
      return axios.post<LoginResponse>('/user/login', formData);
    },
    onSuccess: (res) => {
      const { user, token } = res.data.data;
      Cookies.set('JWT', token, {
        expires: 2,
        secure: true,
        sameSite: 'Strict',
      });

      dispatch(setAuth(user));

      if (user.role === 'admin' || user.role === 'superAdmin') {
        navigate('/dashboard');
      } else {
        navigate('/');
        void fetchCart();
      }
    },
    onError: (err: ApiError) => {
      toast(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
                New Here?{' '}
                <Link to="/register" className="text-decoration-underline text-info">
                  Register
                </Link>
              </p>
            </div>
            <div className="text-center">
              <Button
                variant="dark"
                className="my-2 mx-auto "
                type="submit"
                disabled={loginHandler.isPending}
              >
                {loginHandler.isPending ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
