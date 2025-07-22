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
        {[
          { label: "City", name: "city" },
          { label: "State", name: "state" },
          { label: "Country", name: "country" },
          { label: "Postal Code", name: "postalCode" },
        ].map(({ label, name }) => (
          <Row className="mb-1">
            <Col xs={4}>
              <strong>{label}</strong>
            </Col>
            <Col xs={8}>{address[name]}</Col>
          </Row>
        ))}
      </Card.Body>
    </Card>
  );
};

export default AddressCard;
