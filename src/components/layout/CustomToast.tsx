import { Toast, Col } from 'react-bootstrap';
import { FaBan, FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'type';

import { hideToast } from '../../redux/reducer/toastSlice';

const CustomToast = () => {
  const dispatch = useDispatch();
  const { show, message, success } = useSelector((state: RootState) => state.toast);

  return (
    <Toast
      onClose={() => dispatch(hideToast())}
      show={show}
      delay={5000}
      autohide
      style={{
        position: 'fixed',
        top: 70,
        right: 40,
        zIndex: 1000000,
        width: 'auto',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
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
        <span style={{ color: 'black' }}>{message}</span>
      </Toast.Body>
    </Toast>
  );
};

export default CustomToast;
