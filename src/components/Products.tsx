import './index.css';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button, Row, Col, Container } from 'react-bootstrap';

import axios from '../axios';
import useCart from '../hooks/useCart';
import { ProductsLoadingShimmer } from './layout/LoadingShimmers';
import ProductCard from './layout/ProductCard';
import type {
  ProductCategoriesResponse,
  ProductCategoryType,
  ProductResponse,
  ProductType,
} from '../../type';

const Products = () => {
  const [filter, setFilter] = useState<ProductType[]>([]);
  const { addToCart } = useCart();

  const addProduct = (product: ProductType, variantId: string) => {
    void addToCart({ productId: product.id, variantId: variantId, quantity: 1 });
  };

  const fetchProductCategories = async (): Promise<ProductCategoryType[]> => {
    const res = await axios.get<ProductCategoriesResponse>('/product-categories');
    return res.data.data;
  };
  const { data: productCategories = [] } = useQuery<ProductCategoryType[]>({
    queryKey: ['product-categories'],
    queryFn: fetchProductCategories,
  });

  const fetchProducts = async (): Promise<ProductType[]> => {
    const res = await axios.get<ProductResponse>('/products');
    return res.data.data;
  };
  const { data: products, isLoading: isProductsLoading } = useQuery<ProductType[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    setFilter(products ?? []);
  }, [products]);

  const filterProducts = (cat: string) => {
    const updatedList = products?.filter((item: ProductType) => item.category.name === cat);
    setFilter(updatedList ?? []);
  };
  const ShowProducts = () => {
    const allProductCategories = [{ _id: 0, name: 'All' }, ...productCategories];
    return (
      <>
        <div className="text-center py-4">
          {allProductCategories.map((cat) => (
            <Button
              key={cat._id}
              variant="outline-primary"
              className="m-2 text-capitalize"
              onClick={() =>
                cat.name === 'All' ? setFilter(products ?? []) : filterProducts(cat.name)
              }
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <Row className="g-4">
          {filter?.map((product: ProductType) => (
            <Col key={product.id} md={6} lg={4} className="d-flex align-items-stretch">
              <ProductCard product={product} addProduct={addProduct} />
            </Col>
          ))}
        </Row>
      </>
    );
  };

  return (
    <Container className=" my-3 py-3 product-section">
      <Row>
        <Col>
          <h2 className="display-5 text-center text-primary">Latest Products</h2>
          <hr
            className="mx-auto"
            style={{
              width: '100px',
              borderTop: '3px solid var(--color-accent)',
            }}
          />
        </Col>
      </Row>
      <Row className="justify-content-center">
        {isProductsLoading ? <ProductsLoadingShimmer /> : <ShowProducts />}
      </Row>
    </Container>
  );
};

export default Products;
