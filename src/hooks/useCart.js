import axios from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { cartItemsSet } from "../redux/reducer/cartSlice";

const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.userCart.cart || []);

  const fetchCart = async () => {
    try {
      const res = await axios("/cart");
      dispatch(cartItemsSet(res.data.data.items));
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const addToCart = async (
    productId,
    // dis_id,
    quantity,
    setShowToast,
    setToastBody,
    setSuccess
    // variantId
  ) => {
    try {
      const res = await axios({
        method: "post",
        url: "/cart/add",
        data: {
          productId,
          //   dis_id: Array.isArray(dis_id) ? dis_id : [dis_id],
          //   variant_id: Array.isArray(variantId) ? variantId : [variantId],
          quantity,
        },
      });

      fetchCart();
      setShowToast(true);
      setToastBody("Product added successfully");
      setSuccess(true);
    } catch (err) {
      setShowToast(true);
      setToastBody(err.response?.data?.message || "Error adding to cart.");
      setSuccess(false);
    }
  };
  const updateCart = async (
    productId,
    action,
    setShowToast,
    setToastBody,
    setSuccess
    // variantId
  ) => {
    try {
      const res = await axios({
        method: "post",
        url: "/cart/update",
        data: {
          productId,
          action,
        },
      });

      fetchCart();
      setShowToast(true);
      setToastBody("Product updated successfully");
      setSuccess(true);
    } catch (err) {
      setShowToast(true);
      setToastBody(err.response?.data?.message || "Error adding to cart.");
      setSuccess(false);
    }
  };

  // const removeProduct = async (
  //   productId,
  //   setShowToast,
  //   setToastBody,
  //   setSuccess
  // ) => {
  //   try {
  //     const res = await axios({
  //       method: "post",
  //       url: "cart/remove",
  //       data: { productId },
  //     });
  //     fetchCart();
  //     setShowToast(true);
  //     setToastBody(res.data.data.message);
  //     setSuccess(true);
  //   } catch (err) {
  //     setShowToast(true);
  //     setToastBody(err.response.data.message);
  //     setSuccess(false);
  //   }
  // };
  //   const updateCart = async (
  //     product_id,
  //     // dis_id,
  //     quantity,
  //     type,
  //     setShowToast,
  //     setToastBody,
  //     setSuccess
  //     // variantId
  //   ) => {
  //     if (type === "increment") {
  //       updatedCartItems.map((cartItem) =>
  //         cartItem.product_id === product_id
  //           ? // cartItem.dis_id === dis_id &&
  //             // cartItem.variant_id === variantId
  //             cartItem.quantity++
  //           : cartItem
  //       );
  //     } else {
  //       if (quantity > 1) {
  //         updatedCartItems.map((cartItem) =>
  //           cartItem.product_id === product_id
  //             ? //   cartItem.dis_id === dis_id &&
  //               //   cartItem.variant_id === variantId
  //               cartItem.quantity--
  //             : cartItem
  //         );
  //       } else {
  //         updatedCartItems = updatedCartItems.filter(
  //           (cartItem) =>
  //             !(
  //               (cartItem.product_id === product_id)
  //               //   cartItem.dis_id === dis_id &&
  //               //   cartItem.variant_id === variantId
  //             )
  //         );
  //       }
  //     }
  //     const product_ids = updatedCartItems.map((cartItem) => cartItem.product_id);
  //     const quantities = updatedCartItems.map((cartItem) => cartItem.quantity);
  //     // const dis_ids = updatedCartItems.map((cartItem) => cartItem.dis_id);
  //     // const variantIds = updatedCartItems.map((cartItem) => cartItem.variant_id);
  //     // const applied_coupon = cart?.applied_coupon?.coupon_id || "";
  //     dispatch(loadingSet(true));

  //     try {
  //       const res = await axios({
  //         method: "post",
  //         url: "/cart/add",
  //         data: {
  //           product_id: product_ids,
  //           quantity: quantities,
  //           //   dis_id: dis_ids,
  //           //   coupon_id: applied_coupon,
  //           //   variant_id: variantIds,
  //         },
  //       });
  //       fetchCart();
  //       setShowToast(true);

  //       setToastBody(res?.data?.message);

  //       setSuccess(true);
  //     } catch (err) {
  //       console.log(err, "erorr");
  //       setShowToast(true);
  //       setToastBody(err.response.data.message);
  //       setSuccess(false);
  //     } finally {
  //       dispatch(loadingSet(false));
  //     }
  //   };
  const deleteCart = async (setShowToast, setToastBody, setSuccess) => {
    try {
      const res = await axios({
        method: "post",
        url: "/cart/clear",
      });
      fetchCart();
    } catch (err) {
      setShowToast(true);
      setToastBody(err.response.data.message);
      setSuccess(false);
    }
  };

  return {
    cart,
    addToCart,
    updateCart,
    // removeProduct,
    fetchCart,
    deleteCart,
  };
};

export default useCart;
