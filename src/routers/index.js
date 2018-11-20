import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Loading, Layout, NoMatch } from 'components';
import routes from 'pages/router';
import store from 'utils/store';

routes.forEach(route => {
  console.log(route, 'route');
  route.component = Loadable({
    loader: route.component,
    loading: Loading,
    delay: 300,
  });
});

export default class Routers extends Component {
  render() {
    const authed = store.getAuthed();
    const authPath = '/login';
    return (
      <Switch>
        {routes.map((route, i) => (
          <Route
            key={`${route.path}-${i}`}
            exact={route.exact}
            path={route.path}
            render={props => {
              if (!route.requiresAuth || authed || route.path === authPath) {
                return <Layout route={route} {...props} ><route.component pageTitle={route.title} {...props} /></Layout>;
              }
              return <Redirect to={{ pathname: authPath, state: { from: props.location } }} />
            }}
          />
        ))}
        <Route component={NoMatch} />
      </Switch>
    );
  }
}