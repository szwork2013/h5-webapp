import { organInfoAuth } from '../services/services';

export default {

  namespace: 'organRnInfo',

  state: {
    name: { value: '2' },
    codeORG: { value: '' },
    codeUSC: { value: '' },
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
      const realnameOrganState = yield select(state => state.realnameOrgan);
      const { name, codeORG, codeUSC, legalName, legalIdno } = realnameOrganState;
      const param = {
        name,
        codeORG,
        codeUSC,
        legalName,
        legalIdno,
      };
      const response = yield call(organInfoAuth, param);
      yield put({
        type: 'organInfoAuthResponse',
        payload: response,
      });
    },
  },

  subscriptions: {
  },

};
