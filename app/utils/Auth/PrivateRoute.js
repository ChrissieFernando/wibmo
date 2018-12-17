import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { makeSelectLoginStatus } from '../../containers/Login/selectors';
import reducer from '../../containers/Login/reducer';
import saga from '../../containers/Login/saga';
import injectReducer from '../injectReducer';
import injectSaga from '../injectSaga';
class PrivateRoute extends React.PureComponent {
  render() {
    const { component: Component, routes, authSuccess, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          authSuccess ? (
            <Component {...props} routes={routes} />
          ) : (
            <Redirect
              to={{
                pathname: '/admin/login',
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );
  }
}

const withReducer = injectReducer({ key: 'login', reducer });
const withSaga = injectSaga({ key: 'login', saga });

const mapStateToProps = createStructuredSelector({
  success: makeSelectLoginStatus(),
});

const withConnect = connect(mapStateToProps);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(PrivateRoute);
