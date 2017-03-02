import _ from 'lodash';
import md5 from 'md5';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { getDocPic, pdfSignSingle, validatePwd, pdfSign } from '../services/services';

export default {

  namespace: 'signDoc',

  state: {
    signPwd: { value: '' },
    docId: '',
    docName: '',
    pageCount: '', // 文档页数
    pageWidth: 0,
    pageHeight: 0,
    payMethod: 0, // 支付类型，分开AA 一个A
    pageType: '', // 区分待我签还是待他人签 owner:发起 receive:待我
    page: {}, // 当前显示页属性
    modelVisible: false,
    needSeals: {},
  },

  reducers: {
    setDocId(state, { payload }) {
      const { docId } = payload;
      return { ...state, docId };
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
      console.log('seal: ', seal);
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
      // 地址栏传的docId
      let { docId } = payload;
      if (docId) {
        yield put({
          type: 'setDocId',
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
      const { signPwd, docId, needSeals, pageWidth } = signDocState;
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
          yield put({
            type: 'changeVisible',
            payload: {
              modelVisible: false,
            },
          });
          // 跳到列表页
          yield put(routerRedux.push('/docList'));
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
