
export default {

  namespace: 'personRnBank',

  state: {
    name: { value: '1' },
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
  },

  effects: {
  },

  subscriptions: {
  },

};
