/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch } from 'react-router-dom';
// import PropTypes from 'prop-types';

import GlobalStyle from '../../global-styles';
import RouteWithSubRoutes from '../../utils/Auth/RouteWithSubRoutes';
import routes from '../../routes';

export default function App() {
  return (
    <div>
      <Switch>
        {routes.map(route => (
          <RouteWithSubRoutes
            key={route.path}
            {...route}
            routes={route.routes}
          />
        ))}
      </Switch>
      <GlobalStyle />
    </div>
  );
}

App.propTypes = {
  // children: PropTypes.element,
};
