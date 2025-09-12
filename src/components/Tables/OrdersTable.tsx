import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { Table, Dropdown, Card, ButtonGroup, Badge, Row } from 'react-bootstrap';
import { BsThreeDots } from 'react-icons/bs';
import { FaCheckCircle, FaTruck, FaBoxOpen, FaRegCheckSquare } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import type { ApiError, Order } from 'type';

import axios from '../../axios';
import { getStatusColor, getStatusLabel, toast } from '../../utils/helper';
import ConfirmModal from '../layout/AlertModal';
import { TableLoadingShimmer } from '../layout/LoadingShimmers';

interface OrderResponse {
  data: Order[];
  status: string;
}

const statusOptions = [
  {
    name: 'Confirmed',
    icon: <FaCheckCircle className="text-primary" />,
    value: 'confirmed',
    color: 'primary',
  },
  {
    name: 'Dispatched',
    icon: <FaTruck className="text-warning" />,
    value: 'dispatched',
    color: 'warning',
  },
  {
    name: 'Out for delivery',
    icon: <FaBoxOpen className="text-info" />,
    value: 'out for delivery',
    color: 'info',
  },
  {
    name: 'Delivered',
    icon: <FaRegCheckSquare className="text-success" />,
    value: 'delivered',
    color: 'success',
  },
];

const OrdersTable = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const fetchOrders = async (): Promise<Order[]> => {
    const res = await axios.get<OrderResponse>('/dashboard/orders');
    return res.data.data;
  };
  const {
    data: orders = [],
    isLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ['Orders'],
    queryFn: fetchOrders,
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await axios.patch(`/dashboard/orders/${id}`, { status });
      toast(`Order status marked as "${status}" successfully`);
      void refetchOrders();
    } catch (err) {
      toast('Failed to update status', false);
    }
  };

  const deleteOrder = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`/dashboard/orders/${id}`);
      toast('Order deleted successfully');
      void refetchOrders();
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      toast(error.response?.data.message || 'Something went wrong', false);
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmDeleteOrder = () => {
    if (orderId) {
      void deleteOrder(orderId);
      setShowConfirmModal(false);
      setOrderId(null);
    }
  };
  if (isLoading || loading) {
    return <TableLoadingShimmer />;
  }

  const renderDropdownItems = (order: Order) => (
    <>
      {statusOptions
        .filter((s) => s.value !== order.status)
        .map((s) => (
          <Dropdown.Item
            key={s.value}
            onClick={() => handleStatusUpdate(order._id, s.value)}
            className="d-flex align-items-center gap-1"
          >
            {s.icon} <span>{s.name}</span>
          </Dropdown.Item>
        ))}
      <Dropdown.Item
        className="text-danger d-flex align-items-center gap-1"
        onClick={() => {
          setShowConfirmModal(true);
          setOrderId(order._id);
        }}
      >
        <MdDelete />
        <span>Remove</span>
      </Dropdown.Item>
    </>
  );
  return (
    <Card border="light" className="shadow-sm vh-100">
      <Card.Body className="p-0 pb-4 justify-content-center">
        {orders.length > 0 ? (
          <div className="table-responsive h-50">
            <Table hover className="user-table" style={{ minWidth: '800px' }}>
              <thead>
                <tr>
                  <th>SNo.</th>
                  <th>Products</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>User</th>
                  <th>Shipping Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>
                      {order.orderItems.map((item) => (
                        <div key={item._id}>
                          {item?.product?.name} × {item.quantity} = {item.price}
                        </div>
                      ))}
                    </td>
                    <td>{order.totalAmount}</td>
                    <td>
                      <Badge bg={getStatusColor[order.status]}>
                        {getStatusLabel[order.status]}
                      </Badge>
                    </td>
                    <td>{order.user?.name || 'Guest'}</td>
                    <td>
                      {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                      {order.shippingAddress?.postalCode}
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

                        <Dropdown.Menu>{renderDropdownItems(order)}</Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <Row className="justify-content-center align-items-center text-dark fw-semibold p-4">
            No Orders Found
          </Row>
        )}
      </Card.Body>
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        handleConfirmClear={handleConfirmDeleteOrder}
        heading="Confirm Delete Order"
        bodyText="This action is permanent, Are you sure you want to permanently delete this order?"
        confirmText="Yes, I m sure"
      />
    </Card>
  );
};

export default OrdersTable;
