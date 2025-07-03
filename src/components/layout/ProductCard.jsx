import { Badge, Button, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCard = ({ product, addProduct }) => {
  return (
    <Card className="shadow-sm w-100 h-100 product-card product-card-hover border-0">
      <Card.Img
        variant="top"
        src={product.image}
        alt={product.name}
        style={{ height: "300px", objectFit: "contain" }}
        className="p-3"
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{product.name}</Tooltip>}
          >
            <Card.Title className="mb-0">
              {product.name.length > 30
                ? `${product.name.substring(0, 30)}...`
                : product.name}
            </Card.Title>
          </OverlayTrigger>
          <Badge bg="secondary" className="text-capitalize ms-2">
            {product.category?.name || "General"}
          </Badge>
        </div>

        <Card.Text className="text-muted mb-2" style={{ flex: 1 }}>
          {product.description.substring(0, 90)}...
        </Card.Text>

        <h5 className="fw-bold mb-3 text-dark">$ {product.price}</h5>

        <div className="mt-auto">
          <Button
            as={Link}
            to={`/product/${product.id}`}
            style={{
              backgroundColor: "var(--color-cta)",
              border: "none",
            }}
            className="me-2 text-white"
          >
            Buy Now
          </Button>
          <Button
            style={{
              borderColor: "var(--color-primary)",
              color: "var(--color-primary)",
            }}
            variant="outline"
            onClick={() => addProduct(product)}
          >
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
export default ProductCard;
