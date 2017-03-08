import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { organInfoAuth } from '../services/services';
import PathConstants from '../PathConstants';

export default {

  namespace: 'organRnInfo',

  state: {
    name: { value: '' },
    codeORG: { value: '' },
    legalName: { value: '' },
    legalIdno: { value: '' },
  },

  reducers: {
    fieldsChange(state, payload) {
      const { fields } = payload;
      return { ...state, ...fields };
    },
    organInfoAuthResponse(state, payload) {
      const { response } = payload;
      if (response.errCode === 0) {
        window.location.href = './realnameOrganBank.html';
      }
      throw new Error({ success: response.success, msg: response.msg });
    },
  },

  effects: {
    *organInfoAuth({ payload }, { select, call, put }) {
      const organRnInfoState = yield select(state => state.organRnInfo);
      const { name, codeORG, legalName, legalIdno } = organRnInfoState;
      let ORG = ''; // 组织机构代码
      let USC = ''; // 三证合一代码
      if (codeORG.value.length === 18) {
        USC = codeORG.value;
        ORG = '';
      } else {
        USC = '';
        ORG = codeORG.value;
      }
      const param = {
        name: name.value,
        codeORG: ORG,
        codeUSC: USC,
        legalName: legalName.value,
        legalIdno: legalIdno.value,
      };
      const data = yield call(organInfoAuth, param);
      console.log('organInfoAuth response: ', data);
      if (data && data.data.success) {
        const fields = {};
        fields.serviceId = { value: data.data.data.serviceId };
        yield put({
          type: 'organRnBank/fieldsChange',
          fields,
        });
        yield put(routerRedux.push(PathConstants.OrganRnBank));
      } else {
        message.error(data.data.msg);
      }
    },
  },

  subscriptions: {
  },

};
