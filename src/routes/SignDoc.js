import React from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import { Modal } from 'antd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import MainLayout from '../components/Layout/MainLayout';
import InputWithLabel from '../components/InputWithLabel';
import SealItem from '../components/SealItem';
import SignDocPage from '../components/SignDocPage';
import SignDocSeal from '../components/SignDocSeal';
import { generateConfigID } from '../utils/signTools';
import styles from './mixins.less';
import sealEx1 from '../assets/seal-ex1.png';

function SignDoc(props) {
  const { dispatch, page, needSeals, sealList, loading, form } = props;
  const { getFieldProps, getFieldError } = form;
  const sign = () => {
    Modal.confirm({
      title: (
        <div className="modal title">签署密码</div>
      ),
      content: (
        <div className="modal text">
          <input
            className="modal input"
            {...getFieldProps('signPwd', {
              rules: [
                { required: true, message: '请输入签署密码' },
              ],
            })}
            error={!!getFieldError('signPwd')}
            errorMsg={!getFieldError('signPwd') ? '' : getFieldError('signPwd').join('、')}
          />
          <InputWithLabel
            hideInput
            {...getFieldProps('signPwd', {
              rules: [
                { required: true, message: '请输入签署密码' },
              ],
            })}
            error={!!getFieldError('signPwd')}
            errorMsg={!getFieldError('signPwd') ? '' : getFieldError('signPwd').join('、')}
          />
        </div>
      ),
      iconType: null,
      okText: '完成',
      onOk: () => {
        return new Promise((resolve, reject) => {
          form.validateFields({ force: true }, (error) => {
            console.log('error: ', error);
            if (error) {
              return reject;
            } else {
              dispatch({
                type: 'signDoc/validateSignPwd',
                payload: {
                  resolve,
                  reject,
                },
              });
            }
          });
        }).catch(() => console.log('Oops errors!'));
      },
    });
  };
  return (
    <MainLayout
      headerName="签署文档"
      loading={loading}
      noFooter
    >
      <div className={styles.sign_panel}>
        <div className={styles.doc}>
          <SignDocPage
            page={page}
            seals={needSeals}
            dispatch={dispatch}
          />
        </div>
        <div className={styles.seal_list}>
          {Object.values(sealList).map((seal) => {
            return (
              <SealItem style={{ margin: 'auto' }}>
                <SignDocSeal
                  dispatch={dispatch}
                  hideSourceOnDrag
                  isDefault
                  key={generateConfigID()} id={generateConfigID()} name={seal.sealName}
                  seal={seal.url}
                />
              </SealItem>
            );
          })}
        </div>
      </div>
      <div className={styles.sign_action}>
        <button className="btn primary" onClick={sign}>确认签署</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { sealList: state.global.seals, ...state.signDoc, loading: state.loading.global };
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
