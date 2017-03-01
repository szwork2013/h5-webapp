import _ from 'lodash';
import md5 from 'md5';
import { validatePwd } from '../services/services';
import docEx1 from '../assets/doc_1.png';

export default {

  namespace: 'signDoc',

  state: {
    signPwd: { value: '' },
    page: {},
    needSeals: {},
  },

  reducers: {
    setPage(state, payload) {
      const { page } = payload;
      return { ...state, page };
    },
    addSeal(state, { payload }) {
      const { seal } = payload; // seal: {c: { ... }}
      console.log('seal: ', seal);
      let newSeals = _.cloneDeep(state.needSeals);
      newSeals = _.merge(newSeals, seal);
      return { ...state, needSeals: newSeals };
    },
    fieldsChange(state, payload) {
      const { fields } = payload;
      return { ...state, ...fields };
    },
  },

  effects: {
    *calcPageCls({ payload }, { put }) {
      // const wh = window.innerHeight;
      const ww = window.innerWidth;
      // const t = document.documentElement.clientHeight;
      const page = {
        position: 'relative',
        width: `${ww * 0.8 * 0.95}px`,
        height: `${ww * 0.8 * 0.95 * 1.48}px`,
        background: `url(${docEx1}) 0px 0px / 100% 100% no-repeat scroll rgba(0, 0, 0, 0)`,
      };
      yield put({
        type: 'setPage',
        page,
      });
    },
    *validateSignPwd({ payload }, { select, call }) {
      const { resolve, reject } = payload;
      const signDocState = yield select(state => state.signDoc);
      const { signPwd } = signDocState;
      const param = {
        signPwd: md5(signPwd.value),
      };
      const { data } = yield call(validatePwd, param);
      console.log('validatePwd response: ', data);
      if (data && data.success) {
        // 密码验证成功，调用pdfSign
        resolve();
      } else {
        reject();
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/signDoc') {
          // 监听窗口改变事件
          dispatch({ type: 'calcPageCls' });
          window.onresize = () => {
            dispatch({ type: 'calcPageCls' });
          };
        }
      });
    },
  },

};
