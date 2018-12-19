import React, { Component } from 'react';
// import PropTypes from 'prop-types';
const CLASSTYPE = {
  danger: 'notification is-danger',
  success: 'notification is-success',
  warning: 'notification is-warning',
};
let timeout = null;
export default class Notification extends Component {
  state = {
    show: true,
    class: '',
  };

  static getDerivedStateFromProps(props) {
    clearTimeout(timeout);
    if (props.show) {
      timeout = setTimeout(() => {
        props.endCallback();
        return {
          show: false,
        };
      }, 4000);
    }

    return {
      show: props.show,
      class: CLASSTYPE[props.type],
      title: props.title,
    };
  }

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        {this.state.show && (
          <div className="alert alert-modify">
            <div className={this.state.class}>{this.state.title}</div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

Notification.propTypes = {
  // type: PropTypes.string,
  // title: PropTypes.string,
  // endCallback: PropTypes.func,
};
