/* eslint-disable no-underscore-dangle 0 */
/* eslint-disable jsx-a11y/alt-text 0 */
/* eslint-disable react/no-access-state-in-setstate 0 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'nuka-carousel';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  makeSelectLocation,
  makeSelectLogin,
  makeSelectLoginStatus,
} from './selectors';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import { login } from './actions';
import reducer from './reducer';
import saga from './saga';
import wibmo from '../../images/Wibmo-Logo.png';
import slider from '../../images/slider-img.png';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

class Login extends Component {
  state = {
    login: {
      password: '',
      loginId: '',
    },
    loading: false,
    // lastFetched: '',
    error: {
      username: null,
      password: null,
    },
  };

  static propTypes = {
    login: PropTypes.func,
  };

  loginForm = e => {
    // eslint-disable-next-line no-console
    console.log('login');
    if (e.target.name === 'password') {
      if (e.target.value.length < 8)
        this.setState(state => ({
          error: {
            ...state.error,
            password: 'Password should contain minimum of 8 characters',
          },
        }));
      else
        this.setState(state => ({
          error: {
            ...state.error,
            password: null,
          },
        }));
    } else {
      /*eslint-disable */
      if (!/^[a-zA-Z0-9!@\&*\)\(+=._-]{0,}$/i.test(e.target.value)) {
        /* eslint-enable */
        this.setState(state => ({
          error: {
            ...state.error,
            username: 'Username should not contain any Special Characters',
          },
        }));
      } else if (e.target.value.length < 8)
        this.setState(state => ({
          error: {
            ...state.error,
            username: 'Username should contain minimum of 8 characters',
          },
        }));
      else
        this.setState(state => ({
          error: {
            ...state.error,
            username: null,
          },
        }));
    }
    this.setState({
      login: {
        // eslint-disable-next-line react/no-access-state-in-setstate
        ...this.state.login,
        [e.target.name]: e.target.value,
      },
    });
  };

  loginSubmit = () => {
    this.setState({
      loading: true,
    });
    this.props.login(this.state.login);
  };

  _handleKeyPress = ref => {
    if (ref.key === 'Enter') {
      this.setState({
        loading: true,
      });
      this.props.login(this.state.login);
    }
  };

  static getDerivedStateFromProps(props, state) {
    if (
      state.lastFetched !== props.loginData &&
      props.loginData.lastFetched &&
      !props.success
    ) {
      if (props && !props.success && props.loginData.code === 305) {
        /**
         * @todo notification
         */
      }
      if (props && !props.success && props.loginData.code === 404) {
        /**
         * @todo notification
         */
      }
      return {
        loading: false,
        lastFetched: props.loginData.lastFetched,
      };
    }

    if (props && props.success) {
      props.history.push('/admin/dashboard');
      return {
        loading: false,
      };
    }

    return {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="login">
          <div className="columns is-gapless ">
            <div className="column login__left">
              <div className="login__header">
                <img src={wibmo} alt="" />
                <div className="login__tag">ACCOSA 2.0</div>
              </div>
              <div className="columns is-centered login__body">
                <div className="column login__section">
                  <h3 className="login__title">Log In</h3>
                  <p className="login__warning">
                    {'"'}
                    <span>Warning</span>: Unauthorized access to this system is
                    forbidden and will be prosecuted by law. By accessing this
                    system, you agree that your actions may be monitored if
                    unauthorized usage is suspected.
                    {'"'}
                  </p>
                  <div className="mar-20">
                    <Input
                      label="Login ID"
                      type="text"
                      name="loginId"
                      style={
                        {
                          // borderColor: this.state.error.username ? "red" : ""
                        }
                      }
                      onChange={this.loginForm}
                      value={this.state.login.loginId}
                      placeholder="Enter Login ID"
                    />
                    {/* this.state.error && this.state.error.username && (
                      <h6 style={{ color: "red" }}>
                        <small>{this.state.error.username}</small>
                      </h6>
                    ) */}
                  </div>
                  <div className="mar-20">
                    <Input
                      label="Password"
                      type="password"
                      name="password"
                      onChange={this.loginForm}
                      // onFocus={this.loginForm}
                      style={
                        {
                          // borderColor: this.state.error.password ? "red" : ""
                        }
                      }
                      value={this.state.login.password}
                      placeholder="Enter Password"
                      // eslint-disable-next-line no-underscore-dangle
                      onKeyPress={this._handleKeyPress}
                    />
                    {/* this.state.error && this.state.error.password && (
                      <h6 style={{ color: "red" }}>
                        <small>{this.state.error.password}</small>
                      </h6>
                    ) */}
                  </div>
                  <div className="login__item mar-20">
                    <Link to="/forgotpassword" className="login__link">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="login__item mar-20">
                    <Button
                      type="primary"
                      label={this.state.loading ? 'loading...' : 'log in'}
                      fullwidth
                      click={this.loginSubmit}
                      disabled={
                        (this.state.error &&
                          (this.state.error.username ||
                            this.state.error.password)) ||
                        this.state.loading
                      }
                    />
                  </div>
                  <div className="login__footer">
                    <div className="login__text">
                      Logging in for the first time?
                    </div>
                    <Link to="/setpassword" className="login__link">
                      Set password
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <Carousel width="60%" cellSpacing={0} framePadding="0px" autoplay>
              <div className="column login__right">
                <div className="login__slider">
                  <figure className="image">
                    <img src={slider} width="807px" height="510px" alt="" />
                  </figure>
                  <div className="login__caption">
                    <div>
                      <span>Enable</span>
                      <br />
                      <span>Mobile Payments</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="column login__right">
                <div className="login__slider">
                  <figure className="image">
                    <img src={slider} width="807px" height="510px" alt="" />
                  </figure>
                  <div className="login__caption">
                    <div>
                      <span>Enable</span>
                      <br />
                      <span>Mobile Payments</span>
                    </div>
                  </div>
                </div>
              </div>
            </Carousel>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Login.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  // history: PropTypes.object.isRequired,
  // match: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loginData: makeSelectLogin(),
  location: makeSelectLocation(),
  success: makeSelectLoginStatus(),
});

const withConnect = connect(
  mapStateToProps,
  { login },
);

const withReducer = injectReducer({ key: 'login', reducer });
const withSaga = injectSaga({ key: 'login', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Login);
