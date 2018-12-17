import { Switch } from 'react-router-dom';
import React, { Component } from 'react';
import { compose } from 'redux';
import RouteWithSubRoutes from '../../utils/Auth/RouteWithSubRoutes';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import reducer from '../Login/reducer';
import saga from '../Login/saga';

class MainPage extends Component {
  componentDidMount() {}

  render() {
    return (
      <Switch>
        {this.props.routes.map(route => (
          <RouteWithSubRoutes key={route.path} {...route} />
        ))}
      </Switch>
    );
  }
}

const withReducer = injectReducer({ key: 'login', reducer });
const withSaga = injectSaga({ key: 'login', saga });

export default compose(
  withReducer,
  withSaga,
)(MainPage);
