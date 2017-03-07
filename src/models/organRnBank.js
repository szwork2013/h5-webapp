import { message } from 'antd';
import { organToPay } from '../services/services';

export default {

  namespace: 'organRnBank',

  state: {
    name: { value: '' },
    cardno: { value: '' },
    bank: { value: '' },
    subbranch: { value: '' },
    provice: { value: '' },
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
      const organRnBankState = yield select(state => state.organRnBank);
      const { name, cardno, subbranch, bank, provice, city, serviceId } = organRnBankState;
      const param = {
        name: name.value,
        cardno: cardno.value,
        subbranch: subbranch.value,
        bank: bank.value,
        provice: provice.value,
        city: city.value,
        serviceId: serviceId.value,
      };
      const data = yield call(organToPay, param);
      console.log('organToPay response: ', data);
      if (data && data.data.success) {
        yield put({
          type: 'global/setStatus',
          status: '34',
        });
      } else {
        message.error(data.data.msg);
      }
    },
  },

  subscriptions: {
  },

};
