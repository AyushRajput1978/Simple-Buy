import { Button, Card, Row, Col, Badge } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";

const AddressCard = ({ address, setAddresses, onEdit }) => {
  const handleDelete = () => {
    setAddresses((prev) =>
      prev.filter((a) => a.addressLine !== address.addressLine)
    );
  };

  return (
    <Card className="mb-3 shadow-sm border-0">
      <Card.Header className="d-flex justify-content-between align-items-center bg-light">
        <div>
          <strong>{address.addressLine}</strong>
          {address.isDefault && (
            <Badge bg="success" className="ms-2">
              Default
            </Badge>
          )}
        </div>
        <div>
          <Button
            variant="outline-primary"
            size="sm"
            className="me-2"
            onClick={() => onEdit(address)}
          >
            <FaEdit />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleDelete}>
            <FaTrash />
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="mb-1">
          <Col xs={4}>
            <strong>City:</strong>
          </Col>
          <Col xs={8}>{address.city}</Col>
        </Row>
        <Row className="mb-1">
          <Col xs={4}>
            <strong>State:</strong>
          </Col>
          <Col xs={8}>{address.state}</Col>
        </Row>
        <Row className="mb-1">
          <Col xs={4}>
            <strong>Country:</strong>
          </Col>
          <Col xs={8}>{address.country}</Col>
        </Row>
        <Row>
          <Col xs={4}>
            <strong>Postal Code:</strong>
          </Col>
          <Col xs={8}>{address.postalCode}</Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AddressCard;
