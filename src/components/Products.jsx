import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Badge,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";

import "./index.css";
import axios from "../axios";
import { useQuery } from "@tanstack/react-query";
import useCart from "../hooks/useCart";
import CustomToast from "./layout/CustomToast";
import ProductCard from "./layout/ProductCard";

const Products = () => {
  const [filter, setFilter] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("");
  const [success, setSuccess] = useState(true);
  const { addToCart } = useCart();

  const addProduct = (product) => {
    addToCart(product.id, 1, setShowToast, setToastBody, setSuccess);
  };

  const getProducts = async () => {
    const response = await axios("/products");
    return response.data.data;
  };
  const {
    data,
    isLoading: productsLoading,
    // error: productsError,
    // refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  useEffect(() => {
    setFilter(data);
  }, [data]);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };
  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category.name === cat);
    setFilter(updatedList);
  };
  const ShowProducts = () => {
    return (
      <>
        <div className="text-center py-4">
          {[
            "All",
            "Men's clothing",
            "Women's clothing",
            "Jewelery",
            "Electronics",
          ].map((cat) => (
            <Button
              key={cat}
              variant="outline-primary"
              className="m-2 text-capitalize"
              onClick={() =>
                cat === "All" ? setFilter(data) : filterProduct(cat)
              }
            >
              {cat}
            </Button>
          ))}
        </div>

        <Row className="g-4">
          {filter?.map((product) => (
            <Col
              key={product.id}
              md={6}
              lg={4}
              className="d-flex align-items-stretch"
            >
              <ProductCard product={product} addProduct={addProduct} />
            </Col>
          ))}
        </Row>
      </>
    );
  };

  return (
    <>
      <div className="container my-3 py-3 product-section">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center text-primary">
              Latest Products
            </h2>
            <hr
              className="mx-auto"
              style={{
                width: "100px",
                borderTop: "3px solid var(--color-accent)",
              }}
            />
          </div>
        </div>
        <div className="row justify-content-center">
          {productsLoading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
      <CustomToast
        show={showToast}
        toastBody={toastBody}
        setShow={setShowToast}
        success={success}
      />
    </>
  );
};

export default Products;
