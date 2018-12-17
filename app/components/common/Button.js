import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
const buttonTypes = {
  primary: 'button primary-btn',
  secondary: 'button secondary-btn',
  dropdown: 'button dropdown-btn',
  transparent: 'button',
};
const Button = ({
  type,
  label,
  fullwidth,
  disable,
  icon,
  withIcon,
  link,
  click,
  btnContent,
  btnstyle,
  ...rest
}) => (
  <a
    className={`${buttonTypes[type]} ${fullwidth ? 'is-fullwidth' : ''} ${
      disable ? 'is-static' : ''
    } ${withIcon ? 'is-withIcon' : ''}`}
    href={link}
    onClick={click}
    {...rest}
  >
    {label}
    <div className="button__icon">{icon}</div>
    <span className="dropdown-trigger-item" style={btnstyle}>
      {btnContent}
    </span>
    <Icon path={mdiChevronDown} size={0.8} className="dropdown__icon" />
  </a>
);
Button.defaultProps = {
  type: 'primary',
  withIcon: false,
  disable: false,
};
Button.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  click: PropTypes.func,
  fullwidth: PropTypes.bool,
  static: PropTypes.bool,
  disable: PropTypes.bool,
  btnContent: PropTypes.string,
  withIcon: PropTypes.bool,
};
export default Button;
