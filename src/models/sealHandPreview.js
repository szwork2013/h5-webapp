export default {

  namespace: 'sealHandPreview',

  state: {
    previewUrl: '',
  },

  reducers: {
    setPreviewUrl(state, { payload }) {
      const { previewUrl } = payload;
      return { ...state, previewUrl };
    },
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
