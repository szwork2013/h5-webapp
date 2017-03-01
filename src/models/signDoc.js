import _ from 'lodash';
import md5 from 'md5';
import { message } from 'antd';
import { getDocPic, pdfSignSingle, validatePwd, pdfSign } from '../services/services';
import { getCurrentUrlParams } from '../utils/signTools';
import docEx1 from '../assets/doc_1.png';

export default {

  namespace: 'signDoc',

  state: {
    signPwd: { value: '' },
    docId: '',
    page: {},
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
    changeVisible(state, { payload }) {
      const { modelVisible } = payload;
      console.log('modelVisible: ', modelVisible);
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
    *calcPageCls({ payload }, { put }) {
      // const wh = window.innerHeight;
      const ww = window.innerWidth;
      // const t = document.documentElement.clientHeight;
      const page = {
        position: 'relative',
        width: `${ww * 0.8 * 0.95}px`,
        height: `${ww * 0.8 * 0.95 * 1.48}px`,
        background: `url(${docEx1}) 0px 0px / 100% 100% no-repeat scroll rgba(0, 0, 0, 0)`,
      };
      yield put({
        type: 'setPage',
        page,
      });
    },
    *getDocInfo({ payload }, { call, put }) {
      yield put({ type: 'calcPageCls' });
      const { docId } = payload;
      yield put({
        type: 'setDocId',
        payload: {
          docId,
        },
      });
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
          yield put({
            type: 'setPages',
            payload: {
              data: data.data,
            },
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
      const { signPwd, docId, needSeals } = signDocState;
      const signArray = [];
      // signInfo:[{"sealId":"8129","posX":200.6311724137931,"posY":521.6276730713818,"posPage":"1","signType":"1"}]
      Object.keys(needSeals).map((key) => {
        const { left, top, sealId } = needSeals[key];
        signArray.push({
          sealId,
          posPage: 1,
          signType: 1,
          posX: left,
          posY: top,
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
          // yield put(routerRedux.push('/'));
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
          docId: 30798,
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
          // 根据地址栏传的docId 调接口获取文档详情
          const params = getCurrentUrlParams();
          if (params && params.docId) {
            console.log('docId: ', params.docId);
            dispatch({
              type: 'getDocInfo',
              payload: {
                docId: params.docId,
              },
            });
          }
          // // 监听窗口改变事件
          // dispatch({ type: 'calcPageCls' });
          // window.onresize = () => {
          //   dispatch({ type: 'calcPageCls' });
          // };
        }
      });
    },
  },

};
