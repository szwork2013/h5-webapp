import { message } from 'antd';

export default {

  namespace: 'personRnInfo',

  state: {
    frontIdOssKey: { value: '' },
    endIdOssKey: { value: '' },
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
  },

  subscriptions: {
  },

};
