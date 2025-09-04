import Cookies from 'js-cookie';
import { Container, Nav } from 'react-bootstrap';
import { CgProfile } from 'react-icons/cg';
import { FaTachometerAlt } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { MdSyncLock, MdLogout } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import type { RootState } from 'type';

import useCart from '../hooks/useCart';
import defaultAvatar from '/assets/default-avatar.jpg';
import { logout } from '../redux/reducer/authSlice';
import { cartItemsSet } from '../redux/reducer/cartSlice';

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useCart();

  const logoutHandler = () => {
    dispatch(logout());
    Cookies.remove('JWT');
    dispatch(cartItemsSet([]));
    navigate('/');
  };
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/product', label: 'Products' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];
  return (
    <Nav className="navbar navbar-expand-lg custom-navbar navbar-dark py-3 sticky-top">
      <Container>
        <button
          className="navbar-toggler mx-2"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">
          <img
            className="card-img img-fluid"
            src="./assets/logo.webp"
            alt="Logo"
            style={{ height: '4rem' }}
          />
        </NavLink>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            {navLinks.map(({ label, path }) => (
              <li className="nav-item">
                <NavLink className="nav-link" to={path}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar-nav d-flex align-items-center justify-content-center gap-3 mt-3 mt-lg-0">
            {/* User Avatar */}
            <NavLink to="/cart" className="nav-link position-relative">
              <FaCartShopping className="fs-5" />
              <span className="badge cart-badge position-absolute top-2 start-100 translate-middle">
                {cart.length}
              </span>
            </NavLink>
            {user ? (
              <div className="dropdown text-center">
                <img
                  src={user.photo || defaultAvatar}
                  alt="User profile pic"
                  className="rounded-circle"
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  id="userMenu"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                />
                <div className="small mt-1 text-white">{user.name || 'User'}</div>

                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userMenu">
                  <NavLink className="dropdown-item" to="/profile">
                    <CgProfile className="me-2" />
                    Profile
                  </NavLink>
                  {(user.role === 'admin' || user.role === 'superAdmin') && (
                    <NavLink className="dropdown-item" to="/dashboard">
                      <FaTachometerAlt className="me-2" />
                      Dashboard
                    </NavLink>
                  )}

                  {user.role === 'user' && (
                    <NavLink className="dropdown-item" to="/user-orders">
                      <MdSyncLock className="me-2" />
                      My Orders
                    </NavLink>
                  )}
                  <NavLink className="dropdown-item" to="/password-reset">
                    <MdSyncLock className="me-2" />
                    Change Password
                  </NavLink>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={logoutHandler}>
                    <MdLogout className="me-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="btn btn-sm mx-1 mt-2 mt-lg-0"
                  style={{
                    backgroundColor: 'var(--color-cta)',
                    color: 'white',
                  }}
                >
                  <i className="fa fa-sign-in-alt mr-1"></i> Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="btn btn-outline-light btn-sm mx-1 mt-2 mt-lg-0"
                  style={{
                    borderColor: 'var(--color-cta)',
                    color: 'var(--color-cta)',
                  }}
                >
                  <i className="fa fa-user-plus mr-1"></i> Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </Container>
    </Nav>
  );
};

export default Navbar;
