import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import { Spinner } from "react-bootstrap";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 30;
  const total = Math.round(subtotal + shipping);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post("/api/create-payment-intent", {
          amount: total * 100,
        });
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error(err);
        setError("Failed to initiate payment.");
      }
    };

    if (cart.length > 0) createPaymentIntent();
  }, [cart]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        setSuccess("Payment successful!");
        clearCart();
        setTimeout(() => navigate("/"), 3000);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Checkout</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Card Details</label>
            <CardElement className="form-control p-2" />
          </div>
          <h5>Total: ${total}</h5>
          <button
            className="btn btn-dark"
            type="submit"
            disabled={!stripe || !clientSecret || processing}
          >
            {processing ? <Spinner animation="border" size="sm" /> : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
