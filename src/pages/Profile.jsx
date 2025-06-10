import { useEffect, useState } from "react";

import { Col, Row, Button, Card, Form } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "../axios";

import ImageUploader from "../components/layout/ImageUploader";
import CustomToast from "../components/layout/CustomToast";
import AddressCard from "../components/layout/AddressCard";
import AddEditAddress from "../components/AddEditModals/AddEditAddress";
import { handleChange } from "../utils/helper";

const MyProfile = () => {
  const [profileImage, setProfileImage] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState({});

  //customtoast states
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState("");
  const [success, setSuccess] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    addresses: [],
  });
  const [error, setError] = useState({
    name: "",
    email: "",
    phoneNo: "",
    addresses: "",
  });
  const userData = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  //useEffects

  useEffect(() => {
    setFormData({
      ...formData,
      email: userData.email,
      name: userData.name,
      phoneNo: userData.phoneNo,
      addresses: userData.addresses,
    });
    setProfileImage(userData.photo);
  }, [userData]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      return await axios({
        method: "PATCH",
        url: "/user/update-me",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["update-loggedin-user"]);
      console.log("ye chala");
      setShowToast(true);
      setToastBody("Profile updated successfully");
      setSuccess(true);
    },
    onError: (error) => {
      console.error("Failed to submit:", error);
      setShowToast(true);
      setToastBody(err.response?.data?.message || "Error updating profile");
      setSuccess(false);
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ["name", "email", "phoneNo"];
    let newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = `*${field} is mandatory`;
    });

    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setShowToast(true);
      setToastBody("Please fill all the mandatory fields");
      setSuccess(false);
      return;
    }
    const form = new FormData();
    for (const key in formData) {
      if (key === "addresses")
        form.append("addresses", JSON.stringify(formData.addresses));
      else form.append(key, formData[key]);
    }
    form.append("photo", profileImage);
    mutate(form);
    // try {
    //   setLoading(true);
    //   const res = await axios({
    //     method: "PATCH",
    //     url: "/user/update-me",
    //     data: form,
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   });

    //   setShowToast(true);
    //   setToastBody("Profile updated successfully");
    //   setSuccess(true);
    // } catch (err) {
    //   console.error(err);
    //   setShowToast(true);
    //   setToastBody(err.response?.data?.message || "Error updating profile");
    //   setSuccess(false);
    // } finally {
    //   setLoading(false);
    // }
  };
  return (
    <>
      <Card border="light" className="bg-white shadow-sm mb-4  ">
        <h3 className="text-center m-2 green-color fontweigh-500">
          My Profile
        </h3>
        <Card.Body>
          <Form className="mt-4" onSubmit={handleSubmit}>
            <Row className="justify-content-center mb-4">
              <Col md={4} lg={3} className=" d-flex justify-content-center">
                <ImageUploader
                  img={profileImage}
                  setImg={setProfileImage}
                  className="user-avatar large-avatar rounded-circle mx-auto mt-n7 mb-4"
                  size="180 X 180"
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={6} md={4} lg={3} className="mb-3">
                <Form.Group id="firstName">
                  <Form.Label>
                    Full Name<span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange(e, setFormData)}
                    placeholder="Enter your full name"
                  />
                </Form.Group>
                <p className="text-danger">{error.name}</p>
              </Col>
              <Col sm={6} md={4} lg={3} className="mb-3">
                <Form.Group id="emal">
                  <Form.Label>
                    Email<span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled={true}
                    onChange={(e) => handleChange(e, setFormData)}
                    placeholder="name@company.com"
                  />
                </Form.Group>
              </Col>
              <Col sm={6} md={4} lg={3} className="mb-3">
                <Form.Group id="phone">
                  <Form.Label>
                    Phone Number<span className="text-danger">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    name="phoneNo"
                    type="text"
                    value={formData.phoneNo}
                    onChange={(e) => handleChange(e, setFormData)}
                    placeholder="Enter phone number"
                  />
                </Form.Group>
                <p className="text-danger">{error.phoneNo}</p>
              </Col>
            </Row>

            <h5 className="my-4 fontweigh-500 fs-4">Address</h5>

            <Row>
              {formData.addresses.map((address) => (
                <Col key={address.addressLine} md={4}>
                  <AddressCard
                    address={address}
                    setAddresses={(fn) =>
                      setFormData((prev) => ({
                        ...prev,
                        addresses: fn(prev.addresses),
                      }))
                    }
                    onEdit={(address) => {
                      setEditAddress(address); // populate modal
                      setShowAddressModal(true);
                    }}
                  />
                </Col>
              ))}
              <Col>
                <Button
                  variant="link"
                  onClick={() => setShowAddressModal(true)}
                >
                  +Add Address
                </Button>
              </Col>
            </Row>
            <div className="mt-3">
              <Button
                className="green-btn fontweigh-500"
                type="submit"
                variant="primary"
              >
                Save
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <AddEditAddress
        show={showAddressModal}
        handleClose={() => {
          setShowAddressModal(false);
          setEditAddress({});
        }}
        setAddresses={(fn) =>
          setFormData((prev) => ({
            ...prev,
            addresses: fn(prev.addresses),
          }))
        }
        data={editAddress}
      />
      <CustomToast
        show={showToast}
        toastBody={toastBody}
        setShow={setShowToast}
        success={success}
      />
    </>
  );
};
export default MyProfile;
