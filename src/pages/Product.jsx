import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import axios from "../axios";
import { useQuery } from "@tanstack/react-query";
import Reviews from "../components/Reviews";
import RatingStars from "../utils/RatingStars";

const Product = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addItem(product));
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
      <>
        <div className="py-4 my-4">
          <div className="d-flex">
            {similarProducts.map((item) => {
              return (
                <div key={item.id} className="card mx-4 text-center">
                  <img
                    className="card-img-top p-3"
                    src={item.image}
                    alt="Card"
                    height={300}
                    width={300}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {item.name.substring(0, 15)}...
                    </h5>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">${item.price}</li>
                  </ul>
                  <div className="card-body">
                    <Link
                      to={"/product/" + item.id}
                      className="btn btn-dark m-1"
                    >
                      Buy Now
                    </Link>
                    <button
                      className="btn btn-dark m-1"
                      onClick={() => addProduct(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="container">
      <div className="row">
        {productLoading ? <ProductLoading /> : <ShowProduct />}
      </div>
      <div className="row my-5 py-5">
        <div className="d-none d-md-block">
          <h2 className="">You may also Like</h2>
          <Marquee pauseOnHover={true} pauseOnClick={true} speed={50}>
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
    </div>
  );
};

export default Product;
