
export default {

  namespace: 'docView',

  state: {
    docDetailSrc: '',
  },

  reducers: {
    setDocDetailSrc(state, { payload }) {
      const { docDetailSrc } = payload;
      return { ...state, docDetailSrc };
    },
  },

  effects: {
  },

  subscriptions: {
  },

};
