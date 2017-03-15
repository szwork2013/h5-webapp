import _ from 'lodash';
import dva from 'dva';
import createLoading from 'dva-loading';
// import { browserHistory } from 'dva/router';
import { useRouterHistory } from 'dva/router';
import { createHashHistory } from 'history';
import { message } from 'antd';
import { persistStore, autoRehydrate, getStoredState, createTransform } from 'redux-persist';
import { asyncSessionStorage } from 'redux-persist/storages';

// 1. Initialize
// error约定格式：{
//   success: false,
//   msg: '',
// }
message.config({
  top: 120,
  duration: 2,
});

// 初始化的时候 从localstorage中获取state
getStoredState({}).then((storageState) => {
  const app = dva({
    // history: browserHistory,
    history: useRouterHistory(createHashHistory)({ queryKey: false }),
    onError(e) {
      console.log(e);
      message.error(e.msg ? e.msg : '系统错误');
    },
    initialState: storageState,
    extraEnhancers: [autoRehydrate()],
  });

  // 2. Plugins
  app.use(createLoading());

  // 3. Model

  app.model(require('./models/global'));
  app.model(require('./models/organRnInfo'));
  app.model(require('./models/organRnBank'));

  app.model(require('./models/personRnInfo'));
  app.model(require('./models/personRnBank'));

  app.model(require('./models/sealCreate'));
  app.model(require('./models/sealCreateHand'));
  app.model(require('./models/sealHandPreview'));

  app.model(require('./models/signDoc'));

  app.model(require('./models/signPwd'));
  app.model(require('./models/signPwdResetBySQ'));

  app.model(require('./models/docList'));
  app.model(require('./models/docView'));


  // 4. Router
  app.router(require('./router'));

  // 5. Start
  app.start('#root');

  const transform = createTransform(
    // 过滤不需要缓存的数据
    (inboundState, key) => {
      if (['global', 'signDoc', 'organRnInfo', 'organRnBank'].indexOf(key) > -1) {
        if (key === 'signDoc') {
          return { ..._.omit(inboundState, ['needSeals', 'page']) };
        } else if (key === 'global') {
          return { ..._.omit(inboundState, ['afterRnRedirectUrl', 'afterSSPRedirectUrl', 'afterCSRederectUrl']) };
        } else {
          return { ...inboundState };
        }
      }
    },
  );
  // 持久化设置
  persistStore(app._store, {
    keyPrefix: 'esign:',
    transforms: [transform],
    storage: asyncSessionStorage,
  });
});
