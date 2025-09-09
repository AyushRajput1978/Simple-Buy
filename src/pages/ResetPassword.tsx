import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { User } from 'type';

import axios from '../axios';
import { setAuth } from '../redux/reducer/authSlice';

interface PasswordResetResponse {
  user: User;
  token: string;
}

interface ApiResponse {
  data: PasswordResetResponse;
  status?: number;
  statusText?: string;
}
interface FormState {
  password: string;
  newPassword: string;
  newPasswordConfirm: string;
}

const ResetPassword = () => {
  const [form, setForm] = useState<FormState>({
    password: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const { token: urlToken } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetPasswordHandler = useMutation<ApiResponse, Error, FormState>({
    mutationFn: async (formData) => {
      if (urlToken) {
        const response = await axios.post(`/user/reset-password/${urlToken}`, {
          newPassword: formData.newPassword,
          newPasswordConfirm: formData.newPasswordConfirm,
        });
        return response;
      } else {
        const response = await axios.patch('/user/update-password', formData);
        return response;
      }
    },
    onSuccess: (res) => {
      // Now TypeScript knows the shape of res.data
      const { user, token } = res.data;

      Cookies.set('JWT', token, {
        expires: 2,
        secure: true,
        sameSite: 'Strict',
      });

      dispatch(setAuth({ user }));

      if (user.role === 'admin' || user.role === 'superAdmin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    },
    onError: (err) => {
      console.error('Login error', err);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
            {!urlToken && (
              <div className="my-3">
                <label htmlFor="email">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
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
                onChange={(e) => setForm({ ...form, newPasswordConfirm: e.target.value })}
              />
            </div>
            <div className="text-center">
              <button
                className="my-2 mx-auto btn btn-dark"
                type="submit"
                disabled={resetPasswordHandler.isPending}
              >
                {resetPasswordHandler.isPending ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  );
};
export default ResetPassword;
