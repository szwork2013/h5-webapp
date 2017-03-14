import _ from 'lodash';
import md5 from 'md5';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { getDocPic, pdfSignSingle, validatePwd, pdfSign, getDocInfo, sendEmail, getReceiveInfo, addReceiver } from '../services/services';
import PathConstants from '../PathConstants';

export default {

  namespace: 'signDoc',

  state: {
    signPwd: { value: '' },
    docId: '',
    docType: 4, // 1草稿箱 4待我签
    docName: '',
    pageNum: 1, // 文档页数
    pageWidth: 0,
    pageHeight: 0,
    payMethod: 0, // 支付类型，1分开AA 0一个A
    pageType: '', // 区分待我签还是待他人签 owner:发起 receive:待我
    page: {}, // 当前显示页属性
    curPage: { value: 1 },
    modelVisible: false,
    needSeals: {},
    needAddReceiver: false,
    receiverEmail: { value: '' },
    receivers: [
      // {
      //   uuid: 1,
      //   email: '15200850767',
      //   name: '陈凯',
      // },
      // {
      //   uuid: 2,
      //   email: '1358796564@qq.com',
      //   name: '天谷信息',
      // },
    ],
  },

  reducers: {
    setDocId(state, { payload }) {
      const { docId } = payload;
      return { ...state, docId, curPage: { value: 1 } };
    },
    setDocType(state, { payload }) {
      const { docType } = payload;
      return { ...state, docType };
    },
    setPayMethod(state, { payload }) {
      const { payMethod } = payload;
      return { ...state, payMethod };
    },
    setCurPage(state, { payload }) {
      const { curPage } = payload;
      return { ...state, curPage };
    },
    pageDown(state) {
      const newCurPage = _.cloneDeep(state.curPage);
      const newPage = newCurPage.value + 1;
      if (newPage > state.pageNum) {
        return { ...state };
      }
      return { ...state, curPage: { value: newPage } };
    },
    pageUp(state) {
      const newCurPage = _.cloneDeep(state.curPage);
      const newPage = newCurPage.value - 1;
      if (newPage < 1) {
        return { ...state };
      }
      return { ...state, curPage: { value: newPage } };
    },
    setNeedAddReceiver(state, { payload }) {
      const { needAddReceiver } = payload;
      return { ...state, needAddReceiver };
    },
    changeReceivers(state, { payload }) {
      const { receiver, addSelf } = payload;
      const newReceivers = _.cloneDeep(state.receivers);
      if (addSelf) {
        newReceivers.unshift(receiver);
      } else {
        newReceivers.push(receiver);
      }
      const uniqReceivers = _.uniqBy(newReceivers, 'uuid');
      if (state.receivers.length === uniqReceivers.length) {
        message.info('签署人已经存在');
      }
      return { ...state, receivers: uniqReceivers };
    },
    deleteReceiver(state, { payload }) {
      const { uuid } = payload;
      const newReceivers = _.cloneDeep(state.receivers);
      _.remove(newReceivers, (item) => {
        return item.uuid === uuid;
      });
      return { ...state, receivers: newReceivers };
    },
    setPage(state, payload) {
      const { page } = payload;
      return { ...state, page };
    },
    setDocParam(state, { payload }) {
      const { pageWidth, pageHeight, pageNum, docName, curPage } = payload;
      return { ...state, pageWidth, pageHeight, pageNum, docName, curPage: { value: curPage } };
    },
    changeVisible(state, { payload }) {
      const { modelVisible } = payload;
      return { ...state, modelVisible };
    },
    addSeal(state, { payload }) {
      const { seal } = payload; // seal: {c: { ... }}
      let newSeals = _.cloneDeep(state.needSeals);
      seal[Object.keys(seal)[0]].posPage = state.curPage.value;
      seal[Object.keys(seal)[0]].sealDocId = state.docId;
      newSeals = _.merge(newSeals, seal);
      return { ...state, needSeals: newSeals };
    },
    deleteSeal(state, { payload }) {
      const { key } = payload;
      let newSeals = _.cloneDeep(state.needSeals);
      newSeals = _.omit(newSeals, key);
      return { ...state, needSeals: newSeals };
    },
    clearSeal(state) {
      return { ...state, needSeals: {}, curPage: { value: 1 } };
    },
    fieldsChange(state, payload) {
      const { fields } = payload;
      return { ...state, ...fields };
    },
  },

  effects: {
    *calcPageCls({ payload }, { select, put }) {
      const signDocState = yield select(state => state.signDoc);
      const { pageWidth, pageHeight } = signDocState;
      const screenWidth = window.innerWidth;
      const page = {
        width: `${screenWidth * 0.8 * 0.95}px`,
        height: `${screenWidth * 0.8 * 0.95 * (pageHeight / pageWidth)}px`,
      };
      let newPage = _.cloneDeep(signDocState.page);
      newPage = _.merge(newPage, page);
      yield put({
        type: 'setPage',
        page: newPage,
      });
    },
    *getDocInfo({ payload }, { select, call, put }) {
      const signDocState = yield select(state => state.signDoc);
      // 地址栏传的docId （如果是这样传 就查询文档类型 支付类型，其他情况应该是直接从列表页过来，docId docType payMethod应该都有了）
      let { docId } = payload;
      if (docId) {
        yield put({
          type: 'setDocId',
          payload: {
            docId,
          },
        });
        yield put({
          type: 'getDocType',
          payload: {
            docId,
          },
        });
      } else {
        docId = signDocState.docId;
      }
      if (!docId) {
        message.error('docId未传');
        return;
      }
      const globalState = yield select(state => state.global);
      // 未实名不继续了
      if (globalState.status !== 9) {
        return;
      }
      const param = {
        pageNum: `${signDocState.curPage.value}-${signDocState.curPage.value}`,
        docId,
      };
      let { data } = yield call(getDocPic, param);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        console.log('getDocPic response: ', data);
        if (data && data.errCode === 0) {
          // 设置文档显示需要的属性
          const { pageWidth, pageHeight, pageNum, docName } = data;
          const url = data.keys[0].imageKey.replace(/&amp;/g, '&');
          yield put({
            type: 'setDocParam',
            payload: { pageWidth, pageHeight, pageNum, docName, curPage: data.keys[0].page },
          });
          const screenWidth = window.innerWidth;
          const page = {
            position: 'relative',
            width: `${screenWidth * 0.8 * 0.95}px`,
            height: `${screenWidth * 0.8 * 0.95 * (pageHeight / pageWidth)}px`,
            background: `url(${url}) 0px 0px / 100% 100% no-repeat scroll rgba(0, 0, 0, 0)`,
          };
          yield put({
            type: 'setPage',
            page,
          });
        } else {
          message.error(data.msg);
        }
      }
    },
    *getDocType({ payload }, { call, put }) {
      const { docId } = payload;
      const param = {
        docId,
      };
      const { data } = yield call(getDocInfo, param);
      console.log('getDocInfo response: ', data);
      if (data && data.success) {
        yield put({
          type: 'setDocType',
          payload: {
            docType: data.data.doc.status,
          },
        });
        yield put({
          type: 'setPayMethod',
          payload: {
            payMethod: data.data.doc.payMethod,
          },
        });
        if (!data.data.doc.sends || data.data.doc.sends.length <= 0) {
          // 需要设置签署人
          yield put({
            type: 'setNeedAddReceiver',
            payload: {
              needAddReceiver: true,
            },
          });
        } else {
          yield put({
            type: 'setNeedAddReceiver',
            payload: {
              needAddReceiver: false,
            },
          });
        }
      }
    },
    *validateSignPwd({ payload }, { select, call, put }) {
      const signDocState = yield select(state => state.signDoc);
      const { signPwd, needSeals } = signDocState;
      if (!needSeals || Object.keys(needSeals).length === 0) {
        message.error('请先签名');
        yield put({
          type: 'changeVisible',
          payload: {
            modelVisible: false,
          },
        });
        return;
      }
      const param = {
        signPwd: md5(signPwd.value),
      };
      let { data } = yield call(validatePwd, param);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        console.log('validatePwd response: ', data);
        if (data && data.errCode === 0) {
          // 密码验证成功，调用pdfSign
          yield put({
            type: 'pdfSign',
          });
        } else {
          message.error(data.msg);
        }
      }
    },
    *pdfSign({ payload }, { select, call, put }) {
      const signDocState = yield select(state => state.signDoc);
      const { signPwd, docId, docType, payMethod, needSeals, pageWidth } = signDocState;
      const signArray = [];
      // signInfo:[{"sealId":"8129","posX":200.6311724137931,"posY":521.6276730713818,"posPage":"1","signType":"1"}]
      Object.keys(needSeals).map((key) => {
        const { left, top, sealId, posPage, sealDocId } = needSeals[key];
        if (sealDocId === docId) {
          signArray.push({
            sealId,
            posPage,
            signType: 1,
            posX: (left * pageWidth) / (window.innerWidth * 0.8 * 0.95),
            posY: (top * pageWidth) / (window.innerWidth * 0.8 * 0.95),
          });
        }
        return null;
      });
      const signInfo = JSON.stringify(signArray);
      const param = {
        signdocId: docId,
        signInfo,
        password: md5(signPwd.value),
        signType: 1,
        posType: 0,
      };
      let { data } = yield call(pdfSign, param);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        console.log('pdfSign response: ', data);
        if (data && data.errCode === 0) {
          // 判断要不要发送通知下面的接收者
          if (docType === 1) {
            yield put({
              type: 'sendEmail',
              payload: {
                signdocId: docId,
                payMethod,
              },
            });
          } else {
            message.success('您已成功完成签署');
            yield put({
              type: 'changeVisible',
              payload: {
                modelVisible: false,
              },
            });
            // 跳到列表页
            yield put(routerRedux.push(`${PathConstants.DocList}/${PathConstants.DocListWaitForMe}`));
          }
        } else {
          message.error(data.msg);
        }
      }
    },
    *sendEmail({ payload }, { call, put }) {
      const { signdocId, payMethod } = payload;
      const param = {
        signdocId,
        payMethod,
      };
      let { data } = yield call(sendEmail, param);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        console.log('sendEmail response: ', data);
        if (data && data.errCode === 0) {
          message.success('您已成功完成签署');
          yield put({
            type: 'changeVisible',
            payload: {
              modelVisible: false,
            },
          });
          // 跳到列表页
          yield put(routerRedux.push(`${PathConstants.DocList}/${PathConstants.DocListDraft}`));
        } else {
          message.error(data.msg);
        }
      }
    },
    *pdfSignSingle({ payload }, { select, call, put }) {
      const signDocState = yield select(state => state.signDoc);
      const { docId, signPwd } = signDocState;
      const param = {
        user: {
          password: md5(signPwd.value),
        },
        doc: {
          docId,
        },
        pos: {
          posPage: 1,
          posX: 500,
          posY: 500,
        },
        seal: {
          sealId: 8127,
        },
      };
      const { data } = yield call(pdfSignSingle, param);
      console.log('pdfSignSingle response: ', data);
      if (data && data.success) {
        yield put({
          type: 'changeVisible',
          payload: {
            modelVisible: false,
          },
        });
        // 跳到列表页
        // yield put(routerRedux.push('/'));
      } else {
        message.error(data.data.msg);
      }
    },
    *addReceiver({ payload }, { select, call, put }) {
      const signDocState = yield select(state => state.signDoc);
      const { receivers, receiverEmail } = signDocState;
      if (_.findIndex(receivers, (item) => { return item.email === receiverEmail.value; }) > -1) {
        message.info('签署人已经存在');
        return;
      }
      const { addSelf } = payload;
      if (addSelf) {
        const globalState = yield select(state => state.global);
        const { type, person, organize, mobile, email, accountUid } = globalState;
        let selfName = '';
        let selfEmail = '';
        if (type === 1) {
          selfName = person.name;
          selfEmail = !mobile ? email : mobile;
        } else {
          selfName = organize.name;
          selfEmail = !mobile ? email : mobile;
        }
        const self = {
          uuid: accountUid,
          name: selfName,
          email: selfEmail,
        };
        yield put({
          type: 'changeReceivers',
          payload: {
            receiver: self,
            addSelf: true,
          },
        });
      } else {
        const param = {
          email: receiverEmail.value,
        };
        let { data } = yield call(getReceiveInfo, param);
        if (Object.prototype.toString.call(data) === '[object String]') {
          data = data.match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
          data = JSON.parse(data);
          console.log('getReceiveInfo response: ', data);
          if (data && data.errCode === 0) {
            const receiver = {
              uuid: data.accountUUID,
              email: !data.mobile ? data.email : data.mobile,
              name: data.name,
            };
            yield put({
              type: 'changeReceivers',
              payload: {
                receiver,
              },
            });
          } else {
            message.error(data.msg);
          }
        }
      }
    },
    *next({ payload }, { select, call, put }) {
      const signDocState = yield select(state => state.signDoc);
      const globalState = yield select(state => state.global);
      const { receivers, docId, payMethod } = signDocState;
      const { accountUid } = globalState;
      const receiversWithoutSelf = _.cloneDeep(receivers);
      // 签署人中移除自己
      const self = _.remove(receiversWithoutSelf, (item) => {
        return item.uuid === accountUid;
      });
      if (receiversWithoutSelf.length <= 0) {
        message.error('请先添加签署人');
        return;
      }
      const sends = [];
      Object.keys(receiversWithoutSelf).map((key) => {
        const { email } = receiversWithoutSelf[key];
        sends.push({
          receiver: email,
          type: 0,
          isSendMsg: 0,
        });
        return null;
      });
      const param = {
        signdocId: docId,
        sends: JSON.stringify(sends),
      };
      let { data } = yield call(addReceiver, param);
      if (Object.prototype.toString.call(data) === '[object String]') {
        data = data.match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
        data = JSON.parse(data);
        console.log('addReceiver response: ', data);
        if (data && data.errCode === 0) {
          if (self.length > 0) { // 签署人中有自己 下一步进入签署页
            yield put({
              type: 'setNeedAddReceiver',
              payload: {
                needAddReceiver: false,
              },
            });
          } else { // 否则发送通知 通知签署人
            const sendEmailParam = {
              signdocId: docId,
              payMethod,
            };
            data = yield call(sendEmail, sendEmailParam);
            if (Object.prototype.toString.call(data.data) === '[object String]') {
              data = data.data.match(/<result><resultMsg>(\S*)<\/resultMsg><\/result>/)[1];
              data = JSON.parse(data);
              console.log('sendEmail response: ', data);
              if (data && data.errCode === 0) {
                message.success('邀请签章邮件已成功发送给您的好友，请耐心等待');
                // 跳到列表页
                yield put(routerRedux.push(PathConstants.DocList));
              } else {
                message.error(data.msg);
              }
            }
          }
        } else {
          message.error(data.msg);
        }
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/signDoc') {
          // 监听窗口改变事件
          window.onresize = () => {
            dispatch({ type: 'calcPageCls' });
          };
        }
      });
    },
  },

};
