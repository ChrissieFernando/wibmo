import React from 'react';
import { Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

class RouteWithSubRoutes extends React.PureComponent {
  render() {
    const route = this.props;
    return (
      <Route
        path={route.path}
        exact={route.exact}
        render={props => {
          if (!route.auth)
            return <route.component {...props} routes={route.routes} />;
          return (
            <PrivateRoute component={route.component} routes={route.routes} />
          );
        }}
      />
    );
  }
}
export default RouteWithSubRoutes;
