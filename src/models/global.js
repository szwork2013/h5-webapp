import _ from 'lodash';
import { message } from 'antd';
import { getAccountInfo, getSealImgUrl, getSeals } from '../services/services';
import PathConstants from '../PathConstants';

export default {

  namespace: 'global',

  state: {
    id: '',
    accountUid: '',
    mobile: '',
    email: '',
    type: 1,
    status: 1, // 企业实名状态：资料未完成(1) 资料已完成(2) 打款中(34) 打款完成(35) 实名成功(9)
    seals: [],
    validSeals: [],
    person: null,
    organize: null,
    hasSignPwd: 0,
    afterRnRedirectUrl: PathConstants.Root, // 实名后的跳转，默认主页 可能是签署页
    afterSSPRedirectUrl: PathConstants.Root, // 设置完成签署密码后的跳转 默认主页 可能是签署页
    afterCSRederectUrl: PathConstants.SealManage, // 设置完成创建印章后的跳转 默认印章管理 可能是签署页
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
    setCSRederectUrl(state, { payload }) {
      const { afterCSRederectUrl } = payload;
      return { ...state, afterCSRederectUrl };
    },
    setStatus(state, { payload: status }) {
      return { ...state, ...status };
    },
    removeSeal(state, { payload }) {
      const { sealId } = payload;
      const newSeals = _.cloneDeep(state.seals);
      _.remove(newSeals, (seal) => {
        return seal.id === sealId;
      });
      return { ...state, seals: newSeals };
    },
    initSeal(state, { payload }) {
      const { seals, validSeals } = payload;
      return { ...state, seals, validSeals };
    },
    setAccountInfo(state, { payload }) {
      const { data, resolve } = payload;
      if (data.data != null && data.data !== undefined) {
        const { id, accountUid, mobile, email, type, status, seals, person, organize, hasSignPwd } = data.data;
        const validSeals = _.cloneDeep(seals);
        // 移除状态不等1的 剩下的是有效的印章
        _.remove(validSeals, (item) => {
          return item.status !== 1;
        });
        resolve();
        return { ...state, id, accountUid, mobile, email, type, status, seals, validSeals, person, organize, hasSignPwd };
      }
      resolve();
      return { ...state };
    },
    updateSealImgUrl(state, { payload }) {
      const { sealId, data } = payload;
      if (data.data != null && data.data !== undefined) {
        const { url } = data.data;
        const newSeals = _.cloneDeep(state.seals);
        const newValidSeals = _.cloneDeep(state.validSeals);
        for (const seal of newSeals) {
          if (seal.id === sealId) {
            seal.url = url;
            break;
          }
        }
        for (const seal of newValidSeals) {
          if (seal.id === sealId) {
            seal.url = url;
            break;
          }
        }
        return { ...state, seals: newSeals, validSeals: newValidSeals };
      }
      return { ...state };
    },
  },

  effects: {
    // 路由onEnter时调用，改变状态后resolve，继续走onEnter，就可以拿到状态 就行判断跳转不同路由
    *getAccountInfo({ payload }, { call, put }) {
      const { resolve } = payload;
      const { data } = yield call(getAccountInfo);
      // console.log('getAccountInfo response: ', data);
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
      // console.log('seals: ', seals);
      for (const seal of seals) {
        // console.log('seal: ', seal);
        if (!seal.url) {
          const param = {
            ossKey: seal.imgUrl,
          };
          const { data } = yield call(getSealImgUrl, param);
          // console.log('getSealImg response: ', data);
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
      }
    },
    *getSeals({ payload }, { call, put }) {
      let { data } = yield call(getSeals);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.replace(/\s/g, '&nbsp;').match(/<result><resultMsg>([\s\S]*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        // console.log('getSeals response: ', data);
        if (data && data.errCode === 0) {
          const seals = data.msg;
          Object.values(seals).map((seal) => {
            const { imgUrl } = seal;
            seal.url = imgUrl.replace(/&amp;/g, '&');
            return null;
          });
          const validSeals = _.cloneDeep(seals);
          // 移除状态不等1的 剩下的是有效的印章
          _.remove(validSeals, (item) => {
            return item.status !== 1;
          });
          yield put({
            type: 'initSeal',
            payload: {
              seals,
              validSeals,
            },
          });
        } else {
          message.error(data.msg);
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
