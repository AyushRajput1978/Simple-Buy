import { Link } from "react-router-dom";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useSelector } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "react-bootstrap";

import useCart from "../hooks/useCart";
import ConfirmModal from "../components/layout/AlertModal";

const Cart = () => {
  const { cart, deleteCart, updateCart } = useCart();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const userData = useSelector((state) => state.auth.user);

  const EmptyCart = () => {
    return (
      <Container>
        <Row>
          <Col className="py-5 bg-light text-center">
            <h2 className="p-3">Your Cart is Empty</h2>
            <Link to="/" className="btn  btn-outline-dark mx-4">
              <FaArrowLeft /> Continue Shopping
            </Link>
          </Col>
        </Row>
      </Container>
    );
  };

  const addItem = (product) => {
    updateCart(product.id, "increment");
  };
  const removeItem = (product) => {
    updateCart(product.id, "decrement");
  };
  const ShowCart = () => {
    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;

    cart.forEach((item) => {
      subtotal += item.product.price * item.quantity;
      totalItems += item.quantity;
    });

    const handleConfirmClear = () => {
      deleteCart();
      setShowConfirmModal(false);
    };

    return (
      <Container className="py-4">
        <Row className=" justify-content-center gx-5">
          {/* Cart Items */}
          <Col lg={8}>
            <Card className="mb-4 rounded-4 border-0">
              <CardHeader className="d-flex justify-content-between align-items-center bg-white border-0">
                <h2 className="mb-0 fw-semibold text-primary fs-5">
                  Items in Cart
                </h2>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setShowConfirmModal(true)}
                >
                  Clear Cart
                </Button>
              </CardHeader>
              <CardBody>
                {cart.map((item) => (
                  <div key={item.product.id}>
                    <Row className="align-items-center mb-4">
                      <Col md={2} xs={4}>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="img-fluid rounded border"
                          style={{ height: "75px", objectFit: "contain" }}
                        />
                      </Col>

                      <Col md={4} xs={8}>
                        <h3 className="mb-1 fs-6">{item.product.name}</h3>
                        <small className="text-muted">
                          ${item.product.price} × {item.quantity}
                        </small>
                      </Col>

                      <Col
                        md={6}
                        className="mt-2 mt-md-0 d-flex align-items-center justify-content-md-end"
                      >
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
                      </Col>
                    </Row>
                    <hr />
                  </div>
                ))}
              </CardBody>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card className="rounded-4 border-0">
              <CardHeader className="bg-light border-0">
                <h2 className="mb-0 fw-semibold fs-5">Order Summary</h2>
              </CardHeader>
              <CardBody>
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
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ConfirmModal
          showConfirmModal={showConfirmModal}
          setShowConfirmModal={setShowConfirmModal}
          handleConfirmClear={handleConfirmClear}
          heading="Confirm Clear Cart"
          bodyText="Are you sure you want to clear all items from your cart?"
          confirmText="Yes, Clear Cart"
        />
      </Container>
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
