import React from "react";
import PropTypes from "prop-types";

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
    <button
      type="button"
      className={`btn btn-dark d-flex align-items-center gap-2 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <i className={icon}></i>
      <span>{label}</span>
    </button>
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
