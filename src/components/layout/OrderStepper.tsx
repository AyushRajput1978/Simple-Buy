import { ProgressBar, ListGroup, Badge } from 'react-bootstrap';
import type { OrderStatus } from 'type';

import { getStatusColor, getStatusLabel } from '../../utils/helper';

const statusSteps = [
  { key: 1, label: 'Order placed' },
  { key: 2, label: 'Shipped' },
  { key: 3, label: 'Delivered' },
];

const progressObj = {
  confirmed: 1,
  dispatched: 2,
  'out for delivery': 3,
  delivered: 4,
};

const OrderStepper = ({ status }: { status: OrderStatus }) => {
  const color = getStatusColor[status];
  const label = getStatusLabel[status];
  const isCancelled = status === 'cancelled';
  const progress = isCancelled ? 100 : (progressObj[status] / 4) * 100;

  return (
    <div className="p-3 border rounded  ">
      <h5 className="mb-3">
        Order Status:{' '}
        <Badge bg={color} className="p-2">
          {label}
        </Badge>
      </h5>

      <ProgressBar now={progress} variant={color} className="mb-3" />

      <ListGroup horizontal className="justify-content-between">
        {isCancelled ? (
          <ListGroup.Item variant="danger" className="flex-fill text-center">
            Cancelled
          </ListGroup.Item>
        ) : (
          statusSteps.map((step) => (
            <ListGroup.Item key={step.key} variant={color} className="flex-fill text-center">
              {step.label}
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </div>
  );
};

export default OrderStepper;
