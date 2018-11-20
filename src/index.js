import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import routers from './routers';
import * as serviceWorker from './serviceWorker';

import './styles/index.scss';

const render = Component => (
  ReactDOM.render(
    <BrowserRouter>
      <Component />
    </BrowserRouter>,
    document.getElementById('root'),
  )
); 

render(routers);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./routers/', () => {
    render(routers);
  })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
