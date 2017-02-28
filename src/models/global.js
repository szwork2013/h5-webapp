import { getAccountInfo } from '../services/services';
// import PathConstants from '../PathConstants';

export default {

  namespace: 'global',

  state: {
    mobile: '',
    email: '',
    type: '',
    status: 1, // 企业实名状态：资料未完成(1) 资料已完成(2) 打款中(4) 打款完成(5) 实名成功(9)
    seals: [],
    person: null,
    organize: null,
  },

  reducers: {
    setStatus(state, { payload: status }) {
      return { ...state, status };
    },
    setAccountInfo(state, { payload }) {
      const { data, resolve } = payload;
      if (data.data != null && data.data !== undefined) {
        const { mobile, email, type, status, seals, person, organize } = data.data;
        resolve();
        return { ...state, mobile, email, type, status, seals, person, organize };
      }
      resolve();
      return { ...state };
    },
  },

  effects: {
    // 路由onEnter时调用，改变状态后resolve，继续走onEnter，就可以拿到状态 就行判断跳转不同路由
    *getAccountInfo({ payload }, { call, put }) {
      const { resolve } = payload;
      const { data } = yield call(getAccountInfo);
      console.log('getAccountInfo response: ', data);
      if (data && data.success) {
        yield put({
          type: 'setAccountInfo',
          payload: {
            data,
            resolve,
          },
        });
      } else {
        resolve();
      }
    },
  },

  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen(({ pathname }) => {
    //     // 进入页面先getAccountInfo
    //     if (Object.values(PathConstants).includes(pathname)) {
    //       dispatch({
    //         type: 'getAccountInfo',
    //       });
    //     }
    //   });
    // },
  },

};
