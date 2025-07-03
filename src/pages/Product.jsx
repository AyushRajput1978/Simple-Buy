import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import axios from "../axios";
import { useQuery } from "@tanstack/react-query";
import Reviews from "../components/Reviews";
import RatingStars from "../utils/RatingStars";
import ProductCard from "../components/layout/ProductCard";
import useCart from "../hooks/useCart";
import { useState } from "react";
import CustomToast from "../components/layout/CustomToast";
import { Col, Row } from "react-bootstrap";

const Product = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("");
  const [success, setSuccess] = useState(true);
  const { id } = useParams();

  const { addToCart } = useCart();

  const addProduct = (product) => {
    addToCart(product.id, 1, setShowToast, setToastBody, setSuccess);
  };

  // get products functions
  const getProduct = async ({ queryKey }) => {
    const [_, id] = queryKey;
    const res = await axios(`/products/${id}`);
    return res.data.data;
  };
  const getSimilarProducts = async ({ queryKey }) => {
    const [_, id] = queryKey;
    const res = await axios(`/products/${id}/similar`);

    return res?.data?.data?.similarProducts;
  };

  // useQuery to get the products and cached the result
  const {
    data: product,
    isLoading: productLoading,
    refetch: refetchProductDetail,
  } = useQuery({
    queryKey: ["detailed-product", id],
    queryFn: getProduct,
  });
  const { data: similarProducts, isLoading: simlarProductLoading } = useQuery({
    queryKey: ["similar-product", id],
    queryFn: getSimilarProducts,
  });
  const ProductLoading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };
  const ShowProduct = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 col-sm-12 py-3">
              <img
                className="img-fluid"
                src={product?.image}
                alt={product?.name}
                width="400px"
                height="400px"
              />
            </div>
            <div className="col-md-6 col-md-6 py-5">
              <h4 className="text-uppercase text-muted">
                {product?.category.name}
              </h4>
              <h1 className="display-5">{product?.name}</h1>
              <RatingStars ratings={product?.ratingsAverage} />
              <h3 className="display-6  my-4">${product?.price}</h3>
              <p className="lead">{product?.description}</p>
              <button
                className="btn btn-outline-dark"
                onClick={() => addProduct(product)}
              >
                Add to Cart
              </button>
              <Link to="/cart" className="btn btn-dark mx-3">
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  };

  const SimilarProductsLoading = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <div className="py-4 my-4">
        <Row className="g-4">
          {similarProducts.map((product) => (
            <Col key={product.id} md={4} sm={6} xs={12} className="d-flex">
              <ProductCard product={product} addProduct={addProduct} />
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <div className="container my-5 py-4 px-4 rounded product-detail-section">
      <div className="row">
        {productLoading ? <ProductLoading /> : <ShowProduct />}
      </div>
      <div className="row my-5 py-5">
        <div className="d-none d-md-block">
          <h2 className="">You may also Like</h2>
          <Marquee
            pauseOnHover={true}
            pauseOnClick={true}
            speed={50}
            autoFill={true}
          >
            {simlarProductLoading ? (
              <SimilarProductsLoading />
            ) : (
              <ShowSimilarProduct />
            )}
          </Marquee>
        </div>
      </div>
      {!productLoading && (
        <Reviews
          productId={product?.id}
          reviews={product?.reviews}
          reviewsCount={product?.ratingsQuantity}
          ratingsAverage={product?.ratingsAverage}
          refetchProductDetail={refetchProductDetail}
        />
      )}
      <CustomToast
        show={showToast}
        toastBody={toastBody}
        setShow={setShowToast}
        success={success}
      />
    </div>
  );
};

export default Product;
