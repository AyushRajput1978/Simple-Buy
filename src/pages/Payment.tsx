import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import axios from '../axios';
import useCart from '../hooks/useCart';
import { toast } from '../utils/helper';

interface PaymentResponse {
  clientSecret: string;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
      padding: '10px 12px',
    },
    invalid: {
      color: '#fa755a',
    },
  },
};

const Payment = () => {
  const { cart, fetchCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0);
  const shipping = 30;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet.');
      setProcessing(false);
      return;
    }
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found.');
      setProcessing(false);
      return;
    }
    try {
      const { data } = await axios.post<PaymentResponse>('/payment/create-payment-intent', {
        subtotal,
        shipping,
      });
      // setClientSecret(data.clientSecret);
      console.log(data, 'data haia na');
      const paymentResult = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            address: {
              line1: '123 Street',
              city: 'Mumbai',
              postal_code: '400001',
              country: 'IN',
            },
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message || 'Payment Failed');
        setProcessing(false);
      } else if (paymentResult.paymentIntent.status === 'succeeded') {
        toast('Payment Successful');
        void fetchCart();
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow card-summary">
            <Card.Header>
              <h4 className="mb-0">Payment Summary</h4>
            </Card.Header>
            <Card.Body className="payment-summary">
              <p className="mb-4 text-muted">Enter your payment details below</p>

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

                <Form.Group className="mb-4">
                  <Form.Label>Card Details</Form.Label>
                  <div className="stripe-input">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                </Form.Group>

                <div className="mb-4">
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

                <Button type="submit" disabled={processing} className="w-100 btn-cta">
                  {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
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
