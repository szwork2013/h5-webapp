import { organToPay } from '../services/services';

export default {

  namespace: 'organRnBank',

  state: {
    name: { value: '' },
    cardno: { value: '' },
    bank: { value: '' },
    subbranch: { value: '' },
    province: { value: '' },
    city: { value: '' },
    serviceId: { value: '' },
  },

  reducers: {
    fieldsChange(state, payload) {
      const { fields } = payload;
      return { ...state, ...fields };
    },
    organToPayResponse(state, payload) {
      const { response } = payload;
      if (response.errCode === 0) {
        window.location.href = './realnameOrganPayAuth.html';
        return;
      }
      throw new Error({ success: response.success, msg: response.msg });
    },
  },

  effects: {
    *organToPay({ payload }, { select, call, put }) {
      const realnameOrganBankState = yield select(state => state.realnameOrganBank);
      const { name, cardno, subbranch, bank, provice, city, serviceId } = realnameOrganBankState;
      const param = {
        name,
        cardno,
        subbranch,
        bank,
        provice,
        city,
        serviceId,
      };
      const response = yield call(organToPay, param);
      yield put({
        type: 'organToPayResponse',
        payload: response,
      });
    },
  },

  subscriptions: {
  },

};
