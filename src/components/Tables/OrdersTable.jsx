import axios from "../../axios";
import { useQuery } from "@tanstack/react-query";

import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import {
  Table,
  Dropdown,
  Card,
  ButtonGroup,
  Badge,
  Row,
} from "react-bootstrap";
import { useReducer, useState } from "react";
import CustomToast from "../layout/CustomToast";
import TableLoading from "../layout/TableLoading";
import {
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
  FaRegCheckSquare,
} from "react-icons/fa";

const OrdersTable = () => {
  // Toast
  // Reducer for toast state
  const initialState = {
    showToast: false,
    toastBody: "",
    success: true,
  };

  const toastReducer = (state, action) => {
    switch (action.type) {
      case "SHOW_TOAST":
        return {
          ...state,
          showToast: true,
          toastBody: action.payload,
          success: action.success,
        };
      case "HIDE_TOAST":
        return { ...state, showToast: false };
      default:
        return state;
    }
  };
  //   const [showModal, setShowModal] = useState(false);
  //   const [initialData, setInitialData] = useState(null);
  const [toastState, dispatchToast] = useReducer(toastReducer, initialState);
  const [loading, setLoading] = useState(false);

  // Functions
  const fetchAllOrders = async () => {
    const res = await axios.get("/dashboard/orders");
    return res.data.data;
  };
  const handleEdit = async (id, status) => {
    const res = await axios.patch(`/dashboard/orders/${id}`, {
      status,
    });
    refetchOrders();
    setShowModal(true);
  };
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(`/dashboard/orders/${id}`);
      //  Show success toast
      dispatchToast({
        type: "SHOW_TOAST",
        payload: "Order deleted successfully",
        success: true,
      });
      refetchOrders();
    } catch (err) {
      dispatchToast({
        type: "SHOW_TOAST",
        payload: err.response.data.message || "Something went wrong",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // tanstack-react-query
  const {
    data,
    isLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["Orders"],
    queryFn: fetchAllOrders,
  });

  if (isLoading || loading) {
    return <TableLoading heading="Product" />;
  }
  const statuses = [
    {
      name: "Confirmed",
      icon: <FaCheckCircle className="text-primary" />,
      value: "confirmed",
    },
    {
      name: "Dispatched",
      icon: <FaTruck className="text-warning" />,
      value: "dispatched",
    },
    {
      name: "Out for delivery",
      icon: <FaBoxOpen className="text-info" />,
      value: "out for delivery",
    },
    {
      name: "Delivered",
      icon: <FaRegCheckSquare className="text-success" />,
      value: "delivered",
    },
  ];
  return (
    <Card border="light" className="shadow-sm vh-100">
      <Card.Body className="p-0 pb-4 justify-content-center">
        {data.length > 0 ? (
          <div className="table-responsive  h-50">
            <Table hover className="user-table" style={{ minWidth: "800px" }}>
              <thead>
                <tr>
                  <th className="border-bottom">SNo.</th>
                  <th className="border-bottom">Products</th>
                  <th className="border-bottom">Total Amount</th>
                  <th className="border-bottom">Status</th>
                  <th className="border-bottom">User</th>
                  <th className="border-bottom">Shipping Address</th>
                  <th className="border-bottom">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order, index) => (
                  <tr key={order._id}>
                    <td text-label="SNo.">
                      <span className="fw-normal">{index + 1}</span>
                    </td>

                    <td text-label="Products">
                      {order.orderItems.map((item) => (
                        <div className="fw-normal">
                          {item.product.name} x {item.quantity}={item.price}
                        </div>
                      ))}
                    </td>
                    <td text-label="Total Amount">
                      <span className="fw-normal">{order.totalAmount}</span>
                    </td>
                    <td text-label="Status">
                      <Badge
                        className="fw-normal"
                        bg={`${
                          order.status === "dispatched"
                            ? "warning"
                            : order.status === "out for delivery"
                            ? "info"
                            : order.status === "delivered"
                            ? "success"
                            : "primary"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td text-label="User">
                      <span className="fw-normal">{order.user.name}</span>
                    </td>
                    <td text-label="Shipping Address">
                      <span className="fw-normal">
                        {order.shippingAddress.address},
                        {order.shippingAddress.city},
                        {order.shippingAddress.postalCode}
                      </span>
                    </td>
                    <td>
                      <Dropdown as={ButtonGroup} drop="down-centered">
                        <Dropdown.Toggle
                          as="button"
                          className="btn btn-link text-dark m-0 p-0 border-0 shadow-none"
                          id={`dropdown-button-${order._id}`}
                        >
                          <BsThreeDots size={18} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {statuses
                            .filter((sta) => sta.value !== order.status)
                            .map((availableStatus) => (
                              <Dropdown.Item
                                onClick={() => {
                                  handleEdit(order._id, availableStatus.value);
                                }}
                                className="d-flex align-items-center gap-1"
                              >
                                {availableStatus.icon}{" "}
                                <span>{availableStatus.name}</span>
                              </Dropdown.Item>
                            ))}
                          <Dropdown.Item
                            className="text-danger d-flex align-items-center gap-1"
                            onClick={() => handleDelete(order._id)}
                          >
                            <MdDelete />
                            <span>Remove</span>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <Row className="justify-content-center align-item-center text-dark fontweigh-500 p-4">
            No Data Available.....
          </Row>
        )}
      </Card.Body>

      <CustomToast
        show={toastState.showToast}
        toastBody={toastState.toastBody}
        setShow={() => dispatchToast({ type: "HIDE_TOAST" })}
        success={toastState.success}
      />
    </Card>
  );
};

export default OrdersTable;
