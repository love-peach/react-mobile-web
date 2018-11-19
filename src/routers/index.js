import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Loading } from '../components';
import routes from '../pages/router';

routes.forEach(value => {
  value.component = Loadable({
    loader: value.component,
    loading: Loading,
    delay: 300,
  });
});

export default class Routers extends Component {
  render() {
    return (
      <Switch>
        {routes.map((route, i) => (
          <Route
            key={i}
            exact
            path={route.path}
            render={props => <route.component {...props} />}
          />
        ))}
      </Switch>
    );
  }
}