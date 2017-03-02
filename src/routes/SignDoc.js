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

function SignDoc(props) {
  const { dispatch, page, modelVisible, needSeals, sealList, loading, form } = props;
  const { getFieldProps, getFieldError } = form;
  const cancel = (e) => {
    console.log('e: ', e);
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
  const sign = (e) => {
    console.log('e: ', e);
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
                  sealId={seal.id} sealType={seal.type} sealWay={seal.sealWay}
                  key={generateConfigID()} id={generateConfigID()} name={seal.sealName}
                  seal={seal.url}
                />
              </SealItem>
            );
          })}
        </div>
      </div>
      <div className={styles.sign_action}>
        <button className="btn primary" onClick={showModel}>确认签署</button>
      </div>
      <Modal
        title="签署密码" visible={modelVisible}
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
      </Modal>
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
