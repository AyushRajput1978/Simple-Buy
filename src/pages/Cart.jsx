import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import { useState } from "react";
import CustomToast from "../components/layout/CustomToast";
import { Button } from "react-bootstrap";
import ConfirmModal from "../components/layout/AlertModal";
import { useSelector } from "react-redux";

const Cart = () => {
  const { cart, deleteCart, updateCart } = useCart();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("");
  const [success, setSuccess] = useState(true);

  const userData = useSelector((state) => state.auth.user);
  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">Your Cart is Empty</h4>
            <Link to="/" className="btn  btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const addItem = (product) => {
    updateCart(product.id, "increment", setShowToast, setToastBody, setSuccess);
  };
  const removeItem = (product) => {
    updateCart(product.id, "decrement", setShowToast, setToastBody, setSuccess);
  };

  const ShowCart = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;

    cart.forEach((item) => {
      subtotal += item.product.price * item.quantity;
      totalItems += item.quantity;
    });

    const handleClearConfirm = () => {
      deleteCart(setShowToast, setToastBody, setSuccess);
      setShowConfirmModal(false);
    };

    return (
      <section className="py-4">
        <div className="row justify-content-center gx-5">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="card shadow-sm rounded-4 mb-4 border-0">
              <div className="card-header d-flex justify-content-between align-items-center bg-white border-0">
                <h5 className="mb-0 fw-semibold text-primary">Items in Cart</h5>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setShowConfirmModal(true)}
                >
                  Clear Cart
                </Button>
              </div>
              <div className="card-body">
                {cart.map((item) => (
                  <div key={item.product.id}>
                    <div className="row align-items-center mb-4">
                      <div className="col-md-2 col-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="img-fluid rounded border"
                          style={{ height: "75px", objectFit: "contain" }}
                        />
                      </div>

                      <div className="col-md-4 col-8">
                        <h6 className="mb-1">{item.product.name}</h6>
                        <small className="text-muted">
                          ${item.product.price} × {item.quantity}
                        </small>
                      </div>

                      <div className="col-md-6 mt-2 mt-md-0 d-flex align-items-center justify-content-md-end">
                        <div className="d-flex align-items-center border rounded-3 overflow-hidden">
                          <Button
                            variant="light"
                            className="px-3 py-2 border-end"
                            onClick={() => removeItem(item.product)}
                          >
                            <i className="fas fa-minus" />
                          </Button>
                          <span className="mx-3 fw-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="light"
                            className="px-3 py-2 border-start"
                            onClick={() => addItem(item.product)}
                          >
                            <i className="fas fa-plus" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm rounded-4 border-0">
              <div className="card-header bg-light border-0">
                <h5 className="mb-0 fw-semibold">Order Summary</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush mb-4">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Products ({totalItems})</span>
                    <strong>${Math.round(subtotal)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Shipping</span>
                    <strong>${shipping}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between bg-light rounded">
                    <strong>Total</strong>
                    <strong className="text-cta">
                      ${Math.round(subtotal + shipping)}
                    </strong>
                  </li>
                </ul>
                <Link
                  to={userData ? "/payment" : "/register"}
                  className="btn btn-cta w-100"
                >
                  Go to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Toast + Modal */}
        <CustomToast
          show={showToast}
          toastBody={toastBody}
          setShow={setShowToast}
          success={success}
        />
        <ConfirmModal
          showConfirmModal={showConfirmModal}
          setShowConfirmModal={setShowConfirmModal}
          handleClearConfirm={handleClearConfirm}
          heading="Confirm Clear Cart"
          bodyText="Are you sure you want to clear all items from your cart?"
          confirmText="Yes, Clear Cart"
        />
      </section>
    );
  };

  return (
    <div className="container my-3 py-3">
      <h1 className="text-center">Cart</h1>
      <hr />
      {cart.length > 0 ? <ShowCart /> : <EmptyCart />}
    </div>
  );
};

export default Cart;
