
export default {

  namespace: 'signPwdResetBySQ',

  state: {
    question: { value: '' },
    answer: { value: '' },
    mobile: { value: '' },
    email: { value: '' },
    signPwd: { value: '' },
    confirmPwd: { value: '' },
    captcha: { value: '' },
    code: { value: '' },
  },

  reducers: {
    fieldsChange(state, payload) {
      const { fields } = payload;
      return { ...state, ...fields };
    },
  },

  effects: {
  },

  subscriptions: {
  },

};
