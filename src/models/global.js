import _ from 'lodash';
import { getAccountInfo, getSealImgUrl } from '../services/services';
import PathConstants from '../PathConstants';

export default {

  namespace: 'global',

  state: {
    mobile: '',
    email: '',
    type: 1,
    status: 1, // 企业实名状态：资料未完成(1) 资料已完成(2) 打款中(4) 打款完成(5) 实名成功(9)
    seals: [
      // {
      //   id: 8127,
      //   sealName: 'test',
      //   sealWay: 1,
      //   type: 3,
      //   url: 'https://esignoss.oss-cn-hangzhou.aliyuncs.com/1000343/seal_a6013699-7d03-4c95-84ae-b6db6b8c47f6?OSSAccessKeyId=FBzUaPMorqiiUAfb&Signature=r1bO0FItjuCrR4tSFjbtgskKPAI%3D&Expires=1488382417',
      // },
    ],
    person: null,
    organize: null,
    hasSignPwd: 0,
    afterRnRedirectUrl: PathConstants.Root, // 实名后的挑战，默认主页 可能是签署页
    afterSSPRedirectUrl: PathConstants.Root, // 设置完签署密码后的跳转 默认主页 可能是签署页
  },

  reducers: {
    setRnRedirectUrl(state, { payload }) {
      const { afterRnRedirectUrl } = payload;
      return { ...state, afterRnRedirectUrl };
    },
    setSSPRedirectUrl(state, { payload }) {
      const { afterSSPRedirectUrl } = payload;
      return { ...state, afterSSPRedirectUrl };
    },
    setStatus(state, { payload: status }) {
      return { ...state, status };
    },
    setAccountInfo(state, { payload }) {
      const { data, resolve } = payload;
      if (data.data != null && data.data !== undefined) {
        const { mobile, email, type, status, seals, person, organize, hasSignPwd } = data.data;
        resolve();
        return { ...state, mobile, email, type, status, seals, person, organize, hasSignPwd };
      }
      resolve();
      return { ...state };
    },
    updateSealImgUrl(state, { payload }) {
      const { sealId, data } = payload;
      if (data.data != null && data.data !== undefined) {
        const { url } = data.data;
        const newSeals = _.cloneDeep(state.seals);
        for (const seal of newSeals) {
          if (seal.id === sealId) {
            seal.url = url;
            break;
          }
        }
        return { ...state, seals: newSeals };
      }
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
    *getSealImg({ payload }, { select, call, put }) {
      const globalState = yield select(state => state.global);
      const { seals } = globalState;
      console.log('seals: ', seals);
      for (const seal of seals) {
        console.log('seal: ', seal);
        const param = {
          ossKey: seal.imgUrl,
        };
        const { data } = yield call(getSealImgUrl, param);
        console.log('getSealImg response: ', data);
        if (data && data.success) {
          yield put({
            type: 'updateSealImgUrl',
            payload: {
              sealId: seal.id,
              data,
            },
          });
        }
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
