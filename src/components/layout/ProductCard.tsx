import { Badge, Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { Product } from 'type';

interface ProductCardProps {
  product: Product;
  addProduct: (product: Product, varaintId: string) => void;
}

const ProductCard = ({ product, addProduct }: ProductCardProps) => {
  const vId = product.variants[0] ? product.variants[0].id : undefined;
  return (
    <Card className="shadow-sm w-100 h-100 product-card product-card-hover border-0">
      <Card.Img
        variant="top"
        src={product.image}
        alt={product.name}
        style={{ height: '300px', objectFit: 'contain' }}
        className="p-3"
      />
      <Card.Body className="d-flex flex-column">
        <div className="text-end">
          <Badge bg="secondary" className="text-capitalize ms-2">
            {product.category?.name || 'General'}
          </Badge>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <OverlayTrigger placement="top" overlay={<Tooltip>{product.name}</Tooltip>}>
            <Card.Title className="mb-0">
              {product.name.length > 30 ? `${product.name.substring(0, 30)}...` : product.name}
            </Card.Title>
          </OverlayTrigger>
        </div>

        <Card.Text className="text-muted mb-2" style={{ flex: 1 }}>
          {product.description.substring(0, 90)}...
        </Card.Text>

        <strong className="fw-bold mb-1 text-dark">$ {product.price}</strong>
        <div className="product-card">
          {/* Product content like image/title/etc */}

          {!!product.variants.length && (
            <div className="variant-hover">
              <div className="d-flex gap-2">
                <small>Size:</small>
                {product.variants.map((varnt, idx) => (
                  <small key={idx}>{varnt.attributeValue}</small>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <Link
            to={`/product/${product.id}`}
            className="btn me-2 text-white"
            style={{ backgroundColor: 'var(--color-cta)', border: 'none' }}
          >
            Buy Now
          </Link>
          <Button
            style={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
            }}
            variant="outline"
            onClick={() => vId && addProduct(product, vId)}
            disabled={!vId}
          >
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
export default ProductCard;
