import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getDocCount } from '../services/services';
import PathConstants from '../PathConstants';

export default {

  namespace: 'docList',

  state: {
    type: 4,
    waitForMeCount: 0,
    waitForOthersCount: 0,
    finishedCount: 0,
    closedCount: 0,
  },

  reducers: {
    setType(state, { payload }) {
      const { type } = payload;
      return { ...state, type };
    },
    setAllCount(state, { payload }) {
      const { waitForMeCount, waitForOthersCount, finishedCount, closedCount } = payload;
      return { ...state, waitForMeCount, waitForOthersCount, finishedCount, closedCount };
    },
    fieldsChange(state, payload) {
      const { fields } = payload;
      return { ...state, ...fields };
    },
  },

  effects: {
    *changeType({ payload }, { put }) {
      const { type } = payload;
      yield put({
        type: 'setType',
        payload: {
          type,
        },
      });
      if (type === 4) {
        yield put(routerRedux.push(`${PathConstants.DocList}/${PathConstants.DocListWaitForMe}`));
      } else if (type === 5) {
        yield put(routerRedux.push(`${PathConstants.DocList}/${PathConstants.DocListWaitForOthers}`));
      } else if (type === 2) {
        yield put(routerRedux.push(`${PathConstants.DocList}/${PathConstants.DocListFinished}`));
      } else if (type === 11) {
        yield put(routerRedux.push(`${PathConstants.DocList}/${PathConstants.DocListClosed}`));
      }
    },
    *getDocCount({ payload }, { call, put }) {
      let { data } = yield call(getDocCount);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        console.log('getDocCount response: ', data);
        if (data && data.errCode === 0) {
          yield put({
            type: 'setAllCount',
            payload: {
              waitForMeCount: data.waitForMeCount,
              waitForOthersCount: data.waitForTaCount,
              finishedCount: data.doneCount,
              closedCount: data.closeCount,
            },
          });
        } else {
          message.error(data.msg);
        }
      }
    },
  },

  subscriptions: {
  },

};
