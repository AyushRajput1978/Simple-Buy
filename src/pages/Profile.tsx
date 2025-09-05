import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Col, Row, Button, Card, Form, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import type { Address, ApiError, RootState } from 'type';

import axios from '../axios';
import AddEditAddress from '../components/AddEditModals/AddEditAddress';
import AddressCard from '../components/layout/AddressCard';
import ImageUploader from '../components/layout/ImageUploader';
import { handleChange, toast } from '../utils/helper';

type FormState = {
  name: string;
  email: string;
  phoneNo: string;
  addresses: Address[];
};

type FormErrors = Partial<Record<keyof FormState, string>>;
const MyProfile = () => {
  const [profileImage, setProfileImage] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phoneNo: '',
    addresses: [
      {
        addressLine: '',
        city: '',
        country: '',
        isDefault: false,
        postalCode: '',
        state: '',
        _id: '',
      },
    ],
  });
  const [error, setError] = useState<FormErrors>({
    name: '',
    email: '',
    phoneNo: '',
    addresses: '',
  });
  const userData = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      email: userData.email,
      name: userData.name,
      phoneNo: userData.phoneNo,
      addresses: userData.addresses,
    }));
    setProfileImage(userData.photo);
  }, [userData]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      return await axios({
        method: 'PATCH',
        url: '/user/update-me',
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['update-loggedin-user'] });
      toast('Profile updated successfully');
    },
    onError: (error: ApiError) => {
      toast(error.response?.data?.message || 'Error updating profile', false);
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requiredFields: (keyof FormState)[] = ['name', 'email', 'phoneNo'];
    const newErrors = { name: '', email: '', phoneNo: '', addresses: '' };

    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = `*${field} is mandatory`;
    });

    setError(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      toast('Please fill all the mandatory fields', false);
      return;
    }
    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('phoneNo', formData.phoneNo);
    form.append('addresses', JSON.stringify(formData.addresses));
    if (profileImage) form.append('photo', profileImage);
    mutate(form);
  };

  const applyAddresses: React.Dispatch<React.SetStateAction<Address[]>> = (updater) => {
    setFormData((prev) => ({
      ...prev,
      addresses: typeof updater === 'function' ? updater(prev.addresses) : updater,
    }));
  };
  return (
    <Container>
      <Card border="light" className="bg-white shadow-sm mb-4  ">
        <h1 className="text-center m-2 green-color display-6">My Profile</h1>
        <Card.Body>
          <Form className="mt-4" onSubmit={handleSubmit}>
            <Row className="justify-content-center mb-4">
              <Col md={4} lg={3} className=" d-flex justify-content-center">
                <ImageUploader
                  img={profileImage}
                  setImg={setProfileImage}
                  // className="user-avatar large-avatar rounded-circle mx-auto mt-n7 mb-4"
                  size="180 X 180"
                  isLoading={isPending}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={6} md={4} lg={3} className="mb-3">
                <Form.Group id="firstName">
                  <Form.Label>
                    Full Name<span className="text-danger">*</span>{' '}
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
                    Email<span className="text-danger">*</span>{' '}
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
                    Phone Number<span className="text-danger">*</span>{' '}
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
                    setAddresses={(fn: (addresses: Address[]) => Address[]) =>
                      setFormData((prev) => ({
                        ...prev,
                        addresses: fn(prev.addresses),
                      }))
                    }
                    onEdit={(address: Address) => {
                      setEditAddress(address);
                      setShowAddressModal(true);
                    }}
                  />
                </Col>
              ))}
              <Col>
                <Button variant="link" onClick={() => setShowAddressModal(true)}>
                  +Add Address
                </Button>
              </Col>
            </Row>
            <div className="mt-3">
              <Button className="green-btn fontweigh-500" type="submit" variant="primary">
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
          setEditAddress(null);
        }}
        setAddresses={applyAddresses}
        initialData={editAddress}
      />
    </Container>
  );
};
export default MyProfile;
