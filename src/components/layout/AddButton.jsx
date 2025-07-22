import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

/**
 * Reusable Add Button Component
 * @param {string} label - Button text
 * @param {string} icon - FontAwesome or other icon class
 * @param {function} onClick - Callback function when button is clicked
 * @param {string} className - Additional Bootstrap classes (optional)
 * @param {boolean} disabled - Disable button state
 */
const AddButton = ({
  label = "Add",
  icon = "fa fa-plus",
  onClick,
  className = "",
  disabled = false,
}) => {
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
