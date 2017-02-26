import qrEx from '../assets/qr-ex.jpg';

export default {

  namespace: 'sealHandPreview',

  state: {
    previewUrl: qrEx,
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
