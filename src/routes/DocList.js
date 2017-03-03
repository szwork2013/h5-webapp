import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { createForm } from 'rc-form';
import { Upload } from 'antd';
import classnames from 'classnames';
import MainLayout from '../components/Layout/MainLayout';
import PathConstants from '../PathConstants';
import styles from './mixins.less';

function DocList(props) {
  const { dispatch, form, type, waitForMeCount, waitForOthersCount, finishedCount, closedCount, children, loading } = props;
  // const { getFieldProps, getFieldError } = form;

  const waitForMeCls = classnames({
    [styles.menu_item]: true,
    [styles.active]: type === 4,
  });
  const waitForOthersCls = classnames({
    [styles.menu_item]: true,
    [styles.active]: type === 5,
  });
  const finishedCls = classnames({
    [styles.menu_item]: true,
    [styles.active]: type === 2,
  });
  const closedCls = classnames({
    [styles.menu_item]: true,
    [styles.active]: type === 11,
  });

  const changeType = (t) => {
    dispatch({
      type: 'docList/changeType',
      payload: {
        type: t,
      },
    });
  };

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
              <div className={waitForMeCls} onClick={() => { changeType(4); }} >
                <div>待我签署</div>
                <div>{waitForMeCount}</div>
              </div>
              <div className={waitForOthersCls} onClick={() => { changeType(5); }} >
                <div>待他人签署</div>
                <div>{waitForOthersCount}</div>
              </div>
              <div className={finishedCls} onClick={() => { changeType(2); }} >
                <div>已完成</div>
                <div>{finishedCount}</div>
              </div>
              <div className={closedCls} onClick={() => { changeType(11); }} >
                <div>已关闭</div>
                <div>{closedCount}</div>
              </div>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.seachbar}>搜索栏</div>
            <div className={styles.table}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.docList, loading: state.loading.global };
}

const formOpts = {
  mapPropsToFields(props) {
    return props;
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(DocList));
