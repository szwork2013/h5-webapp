import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import { Modal, Checkbox } from 'antd';
import { DragDropContext } from 'react-dnd';
import classnames from 'classnames';
import HTML5Backend from 'react-dnd-html5-backend';
import MainLayout from '../components/Layout/MainLayout';
import InputWithLabel from '../components/InputWithLabel';
import SealItem from '../components/SealItem';
import SignDocPage from '../components/SignDocPage';
import SignDocSeal from '../components/SignDocSeal';
import ReceiverItems from '../components/ReceiverItems';
import { generateConfigID } from '../utils/signTools';
import PathConstants from '../PathConstants';
import styles from './mixins.less';
import add from '../assets/ico-add.png';

function SignDoc(props) {
  const { dispatch, page, modelVisible, needSeals, sealList, hasSignPwd, loading, form, needAddReceiver, receivers, payMethod, pageNum, curPage, docId } = props;
  const { getFieldProps, getFieldError } = form;
  const cancel = () => {
    dispatch({
      type: 'signDoc/changeVisible',
      payload: {
        modelVisible: false,
      },
    });
  };
  const showModel = () => {
    dispatch({
      type: 'signDoc/changeVisible',
      payload: {
        modelVisible: true,
      },
    });
  };
  const sign = () => {
    form.validateFields({ force: true }, (error) => {
      if (error) {
        return null;
      } else {
        dispatch({
          type: 'signDoc/validateSignPwd',
        });
      }
    });
  };
  const setSignPwd = () => {
    dispatch({
      type: 'global/setSSPRedirectUrl',
      payload: {
        afterSSPRedirectUrl: PathConstants.SignDoc,
      },
    });
    dispatch(routerRedux.push(PathConstants.SignPwd));
  };
  const addSelf = () => {
    dispatch({
      type: 'signDoc/addReceiver',
      payload: {
        addSelf: true,
      },
    });
  };
  const inputCls = classnames({
    [styles.add_input]: true,
    [styles.add_input_error]: !!getFieldError('receiverEmail'),
  });
  const addReceiver = () => {
    form.validateFields(['receiverEmail'], { force: true }, (error) => {
      if (error) {
        return null;
      } else {
        dispatch({
          type: 'signDoc/addReceiver',
          payload: {
            addSelf: false,
          },
        });
      }
    });
  };
  const changePayMethod = (e, type) => {
    if (e.target.checked) {
      dispatch({
        type: 'signDoc/setPayMethod',
        payload: {
          payMethod: type,
        },
      });
    }
  };
  const next = () => {
    dispatch({
      type: 'signDoc/next',
    });
  };
  // const changePage = (e) => {
  //   dispatch({
  //     type: 'signDoc/setCurPage',
  //     payload: {
  //       curPage: e.target.value,
  //     },
  //   });
  // };
  const getDocPage = () => {
    dispatch({
      type: 'signDoc/getDocInfo',
      payload: {
        docId: '',
      },
    });
  };
  const validatorPage = (rule, value, callback) => {
    if (value && /^[0-9]*$/.test(value) && value >= 1 && value <= pageNum) {
      callback();
    } else {
      callback(new Error('格式不正确'));
    }
  };
  const up = () => {
    dispatch({
      type: 'signDoc/pageUp',
    });
    dispatch({
      type: 'signDoc/getDocInfo',
      payload: {
        docId: '',
      },
    });
  };
  const down = () => {
    dispatch({
      type: 'signDoc/pageDown',
    });
    dispatch({
      type: 'signDoc/getDocInfo',
      payload: {
        docId: '',
      },
    });
  };
  const newSeal = () => {
    dispatch({
      type: 'global/setCSRederectUrl',
      payload: {
        afterCSRederectUrl: PathConstants.SignDoc,
      },
    });
    dispatch(routerRedux.push(PathConstants.SealManage));
  };
  return (
    <MainLayout
      headerName="签署文档"
      loading={loading}
      noFooter
    >
      <div className={styles.sign_panel}>
        <div id="docPanel" className={styles.doc}>
          <SignDocPage
            page={page}
            curPage={curPage.value}
            docId={docId}
            seals={needSeals}
            dispatch={dispatch}
          />
          {/* <div className={styles.page}>1</div> */}
        </div>
        { needAddReceiver ?
          <div className={styles.add_receiver_panel}>
            <div className={styles.add_receiver_title}>添加签署人</div>
            <div>
              <div className={styles.add_receiver_self}>
                <button className="btn cutout" onClick={addSelf}>添加自己</button>
              </div>
              <div>
                <ReceiverItems receivers={receivers} dispatch={dispatch} />
              </div>
              <div className={styles.add}>
                <div className={styles.add_input_label}>手机号/邮箱</div>
                <div className={styles.add_input_grp}>
                  <input
                    className={inputCls}
                    {...getFieldProps('receiverEmail', {
                      rules: [
                        { required: true, message: '请输入手机号/邮箱' },
                        { pattern: /(^([a-zA-Z0-9]+[_|_|.-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.-]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,3}$)|(^[1][0-9]{10}$)/, message: '格式不正确' },
                      ],
                    })}
                  />
                  <div className={styles.add_input_btn}>
                    <buttn onClick={addReceiver}>添加</buttn>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.add_receiver_title}>签署付费方</div>
            <div className={styles.add_receiver_paymethod}>
              <Checkbox checked={payMethod === 0} onChange={(e) => { changePayMethod(e, 0); }}>我来承担此份文件的签署费用(待文件完成签署后，将从您的账户中扣取2次签署次数)</Checkbox>
              <Checkbox checked={payMethod === 1} onChange={(e) => { changePayMethod(e, 1); }} style={{ marginTop: '20px', paddingRight: '7px' }}>由文件签署人各自承担签署费用(此次签署将从您的账户中扣取1次签署次数)</Checkbox>
            </div>
          </div> :
          <div className={styles.seal_list}>
            <SealItem style={{ margin: 'auto' }} onClick={() => newSeal()}>
              <div>
                <img style={{ width: '50px' }} role="presentation" src={add} />
                <div style={{ marginTop: '10px' }}>创建新印章</div>
              </div>
            </SealItem>
            {Object.values(sealList).map((seal) => {
              return (
                <SealItem key={seal.id} isDefault={seal.isDefault} style={{ margin: 'auto' }}>
                  <SignDocSeal
                    dispatch={dispatch}
                    hideSourceOnDrag
                    isDefault
                    sealId={seal.id} sealType={seal.type} sealWay={seal.sealWay}
                    key={generateConfigID()} id={generateConfigID()} name={seal.sealName}
                    seal={seal.url} width={seal.width} height={seal.height}
                  />
                </SealItem>
              );
            })}
          </div>
        }
      </div>
      <div className={styles.sign_action}>
        <div className={styles.next_page}>
          {/* onKeyDown={e => getDocPage(e)} */}
          {curPage.value === 1 ?
            <span className={styles.page_up} /> :
            <span className={styles.page_up} onClick={() => { up(); }} />
          }
          {curPage.value === pageNum ?
            <span className={styles.page_down} /> :
            <span className={styles.page_down} onClick={() => { down(); }} />
          }
          <span>页码：</span>
          <input
            {...getFieldProps('curPage', {
              rules: [
                { required: true, message: '请输入' },
                { validator: validatorPage },
              ],
            })}
            className={styles.page_input} onBlur={e => getDocPage(e)}
          />
          <span><span className={styles.page_split}> / </span><span className={styles.page_total}>{pageNum}</span></span>
        </div>
        { needAddReceiver ?
          <button className="btn primary" onClick={next}>下一步</button> :
          <button className="btn primary" onClick={showModel}>确认签署</button>
        }
      </div>
      { hasSignPwd === 1 ?
        <Modal
          title="签署密码" visible={modelVisible} wrapClassName="signpwd"
          onOk={sign} onCancel={cancel} closable={false}
        >
          <InputWithLabel
            type="password"
            {...getFieldProps('signPwd', {
              rules: [
                { required: true, message: '请输入签署密码' },
              ],
            })}
            error={!!getFieldError('signPwd')}
            errorMsg={!getFieldError('signPwd') ? '' : getFieldError('signPwd').join('、')}
          />
        </Modal> :
        <Modal
          visible={modelVisible} okText="立即设置" wrapClassName="signpwd"
          onOk={setSignPwd} onCancel={cancel} closable={false}
        >
          <div className={styles.nopwd_text}>您还没有设置签署密码！</div>
        </Modal>
      }
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { sealList: state.global.validSeals, hasSignPwd: state.global.hasSignPwd, ...state.signDoc, loading: state.loading.global };
}

const formOpts = {
  mapPropsToFields(props) {
    return props;
  },
  onFieldsChange(props, changedFields) {
    const { dispatch } = props;
    const fields = {};
    for (const value of Object.values(changedFields)) {
      fields[value.name] = { value: value.value };
      fields[value.name].errors = value.errors;
    }
    dispatch({
      type: 'signDoc/fieldsChange',
      fields,
    });
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(DragDropContext(HTML5Backend)(SignDoc)));
