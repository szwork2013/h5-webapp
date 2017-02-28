import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { updateAccountInfo } from '../services/services';

export default {

  namespace: 'personRnInfo',

  state: {
    frontIdOssKey: { value: '' },
    endIdOssKey: { value: '' },
    name: { value: '' },
    idno: { value: '' },
  },

  reducers: {
    fieldsChange(state, payload) {
      const { fields } = payload;
      return { ...state, ...fields };
    },
  },

  effects: {
    *fileUpload({ payload }, { put }) {
      const { info, fieldName } = payload;
      yield put({ type: '@@DVA_LOADING/SHOW', global: true });
      if (info.file.status === 'done') {
        yield put({ type: '@@DVA_LOADING/HIDE', global: false });
        // 上传成功
        if (info.file.response.success) {
          message.success(`文件${info.file.name}上传成功`);
          const fields = {};
          fields[fieldName] = { value: info.file.response.data.downloadFileURI };
          yield put({
            type: 'personRnInfo/fieldsChange',
            fields,
          });
          if (fieldName === 'frontIdOssKey') {
            const bankFields = {};
            bankFields.name = { value: info.file.response.data.name };
            bankFields.idno = { value: info.file.response.data.idNo };
            yield put({
              type: 'personRnInfo/fieldsChange',
              fields: bankFields,
            });
            yield put({
              type: 'personRnBank/fieldsChange',
              fields: bankFields,
            });
          }
        } else {
          message.error(info.file.response.msg);
        }
      } else if (info.file.status === 'error') {
        yield put({ type: '@@DVA_LOADING/HIDE', global: false });
        message.error(`文件${info.file.name}上传失败`);
      }
    },
    *updatePersonInfo({ payload }, { select, call, put }) {
      const personRnInfoState = yield select(state => state.personRnInfo);
      const { name, idno, frontIdOssKey, endIdOssKey } = personRnInfoState;
      const param = {
        person: {
          name: name.value,
          idNo: idno.value,
          idPhotoPro: frontIdOssKey.value,
          photo: endIdOssKey.value,
        },
      };
      const response = yield call(updateAccountInfo, param);
      console.log('updateAccount response: ', response);
      if (response.data.success) {
        yield put(routerRedux.push('/personRnBank'));
      } else {
        message.error(response.data.msg);
      }
    },
  },

  subscriptions: {
  },

};
