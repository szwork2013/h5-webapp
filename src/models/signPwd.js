import md5 from 'md5';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { updateAccountInfo } from '../services/services';

export default {

  namespace: 'signPwd',

  state: {
    pwd: { value: '' },
    question1: { value: '0' },
    answer1: { value: '' },
    question2: { value: '7' },
    answer2: { value: '' },
    questionList: [
      {
        value: '0',
        label: '我小学的校名',
      },
      {
        value: '1',
        label: '我的出生地',
      },
      {
        value: '2',
        label: '我老公的名字',
      },
      {
        value: '3',
        label: '我妻子的名字',
      },
      {
        value: '4',
        label: '我最喜欢的电影',
      },
      {
        value: '5',
        label: '我初中班主任的名字',
      },
      {
        value: '6',
        label: '我妈妈的名字',
      },
      {
        value: '7',
        label: '我爸爸的名字',
      },
    ],
  },

  reducers: {
    fieldsChange(state, payload) {
      const { fields } = payload;
      return { ...state, ...fields };
    },
  },

  effects: {
    *updateAccountPwd({ payload }, { select, call, put }) {
      const signPwdState = yield select(state => state.signPwd);
      const globalState = yield select(state => state.global);
      const { pwd, question1, answer1, question2, answer2 } = signPwdState;
      const param = {
        signPwd: md5(pwd.value),
        pwdAnswer: answer1.value,
        pwdAnswer2: answer2.value,
        pwdRequest: `${signPwdState.questionList[question1.value].label}？`,
        pwdRequest2: `${signPwdState.questionList[question2.value].label}？`,
      };
      const response = yield call(updateAccountInfo, param);
      // console.log('updateAccount response: ', response);
      if (response.data.success) {
        message.success('签署密码设置成功');
        yield put(routerRedux.push(globalState.afterSSPRedirectUrl));
      } else {
        message.error(response.data.msg);
      }
    },
  },

  subscriptions: {
  },

};
