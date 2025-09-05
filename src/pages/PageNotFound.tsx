import { Col, Container, Row } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

import { Navbar } from '../components';

const PageNotFound = () => {
  return (
    <>
      <Navbar />
      <Container className="container my-3 py-3">
        <Row className="row">
          <Col className="col-md-12 py-5 bg-light text-center">
            <h1 className="p-3 display-5">404: Page Not Found</h1>
            <Link to="/" className="btn  btn-outline-dark mx-4">
              <FaArrowLeft /> Go Back to Home
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PageNotFound;
