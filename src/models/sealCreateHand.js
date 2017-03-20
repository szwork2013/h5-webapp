import { routerRedux } from 'dva/router';
import { createSealKey, getMobileSeal } from '../services/services';
import PathConstants from '../PathConstants';
import { delay } from '../utils/commonUtils';

export default {

  namespace: 'sealCreateHand',

  state: {
    code: '',
  },

  reducers: {
    setCode(state, { payload }) {
      const { code, resolve } = payload;
      if (resolve) {
        resolve();
      }
      return { ...state, code };
    },
    fieldsChange(state, payload) {
      const { fields } = payload;
      return { ...state, ...fields };
    },
  },

  effects: {
    *createSealKey({ payload }, { call, put }) {
      const { resolve } = payload;
      let { data } = yield call(createSealKey);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.replace(/\s/g, '&nbsp;').match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
        yield put({
          type: 'setCode',
          payload: {
            code: data,
            resolve,
          },
        });
        yield put({ type: 'delay' }); // 设置5分钟后 二维码失效
        yield put({ type: 'getMobileSeal' }); // 轮询调接口 查询手机上是否提交了签名
      }
      resolve();
    },
    *delay({ payload }, { select, call, put }) {
      yield put({ type: '@@DVA_LOADING/HIDE', global: false });
      const sealCreateHandState = yield select(state => state.sealCreateHand);
      const { code } = sealCreateHandState;
      if (code) {
        yield call(delay, 300000);
        yield put({
          type: 'setCode',
          payload: {
            code: '',
          },
        });
      }
    },
    *getMobileSeal({ payload }, { select, call, put }) {
      const sealCreateHandState = yield select(state => state.sealCreateHand);
      const { code } = sealCreateHandState;
      const param = {
        code,
      };
      while (true) { // eslint-disable-line no-constant-condition
        yield call(delay, 1000); // 1s 轮询次
        let { data } = yield call(getMobileSeal, param);
        if (Object.prototype.toString.call(data) === '[object String]') {
          data = data.replace(/\s/g, '&nbsp;').match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
          if (!data) {
            continue; // eslint-disable-line no-continue
          }
          data = JSON.parse(data);
          if (data && data.errCode === 0) {
            yield put({
              type: 'sealHandPreview/setPreviewUrl',
              payload: {
                ossKey: data.img1,
                previewUrl: data.img1Url.replace(/&amp;/g, '&'),
              },
            });
            yield put(routerRedux.push(PathConstants.SealHandPreview));
            break;
          } else {
            continue; // eslint-disable-line no-continue
          }
        }
      }
    },
  },

  subscriptions: {
  },

};
