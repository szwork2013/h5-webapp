import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getDocCount, getDocList2, signLog, updateDoc, downloadDoc, deleteDoc } from '../services/services';
import PathConstants from '../PathConstants';
import Constants from '../Constants';

export default {

  namespace: 'docList',

  state: {
    type: Constants.DocType.WAITFORME,
    waitForMeCount: 0,
    waitForOthersCount: 0,
    finishedCount: 0,
    closedCount: 0,
    columns: [{
      key: 1,
      title: '发件人',
      dataIndex: 'senderName',
    }, {
      key: 2,
      title: '收件人',
      dataIndex: 'receiverName',
    }, {
      key: 3,
      title: '合同名称',
      dataIndex: 'docName',
    }, {
      key: 4,
      title: '更新时间',
      dataIndex: 'modifyDate',
    }, {
      key: 5,
      title: '类型',
      dataIndex: 'type',
    }, {
      key: 99,
      title: '操作',
      dataIndex: 'operation',
    }],
    data: [],
    selectedRowKeys: [],
    pageInfo: {
      startIndex: 0,
      pageSize: 5,
    },
    optlogs: [],
    optlogsModVisible: false,
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
    selectRows(state, { payload }) {
      const { selectedRowKeys } = payload;
      return { ...state, selectedRowKeys };
    },
    setDataAndPage(state, { payload }) {
      const { docs, pageInfo } = payload;
      const data = [];
      for (const doc of docs) {
        console.log(doc);
        const tmp = {
          key: doc.docId,
          docName: doc.docName,
          modifyDate: doc.modifyDate,
          docId: doc.docId,
          payMethod: doc.payMethod,
          url: doc.url,
          status: doc.status,
          createDate: doc.createDate,
          senderName: doc.sends[0].senderName,
          receiverName: doc.sends[0].receiverName,
          type: doc.sends[0].type,
        };
        data.push(tmp);
      }
      return { ...state, data, pageInfo };
    },
    setOptLogs(state, { payload }) {
      const { optlogs } = payload;
      return { ...state, optlogs, optlogsModVisible: true };
    },
    closeOptLogsMod(state) {
      return { ...state, optlogsModVisible: false };
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
      if (type === Constants.DocType.WAITFORME) {
        yield put(routerRedux.push(`${PathConstants.DocList}/${PathConstants.DocListWaitForMe}`));
      } else if (type === Constants.DocType.WAITFOROTHERS) {
        yield put(routerRedux.push(`${PathConstants.DocList}/${PathConstants.DocListWaitForOthers}`));
      } else if (type === Constants.DocType.FINISHED) {
        yield put(routerRedux.push(`${PathConstants.DocList}/${PathConstants.DocListFinished}`));
      } else if (type === Constants.DocType.CLOSED) {
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
    *getDocList({ payload }, { select, call, put }) {
      const docListState = yield select(state => state.docList);
      const { pageInfo } = docListState;
      const { docType, startIndex, pageSize } = payload;
      const params = {
        type: docType,
        startIndex: startIndex === undefined || startIndex == null ? pageInfo.startIndex : startIndex,
        pageSize: pageSize === undefined || pageSize == null ? pageInfo.pageSize : pageSize,
      };
      console.log('getDocList params: ', params);
      let { data } = yield call(getDocList2, params);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = JSON.parse(data);
        console.log('getDocList2 response: ', data);
        if (data && data.errCode === 0) {
          yield put({
            type: 'setDataAndPage',
            payload: {
              docs: data.docs,
              pageInfo: data.pageInfo,
            },
          });
        } else {
          message.error(data.msg);
        }
      }
    },
    *changePage({ payload }, { select, put }) {
      const docListState = yield select(state => state.docList);
      const { type, pageInfo } = docListState;
      const { page } = payload;
      yield put({
        type: 'getDocList',
        payload: {
          docType: type,
          startIndex: pageInfo.pageSize * (page - 1),
          pageSize: pageInfo.pageSize,
        },
      });
    },
    *sign({ payload }, { select, put }) {
      const docListState = yield select(state => state.docList);
      const { type } = docListState;
      const { record } = payload;
      yield put({
        type: 'signDoc/setDocId',
        payload: {
          docId: record.docId,
        },
      });
      yield put({
        type: 'signDoc/setDocType',
        payload: {
          docType: type,
        },
      });
      yield put({
        type: 'signDoc/setPayMethod',
        payload: {
          payMethod: record.payMethod,
        },
      });
      yield put(routerRedux.push(PathConstants.SignDoc));
    },
    *showLogModal({ payload }, { call, put }) {
      const { docId } = payload;
      const params = {
        docId,
      };
      let { data } = yield call(signLog, params);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        console.log('signLog response: ', data);
        if (data && data.errCode === 0) {
          yield put({
            type: 'setOptLogs',
            payload: {
              optlogs: data.optlogs,
            },
          });
        } else {
          message.error(data.msg);
        }
      }
    },
    *closeDoc({ payload }, { call, put }) {
      const { docId } = payload;
      const params = {
        docId,
        optType: 6,
      };
      let { data } = yield call(updateDoc, params);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        console.log('updateDoc response: ', data);
        if (data && data.errCode === 0) {
          yield put(routerRedux.push(`${PathConstants.DocList}/${PathConstants.DocListClosed}`));
        } else {
          message.error(data.msg);
        }
      }
    },
    *downloadDoc({ payload }, { call }) {
      const { docId } = payload;
      const params = {
        docId,
      };
      let { data } = yield call(downloadDoc, params);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        console.log('downloadDoc response: ', data);
        if (data && data.errCode === 0) {
          window.open(data.downUrl, '_blank');
        } else {
          message.error(data.msg);
        }
      }
    },
    *deleteDoc({ payload }, { call, put }) {
      const { docId } = payload;
      const params = {
        docId,
      };
      let { data } = yield call(deleteDoc, params);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        console.log('deleteDoc response: ', data);
        if (data && data.errCode === 0) {
          yield put(routerRedux.push(`${PathConstants.DocList}/${PathConstants.DocListFinished}`));
        } else {
          message.error(data.msg);
        }
      }
    },
  },

  subscriptions: {
  },

};