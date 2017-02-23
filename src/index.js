import dva from 'dva';
import createLoading from 'dva-loading';
import { browserHistory } from 'dva/router';

// 1. Initialize
// error约定格式：{
//   success: false,
//   msg: '',
// }
const app = dva({
  history: browserHistory,
  onError(e) {
    alert(e.msg);
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

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
