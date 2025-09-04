import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Marquee from 'react-fast-marquee';
import { Link, useParams } from 'react-router-dom';
import type { DetailedProduct, Product, Variant } from 'type';

import axios from '../axios';
import {
  DetailedProductLoadingShimmer,
  SimilarProductsLoadingShimmer,
} from '../components/layout/LoadingShimmers';
import ProductCard from '../components/layout/ProductCard';
import Reviews from '../components/Reviews';
import useCart from '../hooks/useCart';
import RatingStars from '../utils/RatingStars';

interface ProductResponse {
  status: string;
  data: DetailedProduct;
}
interface SimilarProductsResponse {
  data: {
    similarProducts: Product[];
  };
}
const Product = () => {
  const { id } = useParams();
  const [selectedVariant, setSelectedVariant] = useState<Variant>({
    attributeName: '',
    attributeValue: '',
    regularPrice: 0,
    id: '',
    countInStock: 0,
  });
  const { addToCart } = useCart();

  const addProduct = (product: Product) => {
    void addToCart({ productId: product.id, variantId: selectedVariant.id, quantity: 1 });
  };

  const fetchProduct = async ({
    queryKey,
  }: {
    queryKey: [string, string];
  }): Promise<DetailedProduct> => {
    const [_, id] = queryKey;
    const res = await axios.get<ProductResponse>(`/products/${id}`);
    return res.data.data;
  };
  const {
    data: product,
    isLoading: productLoading,
    refetch: refetchProductDetail,
  } = useQuery({
    queryKey: ['detailed-product', id] as [string, string],
    queryFn: fetchProduct,
    enabled: !!id,
  });

  const fetchSimilarProducts = async ({
    queryKey,
  }: {
    queryKey: [string, string];
  }): Promise<Product[]> => {
    const [_, id] = queryKey;
    const res = await axios.get<SimilarProductsResponse>(`/products/${id}/similar`);

    return res?.data?.data?.similarProducts;
  };
  const { data: similarProducts, isLoading: simlarProductLoading } = useQuery({
    queryKey: ['similar-product', id] as [string, string],
    queryFn: fetchSimilarProducts,
    enabled: !!id,
  });
  useEffect(() => {
    if (product) {
      const defaultVariant = product.variants?.[0] || {
        attributeName: 'default',
        attributeValue: 'default',
        regularPrice: 0,
        id: product.id,
        countInStock: 0,
      };
      setSelectedVariant(defaultVariant);
    }
  }, [product]);
  console.log(product, 'product');
  const ShowProduct = () => {
    return (
      <Container className="my-5 py-2">
        <Row>
          <Col md={6} className="py-3">
            <img
              className="img-fluid"
              src={product?.image}
              alt={product?.name}
              width="400px"
              height="400px"
            />
          </Col>
          <Col md={6} className="py-3">
            <small className="text-uppercase text-muted fs-5">{product?.category.name}</small>
            <h1 className="display-6">{product?.name}</h1>
            <RatingStars ratings={product?.ratingsAverage} />
            <p className="fs-4 my-3">₹{selectedVariant.regularPrice}</p>
            <div className="d-flex gap-2 mb-2">
              <span className="my-auto">Size:</span>
              {product &&
                product.variants.map((varnt) => (
                  <Button
                    variant="outline-primary"
                    disabled={varnt.attributeValue === selectedVariant.attributeValue}
                    onClick={() => {
                      setSelectedVariant(varnt);
                    }}
                  >
                    {varnt.attributeValue}
                  </Button>
                ))}
            </div>
            <p className="lead">{product?.description}</p>
            <Button variant="outline-dark" onClick={() => addProduct(product)}>
              Add to Cart
            </Button>
            <Link to="/cart" className="btn btn-dark mx-3">
              Go to Cart
            </Link>
          </Col>
        </Row>
      </Container>
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
    <Container className="my-5 py-4 px-4 rounded product-detail-section">
      <Row>{productLoading ? <DetailedProductLoadingShimmer /> : <ShowProduct />}</Row>
      <Row className="my-5 py-5">
        <div className="d-none d-md-block">
          <h2 className="">You may also Like</h2>
          <Marquee pauseOnHover={true} pauseOnClick={true} speed={50} autoFill={true}>
            {simlarProductLoading ? <SimilarProductsLoadingShimmer /> : <ShowSimilarProduct />}
          </Marquee>
        </div>
      </Row>
      {!productLoading && (
        <Reviews
          productId={product?.id}
          reviews={product?.reviews}
          reviewsCount={product?.ratingsQuantity}
          ratingsAverage={product?.ratingsAverage}
          refetchProductDetail={refetchProductDetail}
        />
      )}
    </Container>
  );
};

export default Product;
