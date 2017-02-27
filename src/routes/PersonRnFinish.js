import React from 'react';
import { connect } from 'dva';
import MainLayout from '../components/Layout/MainLayout';
import StepBar from '../components/StepBar';
import styles from './mixins.less';

function PersonRnFinish(props) {
  const { loading } = props;
  return (
    <MainLayout
      headerName="实名认证"
      loading={loading}
    >
      <div>
        <StepBar current="3" nameStep1="身份证验证" nameStep2="银行卡验证" nameStep3="实名完成" />
        <div className={styles.finish}>已通过实名认证</div>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.global, loading: state.loading.global };
}

export default connect(mapStateToProps)(PersonRnFinish);
