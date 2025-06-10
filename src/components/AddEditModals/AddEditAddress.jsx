import {
  Button,
  Col,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row,
} from "react-bootstrap";

import { useEffect, useState } from "react";
import { handleChange } from "../../utils/helper";

const AddEditAddress = ({ show, handleClose, data, setAddresses }) => {
  const [form, setForm] = useState({
    addressLine: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (data) {
      setForm({ ...data });
    }
  }, [data]);
  console.log(data, "data hia na", form);
  const handleCloseAndClearState = () => {
    handleClose();
    setForm({
      addressLine: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      isDefault: false,
    });
  };

  const saveHandler = () => {
    if (!form.addressLine || !form.state || !form.country || !form.postalCode) {
      alert("All fields required");
      return;
    }

    setAddresses((prev) => {
      let updated = [...prev];
      // If editing
      if (data && data.addressLine) {
        updated = updated.map((addr) =>
          addr.addressLine === data.addressLine ? form : addr
        );
      } else {
        // Ensure only one default
        if (form.isDefault) {
          updated = updated.map((addr) => ({ ...addr, isDefault: false }));
        }
        updated.push(form);
      }
      console.log(updated, "updated");
      return updated;
    });

    handleCloseAndClearState();
  };
  return (
    <Modal show={show} onHide={handleCloseAndClearState}>
      <ModalHeader closeButton>
        <ModalTitle className="fontweigh-500">
          Address<span className="text-danger">*</span>
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col md={12} className="mb-2">
            <FormGroup id="address_line2">
              <FormLabel className="fontweigh-500">
                House Number & Street
              </FormLabel>
              <FormControl
                required
                type="text"
                name="addressLine"
                value={form.addressLine}
                onChange={(e) => handleChange(e, setForm)}
                placeholder="Street"
              />
            </FormGroup>
          </Col>
          <Col md={12} className="mb-2">
            <FormGroup id="city">
              <FormLabel className="fontweigh-500">
                City<span className="text-danger">*</span>
              </FormLabel>

              <FormControl
                required
                type="text"
                name="city"
                value={form.city}
                onChange={(e) => handleChange(e, setForm)}
                placeholder="City"
              />
            </FormGroup>
          </Col>
          <Col md={12} className="mb-2">
            <FormGroup id="State">
              <FormLabel className="fontweigh-500">
                State<span className="text-danger">*</span>
              </FormLabel>
              <FormControl
                required
                type="text"
                name="state"
                value={form.state}
                onChange={(e) => handleChange(e, setForm)}
                placeholder="State"
              />
            </FormGroup>
          </Col>
          <Col md={12} className="mb-2">
            <FormGroup id="country">
              <FormLabel className="fontweigh-500">
                Country<span className="text-danger">*</span>
              </FormLabel>
              <FormControl
                required
                type="text"
                name="country"
                value={form.country}
                onChange={(e) => handleChange(e, setForm)}
                placeholder="Country"
              />
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup id="postcode">
              <FormLabel className="fontweigh-500">
                Postal Code<span className="text-danger">*</span>
              </FormLabel>
              <FormControl
                type="number"
                name="postalCode"
                value={form.postalCode}
                onChange={(e) => handleChange(e, setForm)}
                placeholder="Postal Code"
              />
            </FormGroup>
          </Col>

          <Col md={12} className="mt-4">
            <FormCheck
              label="Default"
              checked={form.isDefault}
              onChange={(e) =>
                setForm({ ...form, isDefault: e.target.checked })
              }
            />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button className="green-btn fontweigh-500" onClick={saveHandler}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};
export default AddEditAddress;
