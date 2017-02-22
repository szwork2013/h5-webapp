import React from 'react';
import { Router, Route } from 'dva/router';
import OrganRnInfo from './routes/OrganRnInfo';
import OrganRnBank from './routes/OrganRnBank';

function RouterConfig({ history, app }) {
  const test = (nextState, replace) => {
    console.log(app._store);
    const state = app._store.getState();
    if (state.organRnGlobal.rnStatus !== '1') {
      replace({ pathname: '/organRnBank' });
    }
  };
  return (
    <Router history={history}>
      <Route path="/" component={OrganRnInfo} onEnter={test} onLeave={() => (console.log('leave info'))} />
      <Route path="/organRnInfo" component={OrganRnInfo} />
      <Route path="/organRnBank" component={OrganRnBank} />
    </Router>
  );
}

export default RouterConfig;
