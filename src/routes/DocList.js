import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import MainLayout from '../components/Layout/MainLayout';
import styles from './mixins.less';
import Constants from '../Constants';

function DocList(props) {
  const { dispatch, type, waitForMeCount, waitForOthersCount, finishedCount, closedCount, children, loading } = props;
  // const { getFieldProps, getFieldError } = form;

  const waitForMeCls = classnames({
    [styles.menu_item]: true,
    [styles.active]: type === Constants.DocType.WAITFORME,
  });
  const waitForOthersCls = classnames({
    [styles.menu_item]: true,
    [styles.active]: type === Constants.DocType.WAITFOROTHERS,
  });
  const finishedCls = classnames({
    [styles.menu_item]: true,
    [styles.active]: type === Constants.DocType.FINISHED,
  });
  const closedCls = classnames({
    [styles.menu_item]: true,
    [styles.active]: type === Constants.DocType.CLOSED,
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
              <div className={waitForMeCls} onClick={() => { changeType(Constants.DocType.WAITFORME); }} >
                <div>待我签署</div>
                <div>{waitForMeCount}</div>
              </div>
              <div className={waitForOthersCls} onClick={() => { changeType(Constants.DocType.WAITFOROTHERS); }} >
                <div>待他人签署</div>
                <div>{waitForOthersCount}</div>
              </div>
              <div className={finishedCls} onClick={() => { changeType(Constants.DocType.FINISHED); }} >
                <div>已完成</div>
                <div>{finishedCount}</div>
              </div>
              <div className={closedCls} onClick={() => { changeType(Constants.DocType.CLOSED); }} >
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

export default connect(mapStateToProps)(DocList);
