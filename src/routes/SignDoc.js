import React from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import MainLayout from '../components/Layout/MainLayout';
import SealItem from '../components/SealItem';
import styles from './mixins.less';
import sealEx1 from '../assets/seal-ex1.png';
import docEx1 from '../assets/doc_1.png';

function SignDoc() {
  const page = {
    position: 'relative',
    height: '100%',
    // background: `url(${docEx1}) 0px 0px / 100% 100% no-repeat scroll rgba(0, 0, 0, 0)`,
    backgroundImage: `url(${docEx1})`,
    backgroundRepeat: 'no-repeat',
  };
  return (
    <MainLayout
      headerName="签署文档"
      noFooter
    >
      <div className={styles.sign_panel}>
        <div className={styles.doc}>
          <div style={page} />
        </div>
        <div className={styles.seal_list}>
          <SealItem style={{ margin: 'auto' }}>
            <img role="presentation" src={sealEx1} />
          </SealItem>
        </div>
      </div>
      <div className={styles.sign_action}>
        <button className="btn primary">确认签署</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.signDoc };
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
