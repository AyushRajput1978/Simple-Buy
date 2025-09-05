import { Container, Row, Col, Image, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import sorryImage from '../../../public/assets/sorry.jpg';

type NoProductProps = {
  title?: string;
  message?: string;
  onRefresh?: () => void;
  className?: string;
};

export default function NoProduct({
  title = 'This product is no longer available',
  message = 'It may have been removed or is out of stock. You can browse similar items or head back home.',
  onRefresh,
  className = '',
}: NoProductProps) {
  return (
    <Container
      fluid
      className={`d-flex align-items-center justify-content-center min-vh-75 py-5 bg-light ${className}`}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm text-center border-0 rounded-4">
            <Card.Body className="p-5">
              <div className="mb-4">
                <Image
                  src={sorryImage}
                  alt="Sorry, no product"
                  fluid
                  rounded
                  className="mx-auto"
                  style={{ maxWidth: '260px' }}
                />
              </div>

              <h2 className="fw-semibold mb-3">{title}</h2>
              <p className="text-muted mb-4">{message}</p>

              <div className="d-flex flex-wrap justify-content-center gap-2">
                <Link to="/products" className="btn btn-cta w-100">
                  Browse Products
                </Link>

                {onRefresh ? (
                  <Button variant="outline-secondary" onClick={onRefresh}>
                    Refresh Page
                  </Button>
                ) : (
                  <Button variant="outline-secondary" onClick={() => window.location.reload()}>
                    Refresh Page
                  </Button>
                )}

                <Button variant="link" href="/" className="text-decoration-none">
                  Go Home
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
