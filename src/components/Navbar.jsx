import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import defaultAvatar from "../../public/assets/default-avatar.jpg";
import { CgProfile } from "react-icons/cg";
import { FaCartShopping } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  const state = useSelector((state) => state.handleCart);
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
      <div className="container">
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
            src="./assets/logo.png"
            alt="Logo"
            style={{ height: "4rem" }}
          />
        </NavLink>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            {/* Navigation links */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/product">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Move this inside navbar-collapse and use flex utilities */}
          <div className="navbar-nav d-flex align-items-center justify-content-center gap-3 mt-3 mt-lg-0">
            {/* Cart */}
            <NavLink to="/cart" className="nav-link position-relative">
              <FaCartShopping className="fs-5" />
              <span className="badge badge-dark position-absolute top-2 start-100 translate-middle">
                {state.length}
              </span>
            </NavLink>

            {/* User Avatar */}
            {user ? (
              <div className="dropdown text-center">
                <img
                  src={user.avatar || defaultAvatar}
                  alt="User Avatar"
                  className="rounded-circle"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  id="userMenu"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                />
                <div className="small mt-1">{user.name || "User"}</div>

                <div
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="userMenu"
                >
                  <NavLink className="dropdown-item" to="/profile">
                    <CgProfile /> Profile
                  </NavLink>
                  {(user.role === "admin" || user.role === "superAdmin") && (
                    <NavLink className="dropdown-item" to="/dashboard">
                      Dashboard
                    </NavLink>
                  )}
                  <div className="dropdown-divider"></div>
                  <NavLink className="dropdown-item" to="/logout">
                    <MdLogout /> Logout
                  </NavLink>
                </div>
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="btn btn-outline-dark btn-sm mx-1 mt-2 mt-lg-0"
                >
                  <i className="fa fa-sign-in-alt mr-1"></i> Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="btn btn-outline-dark btn-sm mx-1 mt-2 mt-lg-0"
                >
                  <i className="fa fa-user-plus mr-1"></i> Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
