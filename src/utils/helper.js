import { store } from "../redux/store";
import { showToast } from "../redux/reducer/toastSlice";

export const valuehandler = (arr, value) =>
  arr?.find((opt) => opt.value === value);

export const handleChange = (e, setFormData) => {
  const { name, value } = e.target;

  if (name === "phone_number" || name === "phone_no") {
    const numericValue = value.replace(/\D/g, "");
    const truncatedValue = numericValue.slice(0, 10);

    setFormData((prevData) => ({
      ...prevData,
      [name]: truncatedValue,
    }));
  } else if (name === "postalCode") {
    const numericValue = value.replace(/\D/g, "");
    const truncatedValue = numericValue.slice(0, 5);

    setFormData((prevData) => ({
      ...prevData,
      [name]: truncatedValue,
    }));
  } else {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "",
    }));
  }
};

export const toast = (message, success = true) => {
  store.dispatch(showToast({ message, success }));
};

export const capitaliseFirstAlphabet = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getStatusColor = {
  confirmed: "warning",
  disptached: "secondary",
  "out for delivery": "info",
  delivered: "success",
  cancelled: "danger",
};
export const getStatusLabel = {
  confirmed: "Order Placed",
  dispatched: "Shipped",
  "out for delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
