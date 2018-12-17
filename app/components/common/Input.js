/* eslint-disable react/default-props-match-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
const controlTypes = {
  primary: 'control',
  secondary: 'control has-icons-left',
  invalid: 'control has-icons-right',
  success: 'control has-icons-right isgreen',
};
const inputTypes = {
  primary: 'input',
  secondary: 'input secondary-input',
  invalid: 'input is-danger',
  valid: 'input is-success',
};
const labelTypes = {
  primary: 'label',
  secondary: 'label secondary-label',
};
const iconTypes = {
  isleft: 'icon is-left',
  isright: 'icon is-right',
  isrightgreen: 'icon is-right green',
};
const Input = ({
  label,
  placeholder,
  type,
  icon,
  hasicon,
  iconDirection,
  inputType,
  labelType,
  margin,
  value,
  disabled,
  important,
  message,
  ...rest
}) => (
  <div className="field">
    {labelType && (
      <label
        className={`${labelTypes[labelType]} ${important ? 'required' : ''}`}
      >
        {label} <span>*</span>{' '}
      </label>
    )}
    <div className={`${controlTypes[icon]}`}>
      <input
        className={`${inputTypes[inputType]} ${
          margin === 'margin' ? 'is-marginless' : ''
        }`}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        {...rest}
      />
      <span className={`${iconTypes[iconDirection]}`}>{hasicon}</span>
      <span className="input__msg">{message}</span>
    </div>
  </div>
);
Input.defaultProps = {
  labelType: 'primary',
  inputType: 'primary',
  icon: 'primary',
  type: 'text',
  important: false,
  margin: 'primary',
  iconDirection: 'isleft',
};
Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  important: PropTypes.bool,
  margin: PropTypes.string,
};
export default Input;
