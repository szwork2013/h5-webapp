import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import MainLayout from '../components/Layout/MainLayout';
import StepBar from '../components/StepBar';
import styles from './mixins.less';

function PersonRnFinish(props) {
  const { dispatch, loading, afterRnRedirectUrl } = props;
  const next = () => {
    dispatch(routerRedux.push(afterRnRedirectUrl));
  };
  return (
    <MainLayout
      headerName="实名认证"
      loading={loading}
    >
      <div>
        <StepBar current="3" nameStep1="身份证验证" nameStep2="银行卡验证" nameStep3="实名完成" />
        <div className={styles.finish}>已通过实名认证</div>
        <button className="btn primary" style={{ marginTop: '20px' }} onClick={next}>继续</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.global, afterRnRedirectUrl: state.global.afterRnRedirectUrl, loading: state.loading.global };
}

export default connect(mapStateToProps)(PersonRnFinish);
