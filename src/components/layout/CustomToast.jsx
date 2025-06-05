import { Col, Toast } from "react-bootstrap";
import { FaBan, FaCheckCircle } from "react-icons/fa";
const CustomToast = ({
  show,
  setShow,
  toastBody,
  delay = 5000,
  success = true,
}) => {
  const handleClose = () => setShow(false);

  return (
    <div aria-live="polite" aria-atomic="true">
      <Toast
        onClose={handleClose}
        show={show}
        delay={delay}
        autohide
        style={{
          position: "fixed",
          top: 70,
          right: 40,
          zIndex: 1000000,
          width: "auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <Toast.Header>
          <Col className="d-flex align-items-center justify-content-between gap-6">
            {success ? (
              <div>
                <FaCheckCircle className="text-success me-1" />

                <strong className="me-4"> Success</strong>
              </div>
            ) : (
              <div>
                <FaBan className="text-danger me-1" />
                <strong className="me-4"> Failure</strong>
              </div>
            )}
            <small>just now</small>
          </Col>
        </Toast.Header>
        <Toast.Body className="d-flex align-items-center">
          <span style={{ color: "black" }}>{toastBody}</span>
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default CustomToast;
