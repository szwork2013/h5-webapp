import docEx1 from '../assets/doc_1.png';

export default {

  namespace: 'signDoc',

  state: {
    page: {},
  },

  reducers: {
    setPage(state, payload) {
      const { page } = payload;
      return { ...state, page };
    },
    fieldsChange(state, payload) {
      const { fields } = payload;
      return { ...state, ...fields };
    },
  },

  effects: {
    *calcPageCls(_, { put }) {
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
