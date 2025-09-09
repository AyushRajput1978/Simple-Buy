import { Button, Modal } from "react-bootstrap";

interface ConfirmModalProps{
  showConfirmModal:boolean
  setShowConfirmModal:(state:boolean)=>void,
  handleConfirmClear:()=>void,
  heading:string,
  bodyText:string,
  confirmText:string,
}

const ConfirmModal = ({
  showConfirmModal,
  setShowConfirmModal,
  handleConfirmClear,
  heading,
  bodyText,
  confirmText,
}:ConfirmModalProps) => {
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
