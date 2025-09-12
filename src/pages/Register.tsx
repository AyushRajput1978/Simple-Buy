import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { User } from 'type';

import axios from '../axios';
import { setAuth } from '../redux/reducer/authSlice';

interface SignUpResponse {
  user: User;
  token: string;
}
interface ApiResponse {
  data: SignUpResponse;
  status?: number;
  statusText?: string;
}
type FormState = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phoneNo: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phoneNo: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const loginHandler = useMutation<ApiResponse, Error, FormState>({
    mutationFn: async (formData) => {
      const res = await axios.post('/user/signup', formData);
      return res;
    },
    onSuccess: (res) => {
      const { user, token } = res.data;

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
      }
    },
    onError: (err) => {
      console.error('Signup error', err);
    },
  });

  const validate = () => {
    const newErrors = { name: '', email: '', phoneNo: '', password: '', passwordConfirm: '' };

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.phoneNo.trim()) newErrors.phoneNo = 'Phone number is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.passwordConfirm) {
      newErrors.passwordConfirm = 'Confirm your password';
    } else if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      loginHandler.mutate(form);
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;
    const key = name as keyof FormState;
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };
  const fields: { label: string; name: keyof FormState; type: string }[] = [
    { label: 'Full Name', name: 'name', type: 'text' },
    { label: 'Email address', name: 'email', type: 'email' },
    { label: 'Phone Number', name: 'phoneNo', type: 'tel' },
    { label: 'Password', name: 'password', type: 'password' },
    {
      label: 'Confirm Password',
      name: 'passwordConfirm',
      type: 'password',
    },
  ];
  return (
    <Container className="my-3 py-3">
      <h1 className="text-center">Register</h1>
      <hr />
      <Row className="my-4 h-100">
        <Col lg={4} md={6} sm={8} className="mx-auto">
          <form onSubmit={handleSubmit}>
            {fields.map(({ label, name, type }) => (
              <div className="form my-3" key={name}>
                <label htmlFor={name}>{label}</label>
                <input
                  type={type}
                  name={name}
                  id={name}
                  className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                  placeholder={label}
                  value={form[name]}
                  onChange={handleChange}
                />
                {errors[name] && <small className="text-danger">{errors[name]}</small>}
              </div>
            ))}

            <div className="my-3">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-underline text-info">
                  Login
                </Link>
              </p>
            </div>

            <div className="text-center">
              <Button
                variant="dark"
                className="my-2 mx-auto"
                type="submit"
                disabled={loginHandler.isPending}
              >
                {loginHandler.isPending ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
