import { Button, Modal } from "react-bootstrap";

const ConfirmModal = ({
  showConfirmModal,
  setShowConfirmModal,
  handleConfirmClear,
  heading,
  bodyText,
  confirmText,
}) => {
  return (
    <Modal
      show={showConfirmModal}
      onHide={() => setShowConfirmModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyText}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirmClear}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ConfirmModal;
