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
    draftCount: 0,
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
    receiverList: [],
    receiversModVisible: false,
    receiver: { value: '' },
    docName: { value: '' },
    sender: { value: '' },
    startDate: null,
    endDate: null,
  },

  reducers: {
    changeField(state, { payload }) {
      const { fieldName, fieldValue } = payload;
      return { ...state, [fieldName]: fieldValue };
    },
    resetSeach(state) {
      const docName = { value: '' };
      const receiver = { value: '' };
      const sender = { value: '' };
      const startDate = null;
      const endDate = null;
      return { ...state, docName, receiver, sender, startDate, endDate };
    },
    setType(state, { payload }) {
      const { type } = payload;
      return { ...state, type };
    },
    setAllCount(state, { payload }) {
      const { waitForMeCount, waitForOthersCount, finishedCount, closedCount, draftCount } = payload;
      return { ...state, waitForMeCount, waitForOthersCount, finishedCount, closedCount, draftCount };
    },
    selectRows(state, { payload }) {
      const { selectedRowKeys } = payload;
      return { ...state, selectedRowKeys };
    },
    setDataAndPage(state, { payload }) {
      const { data, pageInfo } = payload;
      return { ...state, data, pageInfo };
    },
    setOptLogs(state, { payload }) {
      const { optlogs } = payload;
      return { ...state, optlogs, optlogsModVisible: true };
    },
    closeOptLogsMod(state) {
      return { ...state, optlogsModVisible: false };
    },
    setReceiverList(state, { payload }) {
      const { receiverList } = payload;
      Object.keys(receiverList).map((index) => {
        receiverList[index].key = index;
        return null;
      });
      return { ...state, receiverList, receiversModVisible: true };
    },
    closeReceiversMod(state) {
      return { ...state, receiversModVisible: false };
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
      } else if (type === Constants.DocType.DRAFT) {
        yield put(routerRedux.push(`${PathConstants.DocList}/${PathConstants.DocListDraft}`));
      }
    },
    *getDocCount({ payload }, { call, put }) {
      let { data } = yield call(getDocCount);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>([\s\S]*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        // console.log('getDocCount response: ', data);
        if (data && data.errCode === 0) {
          yield put({
            type: 'setAllCount',
            payload: {
              waitForMeCount: data.waitForMeCount,
              waitForOthersCount: data.waitForTaCount,
              finishedCount: data.doneCount,
              closedCount: data.closeCount,
              draftCount: data.draftCount,
            },
          });
        } else {
          message.error(data.msg);
        }
      }
    },
    *getDocList({ payload }, { select, call, put }) {
      const docListState = yield select(state => state.docList);
      const globalState = yield select(state => state.global);
      const { type, person, organize } = globalState;
      let currentAccountName = '';
      if (type === 1) {
        currentAccountName = person.name;
      } else {
        currentAccountName = organize.name;
      }
      const { pageInfo } = docListState;
      const { docType, startIndex, pageSize } = payload;
      const params = {
        type: docType,
        startIndex: startIndex === undefined || startIndex == null ? pageInfo.startIndex : startIndex,
        pageSize: pageSize === undefined || pageSize == null ? pageInfo.pageSize : pageSize,
        docBean: '',
      };
      // console.log('getDocList params: ', params);
      let { data } = yield call(getDocList2, params);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = JSON.parse(data);
        // console.log('getDocList2 response: ', data);
        if (data && data.errCode === 0) {
          const list = [];
          if (data.docs) {
            for (const doc of data.docs) {
              // console.log(doc);
              let tmpType = '';
              if (docType === Constants.DocType.DRAFT) {
                tmpType = '草稿';
              } else {
                tmpType = '签署';
              }
              let tmpReceiverName = '';
              if (doc.sends.length === 0) {
                tmpReceiverName = '';
              } else if (doc.sends.length > 1) {
                tmpReceiverName = '多人';
              } else {
                tmpReceiverName = doc.sends[0].receiverName;
              }
              const tmp = {
                key: doc.docId,
                docName: doc.docName,
                modifyDate: doc.modifyDate,
                docId: doc.docId,
                payMethod: doc.payMethod,
                url: doc.url,
                status: doc.status,
                createDate: doc.createDate,
                sends: doc.sends,
                senderName: doc.sends.length === 0 ? currentAccountName : doc.sends[0].senderName,
                receiverName: tmpReceiverName,
                type: tmpType,
              };
              list.push(tmp);
            }
          }
          yield put({
            type: 'setDataAndPage',
            payload: {
              data: list,
              pageInfo: data.pageInfo,
            },
          });
        } else {
          message.error(data.msg);
        }
      }
    },
    *seach({ payload }, { select, call, put }) {
      const docListState = yield select(state => state.docList);
      const globalState = yield select(state => state.global);
      const { type, person, organize } = globalState;
      let currentAccountName = '';
      if (type === 1) {
        currentAccountName = person.name;
      } else {
        currentAccountName = organize.name;
      }
      const { pageInfo, receiver, docName, sender, startDate, endDate } = docListState;
      const docBean = {
        receiver: receiver.value,
        docName: docName.value,
        sender: sender.value,
        startDate: startDate ? startDate.format('L') : '',
        endDate: endDate ? endDate.format('L') : '',
        tag: '',
      };
      const docType = docListState.type;
      const params = {
        type: docType,
        startIndex: 0,
        pageSize: pageInfo.pageSize,
        docBean: JSON.stringify(docBean),
      };
      // console.log('getDocList params: ', params);
      let { data } = yield call(getDocList2, params);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = JSON.parse(data);
        // console.log('getDocList2 response: ', data);
        if (data && data.errCode === 0) {
          const list = [];
          if (data.docs) {
            for (const doc of data.docs) {
              let tmpType = '';
              if (docType === Constants.DocType.DRAFT) {
                tmpType = '草稿';
              } else {
                tmpType = '签署';
              }
              let tmpReceiverName = '';
              if (doc.sends.length === 0) {
                tmpReceiverName = '';
              } else if (doc.sends.length > 1) {
                tmpReceiverName = '多人';
              } else {
                tmpReceiverName = doc.sends[0].receiverName;
              }
              const tmp = {
                key: doc.docId,
                docName: doc.docName,
                modifyDate: doc.modifyDate,
                docId: doc.docId,
                payMethod: doc.payMethod,
                url: doc.url,
                status: doc.status,
                createDate: doc.createDate,
                sends: doc.sends,
                senderName: doc.sends.length === 0 ? currentAccountName : doc.sends[0].senderName,
                receiverName: tmpReceiverName,
                type: tmpType,
              };
              list.push(tmp);
            }
          }
          yield put({
            type: 'setDataAndPage',
            payload: {
              data: list,
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
      if (type === Constants.DocType.DRAFT) { // 草稿箱进去 需要设置签署人
        // 需要设置签署人
        yield put({
          type: 'signDoc/setNeedAddReceiver',
          payload: {
            needAddReceiver: true,
          },
        });
      } else {
        yield put({
          type: 'signDoc/setNeedAddReceiver',
          payload: {
            needAddReceiver: false,
          },
        });
      }
      yield put(routerRedux.push(PathConstants.SignDoc));
    },
    *showLogModal({ payload }, { call, put }) {
      const { docId } = payload;
      const params = {
        docId,
      };
      let { data } = yield call(signLog, params);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>([\s\S]*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        // console.log('signLog response: ', data);
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
    *closeDoc({ payload }, { select, call, put }) {
      const docListState = yield select(state => state.docList);
      const { type } = docListState;
      const { docId } = payload;
      const params = {
        docId,
        optType: 6,
      };
      let { data } = yield call(updateDoc, params);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>([\s\S]*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        // console.log('updateDoc response: ', data);
        if (data && data.errCode === 0) {
          yield put({
            type: 'docList/getDocCount',
          });
          yield put({
            type: 'docList/getDocList',
            payload: {
              docType: type,
              startIndex: 0,
            },
          });
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
        data = data.match(/<result><resultMsg>([\s\S]*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        // console.log('downloadDoc response: ', data);
        if (data && data.errCode === 0) {
          window.open(data.downUrl.replace(/&amp;/g, '&'), '_blank');
        } else {
          message.error(data.msg);
        }
      }
    },
    *showDocDetail({ payload }, { select, put }) {
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
      yield put(routerRedux.push(PathConstants.DocView));
      // const { docId } = payload;
      // const params = {
      //   docId,
      // };
      // let { data } = yield call(downloadDoc, params);
      // if (Object.prototype.toString.call(data) === '[object String]') {
      //   data = data.match(/<result><resultMsg>([\s\S]*)<\/resultMsg><\/result>/)[1];
      //   data = JSON.parse(data);
      //   console.log('downloadDoc response: ', data);
      //   if (data && data.errCode === 0) {
      //     yield put({
      //       type: 'docView/setDocDetailSrc',
      //       payload: {
      //         docDetailSrc: data.downUrl.replace(/&amp;/g, '&'),
      //       },
      //     });
      //     yield put(routerRedux.push(PathConstants.DocView));
      //   } else {
      //     message.error(data.msg);
      //   }
      // }
    },
    *deleteDoc({ payload }, { select, call, put }) {
      const docListState = yield select(state => state.docList);
      const { type } = docListState;
      const { docId } = payload;
      const params = {
        docId,
      };
      let { data } = yield call(deleteDoc, params);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>([\s\S]*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        // console.log('deleteDoc response: ', data);
        if (data && data.errCode === 0) {
          yield put({
            type: 'docList/getDocCount',
          });
          yield put({
            type: 'docList/getDocList',
            payload: {
              docType: type,
              startIndex: 0,
            },
          });
        } else {
          message.error(data.msg);
        }
      }
    },
    *reminder({ payload }, { call }) {
      const { docId } = payload;
      const params = {
        docId,
        optType: 3,
      };
      let { data } = yield call(updateDoc, params);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>([\s\S]*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        // console.log('updateDoc response: ', data);
        if (data && data.errCode === 0) {
          message.success('已通过短信或邮件的方式通知对方及时完成签署。');
        } else {
          message.error(data.msg);
        }
      }
    },
  },

  subscriptions: {
  },

};
