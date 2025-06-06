import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "../axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import CustomToast from "../components/layout/CustomToast";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      "::placeholder": {
        color: "#aab7c4",
      },
      padding: "10px 12px",
    },
    invalid: {
      color: "#fa755a",
    },
  },
};

const Payment = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("");
  const [success, setSuccess] = useState(true);
  const { cart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 30;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet.");
      setProcessing(false);
      return;
    }

    try {
      const { data } = await axios.post("/payment/create-payment-intent", {
        subtotal,
        shipping,
      });

      setClientSecret(data.clientSecret);

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name, // required
            address: {
              line1: "123 Street",
              city: "Mumbai",
              postal_code: "400001",
              country: "IN", // ISO 2-letter country code
            },
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else if (result.paymentIntent.status === "succeeded") {
        setShowToast(true);
        setToastBody("Payment Successful");
        setSuccess(true);
        cart();
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <Container className="py-5">
      <CustomToast
        show={showToast}
        toastBody={toastBody}
        setShow={setShowToast}
        success={success}
      />

      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h4 className="mb-0">Bill Summary</h4>
            </Card.Header>
            <Card.Body style={{ backgroundColor: "#f9f9f9" }}>
              <p className="mb-4">Enter your payment details</p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name on Card</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Card Details</Form.Label>
                  <div
                    style={{
                      padding: "10px 12px",
                      border: "1px solid #ced4da",
                      borderRadius: "0.375rem",
                      backgroundColor: "#fff",
                    }}
                  >
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                </Form.Group>

                <div className="mb-3">
                  <p>
                    <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
                  </p>
                  <p>
                    <strong>Shipping:</strong> ${shipping.toFixed(2)}
                  </p>
                  <h5>
                    <strong>Total:</strong> ${total.toFixed(2)}
                  </h5>
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="w-100"
                  variant="primary"
                >
                  {processing ? "Processing..." : `Pay $${total}`}
                </Button>
              </Form>
              {error && <div className="text-danger mt-3">{error}</div>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Payment;
