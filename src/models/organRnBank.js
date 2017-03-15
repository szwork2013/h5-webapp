import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { organToPay, organPayAuth } from '../services/services';
import PathConstants from '../PathConstants';

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
    number1: { value: '' },
    number2: { value: '' },
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
      const globalState = yield select(state => state.global);
      const { organize } = globalState;
      const remoteServiceId = organize.serviceId;
      const param = {
        name: name.value,
        cardno: cardno.value,
        subbranch: subbranch.value,
        bank: bank.value,
        provice: provice.value,
        city: city.value,
        serviceId: !serviceId.value ? remoteServiceId : serviceId.value,
      };
      const data = yield call(organToPay, param);
      // console.log('organToPay response: ', data);
      if (data && data.data.success) {
        yield put({
          type: 'global/setStatus',
          payload: {
            status: 34,
          },
        });
      } else {
        message.error(data.data.msg);
      }
    },
    *organPayAuth({ payload }, { select, call, put }) {
      const organRnBankState = yield select(state => state.organRnBank);
      const { number1, number2, serviceId } = organRnBankState;
      const globalState = yield select(state => state.global);
      const { organize } = globalState;
      const remoteServiceId = organize.serviceId;
      const param = {
        cash: `0.${!number1.value ? 0 : number1.value}${!number2.value ? 0 : number2.value}`,
        serviceId: !serviceId.value ? remoteServiceId : serviceId.value,
      };
      const data = yield call(organPayAuth, param);
      // console.log('organPayAuth response: ', data);
      if (data && data.data.success) {
        yield put(routerRedux.push(PathConstants.OrganRnFinish));
      } else {
        message.error(data.data.msg);
        if (data.data.errCode === 260023) { // 服务流程关闭 跳到第一步重新开始
          yield put(routerRedux.push(PathConstants.OrganRnInfo));
        }
      }
    },
  },

  subscriptions: {
  },

};
