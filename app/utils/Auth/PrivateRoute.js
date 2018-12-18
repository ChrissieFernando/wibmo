import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { DAEMON } from '../constants';
import { makeSelectLoginStatus } from '../../containers/Login/selectors';
import saga from '../../containers/Login/saga';
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

const withSaga = injectSaga({ key: 'login', saga, mode: DAEMON });

const mapStateToProps = createStructuredSelector({
  authSuccess: makeSelectLoginStatus(),
});

const withConnect = connect(mapStateToProps);

export default compose(
  withSaga,
  withConnect,
)(PrivateRoute);
