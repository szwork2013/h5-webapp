import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { addSeal } from '../services/services';
// import PathConstants from '../PathConstants';

export default {

  namespace: 'sealHandPreview',

  state: {
    ossKey: '',
    previewUrl: '',
  },

  reducers: {
    setPreviewUrl(state, { payload }) {
      const { ossKey, previewUrl } = payload;
      return { ...state, ossKey, previewUrl };
    },
    fieldsChange(state, payload) {
      const { fields } = payload;
      return { ...state, ...fields };
    },
  },

  effects: {
    *addSeal({ payload }, { select, call, put }) {
      const sealHandPreviewState = yield select(state => state.sealHandPreview);
      const { ossKey } = sealHandPreviewState;
      const globalState = yield select(state => state.global);
      const { afterCSRederectUrl } = globalState;
      const param = {
        sealWay: 3,
        url: ossKey,
        type: 3,
        isDefault: 1,
      };
      let data = yield call(addSeal, param);
      if (Object.prototype.toString.call(data.data) === '[object String]') {
        data = data.data.match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        // console.log('addSeal response: ', data);
        if (data && data.errCode === 0) {
          yield put(routerRedux.push(afterCSRederectUrl));
        } else {
          message.error(data.msg);
        }
      }
    },
  },

  subscriptions: {
  },

};
