import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import { useState } from "react";
import CustomToast from "../components/layout/CustomToast";
import { Button } from "react-bootstrap";
import ConfirmModal from "../components/layout/AlertModal";

const Cart = () => {
  const { cart, deleteCart, updateCart } = useCart();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("");
  const [success, setSuccess] = useState(true);

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
    cart.map((item) => {
      return (subtotal += item.product.price * item.quantity);
    });

    cart.map((item) => {
      return (totalItems += item.quantity);
    });
    const handleClearConfirm = () => {
      deleteCart(setShowToast, setToastBody, setSuccess);
      setShowConfirmModal(false);
    };
    return (
      <>
        <section className="h-100 gradient-custom">
          <div className="container py-5">
            <div className="row d-flex justify-content-center my-4">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header py-3 d-flex justify-content-between">
                    <h5 className="mb-0">Item List</h5>
                    <Button
                      variant="outline-danger"
                      onClick={() => setShowConfirmModal(true)}
                    >
                      Clear Cart
                    </Button>
                  </div>
                  <div className="card-body">
                    {cart.map((item) => {
                      return (
                        <div key={item.product.id}>
                          <div className="row d-flex align-items-center">
                            <div className="col-lg-3 col-md-12">
                              <div
                                className="bg-image rounded"
                                data-mdb-ripple-color="light"
                              >
                                <img
                                  src={item.product.image}
                                  // className="w-100"
                                  alt={item.title}
                                  width={100}
                                  height={75}
                                />
                              </div>
                            </div>

                            <div className="col-lg-5 col-md-6">
                              <p>
                                <strong>{item.product.name}</strong>
                              </p>
                              {/* <p>Color: blue</p>
                              <p>Size: M</p> */}
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div
                                className="d-flex mb-4 align-items-center"
                                style={{ maxWidth: "300px" }}
                              >
                                <button
                                  className="btn px-3"
                                  onClick={() => {
                                    removeItem(item.product);
                                  }}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>

                                <strong className="mx-3 my-auto">
                                  {item.quantity}
                                </strong>

                                <button
                                  className="btn px-3"
                                  onClick={() => {
                                    addItem(item.product);
                                  }}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>

                              <p className="text-start text-md-center">
                                <strong>
                                  <span className="text-muted">
                                    {item.quantity}
                                  </span>{" "}
                                  x ${item.product.price}
                                </strong>
                              </p>
                            </div>
                          </div>

                          <hr className="my-4" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-header py-3 bg-light">
                    <h5 className="mb-0">Order Summary</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                        Products ({totalItems})
                        <span>${Math.round(subtotal)}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                        Shipping
                        <span>${shipping}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                        <div>
                          <strong>Total amount</strong>
                        </div>
                        <span>
                          <strong>${Math.round(subtotal + shipping)}</strong>
                        </span>
                      </li>
                    </ul>

                    <Link
                      to="/checkout"
                      className="btn btn-dark btn-lg btn-block"
                    >
                      Go to checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
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
      </>
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
