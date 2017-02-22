import React from 'react';
import { Router, Route } from 'dva/router';
import OrganRnInfo from './routes/OrganRnInfo';
import OrganRnBank from './routes/OrganRnBank';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={OrganRnInfo} />
      <Route path="/organRnInfo" component={OrganRnInfo} />
      <Route path="/organRnBank" component={OrganRnBank} />
    </Router>
  );
}

export default RouterConfig;
