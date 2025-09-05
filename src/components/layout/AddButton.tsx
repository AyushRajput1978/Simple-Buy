import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

interface AddButtonProps {
  label: string;
  icon: string;
  onClick: () => void;
  className: string;
  disabled: boolean;
}

const AddButton = ({
  label = 'Add',
  icon = 'fa fa-plus',
  onClick,
  className = '',
  disabled = false,
}: AddButtonProps) => {
  return (
    <Button
      type="button"
      className={`btn-dark d-flex align-items-center gap-2 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <i className={icon}></i>
      <span>{label}</span>
    </Button>
  );
};

AddButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default AddButton;
