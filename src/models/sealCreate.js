import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { compressSeal, addSeal, deleteSeal, saveDefaultSeal } from '../services/services';
// import PathConstants from '../PathConstants';

export default {

  namespace: 'sealCreate',

  state: {
    sealType: { value: 'star' }, // star oval
    sealTypeForPerson: { value: 'hwxkborder' }, // hwxkborder hwxk hwls ygymbxs ygyjfcs
    colorType: { value: '1' },
    previewImgUrl: { value: '' },
    typeName: { value: '' },
    rune: { value: '' },
    urlKey: '',
  },

  reducers: {
    fieldsChange(state, payload) {
      const { fields } = payload;
      return { ...state, ...fields };
    },
    setUrlKey(state, { payload }) {
      const { urlKey } = payload;
      return { ...state, urlKey };
    },
    clearPreviewImgUrl(state) {
      return { ...state, previewImgUrl: { value: '' } };
    },
  },

  effects: {
    *preview({ payload }, { select, call, put }) {
      const globalState = yield select(state => state.global);
      const { type } = globalState;
      const sealCreateState = yield select(state => state.sealCreate);
      const { sealType, sealTypeForPerson, colorType, typeName, rune } = sealCreateState;
      let templateName = '';
      if (type === 1) {
        templateName = sealTypeForPerson.value;
      } else {
        templateName = sealType.value;
      }
      const param = {
        sealWay: 1,
        isUpload: 0,
        templateName,
        color: colorType.value,
        typeName: typeName.value,
        rune: rune.value,
      };
      let { data } = yield call(compressSeal, param);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>([\s\S]*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        // console.log('compressSeal response: ', data);
        if (data && data.errCode === 0) {
          const fields = {};
          fields.previewImgUrl = { value: data.img1Url.replace(/&amp;/g, '&') };
          yield put({
            type: 'fieldsChange',
            fields,
          });
          yield put({
            type: 'setUrlKey',
            payload: {
              urlKey: data.img1,
            },
          });
        } else {
          message.error(data.msg);
        }
      }
    },
    *addSeal({ payload }, { select, call, put }) {
      const globalState = yield select(state => state.global);
      const { type, afterCSRederectUrl } = globalState;
      const sealCreateState = yield select(state => state.sealCreate);
      const { sealType, sealTypeForPerson, colorType, typeName, rune } = sealCreateState;
      let templateName = '';
      if (type === 1) {
        templateName = sealTypeForPerson.value;
      } else {
        templateName = sealType.value;
      }
      const param = {
        sealWay: 1,
        isUpload: 0,
        templateName,
        color: colorType.value,
        typeName: typeName.value,
        rune: rune.value,
      };
      let { data } = yield call(compressSeal, param);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>([\s\S]*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        // console.log('compressSeal response: ', data);
        if (data && data.errCode === 0) {
          param.url = data.img1;
          if (type === 1) {
            param.type = 3;
          } else {
            param.type = 1;
          }
          param.isDefault = 1;
          data = yield call(addSeal, param);
          if (Object.prototype.toString.call(data.data) === '[object String]') {
            data = data.data.match(/<result><resultMsg>([\s\S]*)<\/resultMsg><\/result>/)[1];
            data = JSON.parse(data);
            // console.log('addSeal response: ', data);
            if (data && data.errCode === 0) {
              yield put(routerRedux.push(afterCSRederectUrl));
            } else {
              message.error(data.msg);
            }
          }
        } else {
          message.error(data.msg);
        }
      }
    },
    *deleteSeal({ payload }, { select, call, put }) {
      const globalState = yield select(state => state.global);
      const { validSeals } = globalState;
      if (validSeals.length <= 1) {
        message.info('当前只剩下一个有效印章，无法删除');
        return;
      }
      const { sealId } = payload;
      const param = {
        sealId,
      };
      let { data } = yield call(deleteSeal, param);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>([\s\S]*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        // console.log('deleteSeal response: ', data);
        if (data && data.errCode === 0) {
          yield put({
            type: 'global/getSeals',
          });
          message.success('删除成功');
        } else {
          message.error(data.msg);
        }
      }
    },
    *setDefaultSeal({ payload }, { call, put }) {
      const { sealId } = payload;
      const param = {
        sealId,
      };
      let { data } = yield call(saveDefaultSeal, param);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>([\s\S]*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        // console.log('saveDefaultSeal response: ', data);
        if (data && data.errCode === 0) {
          yield put({
            type: 'global/getSeals',
          });
        } else {
          message.error(data.msg);
        }
      }
    },
  },

  subscriptions: {
  },

};
