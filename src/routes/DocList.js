import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import { Upload } from 'antd';
import MainLayout from '../components/Layout/MainLayout';
import styles from './mixins.less';

function DocList(props) {
  const { dispatch, form, loading } = props;
  // const { getFieldProps, getFieldError } = form;

  return (
    <MainLayout
      noHeaderTitle
      headerHeight="70px"
      noFooter
      loading={loading}
    >
      <div className="container" style={{ height: '100%' }}>
        <div className={styles.sidebar_panel}>
          <div className={styles.sidebar}>
            <div className={styles.menu}>
              <div className={styles.menu_title}>文档</div>
              <div className={`${styles.menu_item} ${styles.acitive}`}>待我签署</div>
              <div className={styles.menu_item}>待他人签署</div>
              <div className={styles.menu_item}>已完成</div>
              <div className={styles.menu_item}>已关闭</div>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.seachbar}>搜索栏</div>
            <div className={styles.table}>文件列表</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.personRnInfo, loading: state.loading.global };
}

const formOpts = {
  mapPropsToFields(props) {
    return props;
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(DocList));
