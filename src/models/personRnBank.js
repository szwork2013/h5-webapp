import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { personAuthApply, personAuthAuth, updateAccountInfo } from '../services/services';

export default {

  namespace: 'personRnBank',

  state: {
    name: { value: '' },
    idno: { value: '' },
    cardno: { value: '' },
    mobile: { value: '' },
    code: { value: '' },
    serviceId: '',
  },

  reducers: {
    fieldsChange(state, payload) {
      const { fields } = payload;
      return { ...state, ...fields };
    },
    setServiceId(state, { payload }) {
      const { serviceId } = payload;
      // console.log('serviceId: ', serviceId);
      return { ...state, serviceId };
    },
  },

  effects: {
    *authApply({ payload }, { select, call, put }) {
      const personRnBankState = yield select(state => state.personRnBank);
      const { name, idno, cardno, mobile } = personRnBankState;
      const param = {
        name: name.value,
        certId: idno.value,
        bankCardNum: cardno.value,
        bankReservedMobile: mobile.value,
      };
      const response = yield call(personAuthApply, param);
      // console.log('apply response: ', response);
      // console.log('apply response msg: ', response.data.msg);
      if (response.data.success) {
        message.success('发送成功');
        yield put({
          type: 'setServiceId',
          payload: {
            serviceId: response.data.data.serviceId,
          },
        });
      } else {
        message.error(response.data.msg);
      }
    },
    *authAuth({ payload }, { select, call, put }) {
      const personRnBankState = yield select(state => state.personRnBank);
      const { name, idno, serviceId, code } = personRnBankState;
      const param = {
        name: name.value,
        certId: idno.value,
        serviceId,
        code: code.value,
      };
      const response = yield call(personAuthAuth, param);
      // console.log('auth response: ', response);
      if (response.data.success) {
        yield put({
          type: 'updateAccountStatus',
        });
      } else {
        message.error(response.data.msg);
      }
    },
    *updateAccountStatus({ payload }, { call, put }) {
      // const personRnBankState = yield select(state => state.personRnBank);
      // const { name, idno } = personRnBankState;
      const param = {
        createDefaultSeal: true,
        status: '9',
      };
      const response = yield call(updateAccountInfo, param);
      // console.log('updateAccount response: ', response);
      if (response.data.success) {
        yield put(routerRedux.push('/personRnFinish'));
      } else {
        message.error(response.data.msg);
      }
    },
  },

  subscriptions: {
  },

};
