import React from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import MainLayout from '../components/Layout/MainLayout';
import styles from './mixins.less';

function SealCreate() {
  return (
    <MainLayout
      headerName="创建模板印章"
    >
      <div className={`container ${styles.seal_create}`}>
        <div>
          <div className={styles.seal_create_label}>您的印章</div>
          <div className={styles.seal_preview}>印章预览</div>
        </div>
        <div>
          <div className={styles.seal_create_label} style={{ marginLeft: '30px' }}>选择模板样式</div>
          <div className={styles.seal_customize}>
            <div className={styles.seal_type}>
              <div className={styles.seal_type_item}>
                <div className={styles.seal_type_item_round} />
              </div>
              <div className={styles.seal_type_item}>
                <div className={styles.seal_type_item_oval} />
              </div>
            </div>
            <div>
              <div className={styles.seal_create_label} style={{ marginLeft: '30px', marginTop: '40px' }}>选择颜色</div>
              <div className={styles.seal_color}>选择颜色</div>
            </div>
            <div>
              <div className={styles.seal_create_label} style={{ marginLeft: '30px', marginTop: '40px' }}>横向文</div>
              <div className={styles.seal_crosswise}>横向文</div>
            </div>
            <div>
              <div className={styles.seal_create_label} style={{ marginLeft: '30px', marginTop: '40px' }}>下弦文</div>
              <div className={styles.seal_gibbous}>下弦文</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.personRnInfo };
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
      type: 'personRnInfo/fieldsChange',
      fields,
    });
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(SealCreate));
