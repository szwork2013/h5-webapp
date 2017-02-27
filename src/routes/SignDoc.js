import React from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import { Modal } from 'antd';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import MainLayout from '../components/Layout/MainLayout';
import SealItem from '../components/SealItem';
import SignDocPage from '../components/SignDocPage';
import SignDocSeal from '../components/SignDocSeal';
import styles from './mixins.less';
import sealEx1 from '../assets/seal-ex1.png';

function SignDoc(props) {
  const { page, loading } = props;
  const sign = () => {
    Modal.confirm({
      title: (
        <div className="modal title">签署密码</div>
      ),
      content: (
        <div className="modal text">
          <input className="modal input" />
        </div>
      ),
      iconType: null,
      okText: '完成',
    });
  };
  return (
    <MainLayout
      headerName="签署文档"
      loading={loading}
      noFooter
    >
      <DragDropContextProvider backend={HTML5Backend}>
        <div className={styles.sign_panel}>
          <div className={styles.doc}>
            <SignDocPage page={page} />
          </div>
          <div className={styles.seal_list}>
            <SealItem style={{ margin: 'auto' }}>
              <SignDocSeal name="Glass" seal={sealEx1} />
            </SealItem>
            <SealItem style={{ margin: 'auto' }}>
              <SignDocSeal name="Banana" seal={sealEx1} />
            </SealItem>
          </div>
        </div>
      </DragDropContextProvider>
      <div className={styles.sign_action}>
        <button className="btn primary" onClick={sign}>确认签署</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.signDoc, loading: state.loading.global };
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

export default connect(mapStateToProps)(createForm(formOpts)(SignDoc));
