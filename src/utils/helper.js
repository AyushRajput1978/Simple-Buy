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
