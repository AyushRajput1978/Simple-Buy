import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="custom-footer mt-auto text-light text-center text-md-start">
      <Container className="py-4">
        <Row>
          <Col md={6} className="mb-4 mb-md-0">
            <h5 className="fw-bold">Simple Buy</h5>
            <p className="small">
              Your trusted destination for electronics, fashion, and more.
            </p>
          </Col>

          <Col md={3} className="mb-4 mb-md-0">
            <h6 className="text-uppercase">Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <a
                  href="/about"
                  className="text-light text-decoration-none small"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-light text-decoration-none small"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-light text-decoration-none small"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-light text-decoration-none small"
                >
                  Privacy
                </a>
              </li>
            </ul>
          </Col>

          <Col md={3} className="text-md-end">
            <h6 className="text-uppercase">Connect</h6>
            <a
              className="text-light fs-5 me-3"
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa fa-github"></i>
            </a>
            <a className="text-light fs-5" href="mailto:support@example.com">
              <i className="fa fa-envelope"></i>
            </a>
          </Col>
        </Row>

        <hr className="border-light" />
        <div className="text-center small">
          &copy; {new Date().getFullYear()} Simple Buy. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
