import { useEffect, useState } from 'react';
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
} from 'react-bootstrap';
import type { Address } from 'type';

import { handleChange } from '../../utils/helper';

interface AddEditAddressProps {
  show: boolean;
  handleClose: () => void;
  initialData: Address | null;
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
}

const initialFormState = {
  addressLine: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  isDefault: false,
  _id: '',
};

const AddEditAddress = ({ show, handleClose, initialData, setAddresses }: AddEditAddressProps) => {
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(initialFormState);
    }
  }, [initialData]);

  const resetForm = () => {
    setForm(initialFormState);
  };

  const handleCloseAndClear = () => {
    handleClose();
    resetForm();
  };

  const isValidForm = () => {
    const { addressLine, city, state, country, postalCode } = form;
    return addressLine && city && state && country && postalCode;
  };
  const saveHandler = () => {
    if (!isValidForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    setAddresses((prev) => {
      let updated = [...prev];

      if (form.isDefault) {
        // Ensure only one default address
        updated = updated.map((addr) => ({ ...addr, isDefault: false }));
      }

      if (initialData) {
        // Editing mode
        updated = updated.map((addr) => (addr.postalCode === initialData.postalCode ? form : addr));
      } else {
        // Add new
        updated.push(form);
      }
      console.log(updated, 'updated hai na', form, 'form hai', initialData);
      return updated;
    });

    handleCloseAndClear();
  };
  const AddressFormStates = [
    {
      name: 'addressLine',
      label: 'House Number & Street',
      placeholder: 'Street',
      required: true,
    },
    {
      name: 'city',
      label: 'City',
      placeholder: 'City',
      required: true,
    },
    {
      name: 'state',
      label: 'State',
      placeholder: 'State',
      required: true,
    },
    {
      name: 'country',
      label: 'Country',
      placeholder: 'Country',
      required: true,
    },
    {
      name: 'postalCode',
      label: 'Postal Code',
      placeholder: 'Postal Code',
      required: true,
      type: 'number',
    },
  ] satisfies ReadonlyArray<{
    name: keyof Address;
    label: string;
    placeholder: string;
    required: boolean;
    type?: string;
  }>;
  return (
    <Modal show={show} onHide={handleCloseAndClear} centered>
      <ModalHeader closeButton>
        <ModalTitle className="fw-semibold">
          {initialData ? 'Edit Address' : 'Add Address'}
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Row>
          {AddressFormStates.map(({ name, label, placeholder, required, type = 'text' }) => (
            <Col md={12} className="mb-2" key={name}>
              <FormGroup>
                <FormLabel className="fw-semibold">
                  {label}
                  {required && <span className="text-danger">*</span>}
                </FormLabel>
                <FormControl
                  required={required}
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={(e) => handleChange(e, setForm)}
                  placeholder={placeholder}
                />
              </FormGroup>
            </Col>
          ))}

          <Col md={12} className="mt-3">
            <FormCheck
              label="Default Address"
              checked={form.isDefault}
              onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
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
