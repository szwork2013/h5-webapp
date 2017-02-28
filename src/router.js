import React from 'react';
import { Router, Route } from 'dva/router';
import OrganRnInfo from './routes/OrganRnInfo';
import OrganRnBank from './routes/OrganRnBank';
import OrganRnFinish from './routes/OrganRnFinish';
import SignPwd from './routes/SignPwd';
import SignPwdReset from './routes/SignPwdReset';
import SignPwdResetBySQ from './routes/SignPwdResetBySQ';
import PersonRnInfo from './routes/PersonRnInfo';
import PersonRnBank from './routes/PersonRnBank';
import PersonRnFinish from './routes/PersonRnFinish';
import SealManage from './routes/SealManage';
import SealCreate from './routes/SealCreate';
import SealCreateHand from './routes/SealCreateHand';
import SealHandPreview from './routes/SealHandPreview';
import SignDoc from './routes/SignDoc';
import NotFound from './routes/NotFound';
import PathConstants from './PathConstants';

function RouterConfig({ history, app }) {
  const validateOrganStatus = (nextState, replace) => {
    const state = app._store.getState();
    const status = state.global.status;
    if (nextState.location.pathname === '/' || nextState.location.pathname === '/organRnInfo') {
      if (status === 9) {
        replace({ pathname: '/OrganRnFinish' });
      } else if (status !== 1) {
        replace({ pathname: '/organRnBank' });
      }
    } else if (nextState.location.pathname === '/organRnBank') {
      if (status === 9) {
        replace({ pathname: '/OrganRnFinish' });
      } else if (status === 1) {
        replace({ pathname: '/organRnInfo' });
      }
    } else if (nextState.location.pathname === '/organRnFinish') {
      if (status === 1) {
        replace({ pathname: '/organRnInfo' });
      }
    }
  };
  const validatePersonStatus = (nextState, replace, callback) => {
    const promise = new Promise((resolve) => {
      app._store.dispatch({
        type: 'global/getAccountInfo',
        payload: {
          resolve,
        },
      });
    });
    promise.then(() => {
      const state = app._store.getState();
      const status = state.global.status;
      console.log('state: ', state);
      console.log('status: ', status);
      console.log('nextState.location.pathname: ', nextState.location.pathname);
      if (nextState.location.pathname === '/personRnBank') {
        if (status === 9) {
          replace({ pathname: '/personRnFinish' });
        }
      } else if (nextState.location.pathname === '/personRnInfo') {
        if (status === 9) {
          replace({ pathname: '/personRnFinish' });
        }
      } else if (nextState.location.pathname === '/personRnFinish') {
        if (status === 1) {
          replace({ pathname: '/personRnInfo' });
        }
      }
      callback();
    });
  };
  return (
    <Router history={history}>
      {/* 企业实名 */}
      <Route path={PathConstants.Root} component={OrganRnInfo} onEnter={validateOrganStatus} onLeave={() => (console.log('leave info'))} />
      <Route path={PathConstants.OrganRnInfo} component={OrganRnInfo} onEnter={validateOrganStatus} />
      <Route path={PathConstants.OrganRnBank} component={OrganRnBank} onEnter={validateOrganStatus} />
      <Route path={PathConstants.OrganRnFinish} component={OrganRnFinish} onEnter={validateOrganStatus} />

      {/* 签署密码 */}
      <Route path={PathConstants.SignPwd} component={SignPwd} />
      <Route path={PathConstants.SignPwdReset} component={SignPwdReset} />
      <Route path={PathConstants.SignPwdResetBySQ} component={SignPwdResetBySQ} />

      {/* 个人实名 */}
      <Route path={PathConstants.PersonRnInfo} component={PersonRnInfo} onEnter={validatePersonStatus} />
      <Route path={PathConstants.PersonRnBank} component={PersonRnBank} onEnter={validatePersonStatus} />
      <Route path={PathConstants.PersonRnFinish} component={PersonRnFinish} onEnter={validatePersonStatus} />

      {/* 印章管理 */}
      <Route path={PathConstants.SealManage} component={SealManage} />
      <Route path={PathConstants.SealCreate} component={SealCreate} />
      <Route path={PathConstants.SealCreateHand} component={SealCreateHand} />
      <Route path={PathConstants.SealHandPreview} component={SealHandPreview} />

      {/* 签署文档 */}
      <Route path={PathConstants.SignDoc} component={SignDoc} />

      {/* 404 */}
      <Route path="*" component={NotFound} />
    </Router>
  );
}

export default RouterConfig;
