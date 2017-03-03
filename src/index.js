import dva from 'dva';
import createLoading from 'dva-loading';
// import { browserHistory } from 'dva/router';
import { useRouterHistory } from 'dva/router';
import { createHashHistory } from 'history';
import { message } from 'antd';

// 1. Initialize
// error约定格式：{
//   success: false,
//   msg: '',
// }
message.config({
  top: 120,
  duration: 2,
});
const app = dva({
  // history: browserHistory,
  history: useRouterHistory(createHashHistory)({ queryKey: false }),
  onError(e) {
    console.log('onError msg: ', e.msg);
    message.error(e.msg ? e.msg : '系统错误');
  },
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

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
