import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  capitaliseFirstAlphabet,
  getStatusColor,
  getStatusLabel,
  toast,
} from "../utils/helper";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "../axios";
import { isBefore } from "date-fns/fp";
import { format } from "date-fns";
import { IoReload } from "react-icons/io5";
import OrderStepper from "../components/layout/OrderStepper";
import useCart from "../hooks/useCart";

const UserOrders = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { addToCart } = useCart();

  const fetchOrders = async () => {
    const res = await axios("/user-orders");
    return res.data.data;
  };

  const {
    data: orders = [],
    isLoading: isOrderLoading,
    refetch: refetchOrders,
  } = useQuery({ queryKey: ["fetch-orders"], queryFn: fetchOrders });

  const handleCancelOrder = async (order_id) => {
    setIsLoading(true);
    try {
      await axios.patch(`/user-orders/${order_id}`, {
        status: "cancelled",
      });
      toast("Order cancelled successfully");
      refetchOrders();
    } catch (err) {
      toast(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReOrder = (orderItems) => {
    orderItems.forEach((item) => {
      addToCart(item.product._id, item.variantId, item.quantity);
    });
  };

  const isOrderDisabled = (order) => {
    return (
      isBefore(new Date(order.updated_at), new Date()) ||
      ["converted", "cancelled"].includes(order.status)
    );
  };

  if (isOrderLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  return (
    <Container className="my-5">
      {orders.length > 0 ? (
        orders.map((order) => (
          <Card
            className={`shadow-sm p-4 mb-5 rounded-4 ${
              isOrderDisabled(order) ? "opacity-75" : ""
            }`}
            key={order.id}
          >
            <Row className="mb-3 align-items-center">
              <Col>
                <h5 className="mb-0">
                  <Badge bg={getStatusColor[order.status]} className="p-2">
                    {getStatusLabel[order.status]}
                  </Badge>
                </h5>
              </Col>
              <Col className="text-end text-muted">
                <small>
                  {format(new Date(order.createdAt), "dd MMM yyyy")}
                </small>
              </Col>
            </Row>

            <hr />

            {order?.orderItems?.map((item) => (
              <Row
                key={item.id}
                className="align-items-center mb-3 pb-3 border-bottom"
              >
                <Col md={2} xs={4} className="text-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    width={100}
                    height={75}
                    className="rounded"
                  />
                </Col>

                <Col md={6} xs={8}>
                  <h6 className="mb-1">{item.product.name}</h6>
                  <p className="text-muted small mb-1">{item.product.brand}</p>
                  {item.variant?.value && (
                    <Badge bg="light" text="dark" className="mt-1">
                      {item.variant.value} {item.variant.name}
                    </Badge>
                  )}
                </Col>

                <Col
                  md={4}
                  xs={12}
                  className="text-md-end text-start mt-3 mt-md-0"
                >
                  <Badge bg="info" className="me-2">
                    Qty: {item.quantity}
                  </Badge>
                  <div className="fw-bold">₹{item.price}</div>
                </Col>
              </Row>
            ))}

            <Row className="my-4">
              <Col>
                <h6 className="fw-semibold">Total: ₹{order.totalAmount}</h6>
              </Col>

              <Col className="text-end">
                {console.log(order, "orders hi to hi")}
                <Button
                  variant="outline-success"
                  className="me-2"
                  onClick={() => handleReOrder(order.orderItems)}
                >
                  <IoReload /> Reorder
                </Button>
                {!isOrderDisabled(order) && (
                  <Button
                    variant="danger"
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Cancelling..." : "Cancel Order"}
                  </Button>
                )}
              </Col>
            </Row>
            <OrderStepper
              status={order.status}
              orderId={order.id}
              orderDate={format(new Date(order.createdAt), "dd MMM yyyy")}
            />
          </Card>
        ))
      ) : (
        <div className="text-center mt-5">
          <p className="text-muted fs-5">You have no order history</p>
        </div>
      )}
    </Container>
  );
};

export default UserOrders;
