import React from 'react';
import { Router, Route } from 'dva/router';
import OrganRnInfo from './routes/OrganRnInfo';
import OrganRnBank from './routes/OrganRnBank';
import OrganRnFinish from './routes/OrganRnFinish';
import SignPwd from './routes/SignPwd';
import PersonRnInfo from './routes/PersonRnInfo';
import PersonRnBank from './routes/PersonRnBank';
import PersonRnFinish from './routes/PersonRnFinish';

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
      <Route path="/signPwd" component={SignPwd} />

      {/* 个人实名 */}
      <Route path="/personRnInfo" component={PersonRnInfo} />
      <Route path="/personRnBank" component={PersonRnBank} />
      <Route path="/personFinish" component={PersonRnFinish} />
    </Router>
  );
}

export default RouterConfig;
