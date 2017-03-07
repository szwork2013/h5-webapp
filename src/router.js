import React from 'react';
import { Router, Route, IndexRoute } from 'dva/router';
import { message } from 'antd';
import DocList from './routes/DocList';
import DocListWaitForMe from './routes/DocList/DocListWaitForMe';
import DocListWaitForOthers from './routes/DocList/DocListWaitForOthers';
import DocListFinished from './routes/DocList/DocListFinished';
import DocListClosed from './routes/DocList/DocListClosed';
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
import Constants from './Constants';
import { getCurrentUrlParams } from './utils/signTools';

function RouterConfig({ history, app }) {
  const validateOrganStatus = (nextState, replace, callback) => {
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
      if (nextState.location.pathname === PathConstants.OrganRnInfo) {
        if (status === 9) {
          replace({ pathname: PathConstants.OrganRnFinish });
        }
      } else if (nextState.location.pathname === PathConstants.OrganRnBank) {
        if (status === 9) {
          replace({ pathname: PathConstants.OrganRnFinish });
        } else if (status === 1) {
          replace({ pathname: PathConstants.OrganRnInfo });
        }
      } else if (nextState.location.pathname === PathConstants.OrganRnFinish) {
        if (status !== 9) {
          replace({ pathname: PathConstants.OrganRnInfo });
        }
      }
      callback();
    });
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
      if (nextState.location.pathname === PathConstants.PersonRnBank) {
        if (status === 9) {
          replace({ pathname: PathConstants.PersonRnFinish });
        }
      } else if (nextState.location.pathname === PathConstants.PersonRnInfo) {
        if (status === 9) {
          replace({ pathname: PathConstants.PersonRnFinish });
        }
      } else if (nextState.location.pathname === PathConstants.PersonRnFinish) {
        if (status === 1) {
          replace({ pathname: PathConstants.PersonRnInfo });
        }
      }
      callback();
    });
  };

  const validateStatus = (nextState, replace, callback) => {
    const promise = new Promise((resolve) => {
      app._store.dispatch({
        type: 'global/getAccountInfo',
        payload: {
          resolve,
        },
      });
    });
    promise.then(() => {
      // 根据地址栏传的docId 调接口获取文档详情
      const params = getCurrentUrlParams();
      app._store.dispatch({
        type: 'signDoc/getDocInfo',
        payload: {
          docId: params.docId,
        },
      });
      const state = app._store.getState();
      const status = state.global.status;
      const type = state.global.type;
      if (status !== 9 && type === 1) {
        app._store.dispatch({
          type: 'global/setRnRedirectUrl',
          payload: {
            afterRnRedirectUrl: PathConstants.SignDoc,
          },
        });
        replace({ pathname: PathConstants.PersonRnInfo });
        message.warning('请先进行实名认证');
        callback();
        return;
      } else if (status !== 9 && type === 2) {
        app._store.dispatch({
          type: 'global/setRnRedirectUrl',
          payload: {
            afterRnRedirectUrl: PathConstants.SignDoc,
          },
        });
        replace({ pathname: PathConstants.OrganRnInfo });
        message.warning('请先进行实名认证');
        callback();
        return;
      }
      app._store.dispatch({
        type: 'global/getSealImg',
      });
      callback();
    });
  };

  const getDocCount = () => {
    app._store.dispatch({
      type: 'docList/getDocCount',
    });
  };
  const getDocList = (docType) => {
    console.log('docType: ', docType);
    app._store.dispatch({
      type: 'docList/setType',
      payload: {
        type: docType,
      },
    });
    app._store.dispatch({
      type: 'docList/getDocList',
      payload: {
        docType,
        startIndex: 0,
      },
    });
  };
  return (
    <Router history={history}>
      {/* 企业实名 */}
      <Route path={PathConstants.Root} component={DocList} />
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
      <Route path={PathConstants.SignDoc} component={SignDoc} onEnter={validateStatus} />

      {/* 列表页 */}
      <Route path={PathConstants.DocList} component={DocList} onEnter={getDocCount}>
        <IndexRoute component={DocListWaitForMe} />
        <Route path={PathConstants.DocListWaitForMe} component={DocListWaitForMe} onEnter={() => { getDocList(Constants.DocType.WAITFORME); }} />
        <Route path={PathConstants.DocListWaitForOthers} component={DocListWaitForOthers} onEnter={() => { getDocList(Constants.DocType.WAITFOROTHERS); }} />
        <Route path={PathConstants.DocListFinished} component={DocListFinished} onEnter={() => { getDocList(Constants.DocType.FINISHED); }} />
        <Route path={PathConstants.DocListClosed} component={DocListClosed} onEnter={() => { getDocList(Constants.DocType.CLOSED); }} />
      </Route>

      {/* 404 */}
      <Route path="*" component={NotFound} />
    </Router>
  );
}

export default RouterConfig;
