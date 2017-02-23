import React from 'react';
import { Router, Route } from 'dva/router';
import OrganRnInfo from './routes/OrganRnInfo';
import OrganRnBank from './routes/OrganRnBank';
import OrganRnFinish from './routes/OrganRnFinish';
import OrganSignPwd from './routes/OrganSignPwd';

function RouterConfig({ history, app }) {
  const validateOrganStatus = (nextState, replace) => {
    const state = app._store.getState();
    const rnStatus = state.global.rnStatus;
    if (nextState.location.pathname === '/' || nextState.location.pathname === '/organRnInfo') {
      if (rnStatus === '9') {
        replace({ pathname: '/OrganRnFinish' });
      } else if (rnStatus !== '1') {
        replace({ pathname: '/organRnBank' });
      }
    } else if (nextState.location.pathname === '/organRnBank') {
      if (rnStatus === '9') {
        replace({ pathname: '/OrganRnFinish' });
      } else if (rnStatus === '1') {
        replace({ pathname: '/organRnInfo' });
      }
    } else if (nextState.location.pathname === '/organRnFinish') {
      if (rnStatus === '1') {
        replace({ pathname: '/organRnInfo' });
      }
    }
  };
  return (
    <Router history={history}>
      {/* 企业实名 */}
      <Route path="/" component={OrganRnInfo} onEnter={validateOrganStatus} onLeave={() => (console.log('leave info'))} />
      <Route path="/organRnInfo" component={OrganRnInfo} onEnter={validateOrganStatus} />
      <Route path="/organRnBank" component={OrganRnBank} onEnter={validateOrganStatus} />
      <Route path="/organRnFinish" component={OrganRnFinish} onEnter={validateOrganStatus} />

      {/* 签署密码 */}
      <Route path="/organSignPwd" component={OrganSignPwd} />

      {/* 个人实名 */}
    </Router>
  );
}

export default RouterConfig;
