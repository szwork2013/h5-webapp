import _ from 'lodash';
import md5 from 'md5';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { getDocPic, pdfSignSingle, validatePwd, pdfSign, getDocInfo, sendEmail } from '../services/services';
import PathConstants from '../PathConstants';

export default {

  namespace: 'signDoc',

  state: {
    signPwd: { value: '' },
    docId: '',
    docType: 4, // 1草稿箱 4待我签
    docName: '',
    pageCount: '', // 文档页数
    pageWidth: 0,
    pageHeight: 0,
    payMethod: 0, // 支付类型，分开AA 一个A
    pageType: '', // 区分待我签还是待他人签 owner:发起 receive:待我
    page: {}, // 当前显示页属性
    modelVisible: false,
    needSeals: {},
    needAddReceiver: false,
    receivers: [
      {
        email: '15200850767',
        name: '陈凯',
      },
      {
        email: '1358796564@qq.com',
        name: '天谷信息',
      },
    ],
  },

  reducers: {
    setDocId(state, { payload }) {
      const { docId } = payload;
      return { ...state, docId };
    },
    setDocType(state, { payload }) {
      const { docType } = payload;
      return { ...state, docType };
    },
    setPayMethod(state, { payload }) {
      const { payMethod } = payload;
      return { ...state, payMethod };
    },
    setNeedAddReceiver(state, { payload }) {
      const { needAddReceiver } = payload;
      return { ...state, needAddReceiver };
    },
    changeReceivers(state, { payload }) {
      const { receiver } = payload;
      const newReceivers = _.cloneDeep(state.receivers);
      newReceivers.push(receiver);
      return { ...state, receivers: newReceivers };
    },
    setPage(state, payload) {
      const { page } = payload;
      return { ...state, page };
    },
    setDocParam(state, { payload }) {
      const { pageWidth, pageHeight, pageNum, docName } = payload;
      return { ...state, pageWidth, pageHeight, pageNum, docName };
    },
    changeVisible(state, { payload }) {
      const { modelVisible } = payload;
      return { ...state, modelVisible };
    },
    addSeal(state, { payload }) {
      const { seal } = payload; // seal: {c: { ... }}
      let newSeals = _.cloneDeep(state.needSeals);
      newSeals = _.merge(newSeals, seal);
      return { ...state, needSeals: newSeals };
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
        const signDocState = yield select(state => state.signDoc);
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
        pageNum: '1-1',
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
            payload: { pageWidth, pageHeight, pageNum, docName },
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
        const { left, top, sealId } = needSeals[key];
        signArray.push({
          sealId,
          posPage: 1,
          signType: 1,
          posX: (left * pageWidth) / (window.innerWidth * 0.8 * 0.95),
          posY: (top * pageWidth) / (window.innerWidth * 0.8 * 0.95),
        });
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
            yield put(routerRedux.push(PathConstants.DocList));
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
          yield put(routerRedux.push(PathConstants.DocList));
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
    *addReceiver({ payload }, { select, put }) {
      const { addSelf, receiverName, receiverEmail } = payload;
      const globalState = yield select(state => state.global);
      const { type, person, organize, mobile, email } = globalState;
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
        name: selfName,
        email: selfEmail,
      };
      if (addSelf) {
        yield put({
          type: 'changeReceivers',
          payload: {
            receiver: self,
          },
        });
      } else {
        const receiver = {
          name: receiverName,
          email: receiverEmail,
        };
        yield put({
          type: 'changeReceivers',
          payload: {
            receiver,
          },
        });
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
