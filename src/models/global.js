
export default {

  namespace: 'global',

  state: {
    rnStatus: '1', // 实名状态：资料未完成(1) 资料已完成(2) 打款中(4) 打款完成(5) 实名成功(9)
  },

  reducers: {
    setRnStatus(state, { payload: rnStatus }) {
      return { ...state, rnStatus };
    },
  },

  effects: {
  },

  subscriptions: {
  },

};
