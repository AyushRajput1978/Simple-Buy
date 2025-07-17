import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from "react-bootstrap";

const AboutPage = () => {
  const productCategories = [
    {
      image:
        "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Men's Clothing",
    },
    {
      image:
        "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Women's Clothing",
    },
    {
      image:
        "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Jewellery",
    },
    {
      image:
        "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Electronics",
    },
  ];
  return (
    <Container className="my-3 py-3">
      <h1 className="text-center">About Us</h1>
      <hr />
      <p className="lead text-center">
        We Provide the best in quality products with reasonable price. You can
        trust our quality as we put our products under 3 checks before giving
        clearance. We have served over 1 million customers till now.
      </p>

      <h2 className="text-center py-4">Our Products</h2>
      <Row>
        {productCategories.map((cat) => (
          <Col lg={3} md={4} sm={6} className=" mb-3 px-3">
            <Card className="h-100">
              <img
                className="card-img-top img-fluid"
                src={cat.image}
                alt="cat.name"
                height={160}
              />
              <CardBody>
                <CardTitle className="text-center">{cat.name}</CardTitle>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AboutPage;
