
export default {

  namespace: 'sealCreate',

  state: {
    sealType: { value: 'star' }, // star oval
    colorType: { value: '1' },
    previewImgUrl: { value: '' },
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
