import React from 'react';
import { connect } from 'dva';
import MainLayout from '../components/Layout/MainLayout';
import StepBar from '../components/StepBar';
import InputWithLabel from '../components/InputWithLabel';
import styles from './mixins.less';

function OrganRnBank(props) {
  const { rnStatus, loading } = props;
  let element;
  switch (rnStatus) {
    case '1':
      element = () => {
        return (
          <div>
            <InputWithLabel labelName="对公银行名称" style={{ marginTop: '40px' }} />
            <InputWithLabel labelName="对公银行支行名称" />
            <InputWithLabel labelName="对公银行账号" />
            <button className="btn primary" style={{ marginTop: '20px', marginBottom: '60px' }}>下一步</button>
          </div>
        );
      };
      break;
    case '4':
      element = () => {
        return (
          <div>
            <div className={styles.waiting} />
            <div className={styles.waiting_desc}>
              <div>您的资料已通过审核</div>
              <div>正在安排银行打款</div>
            </div>
          </div>
        );
      };
      break;
    case '5':
      element = (() => {
        return (
          <div>
            <div className={styles.waited_desc}>
              <div>已向您的对公账号打入一笔钱</div>
              <div>请输入收到的金额并验证</div>
              <div className={styles.waited_input}>
                <input defaultValue="0." maxLength="1" />
                <input maxLength="1" />
                <input maxLength="1" />
              </div>
              <div className={styles.waited_btn}>
                <button className="btn primary">验证</button>
              </div>
            </div>
          </div>
        );
      });
      break;
    default:
      element = () => {
        return (
          <div>
            <InputWithLabel labelName="对公银行名称" style={{ marginTop: '40px' }} />
            <InputWithLabel labelName="对公银行支行名称" />
            <InputWithLabel labelName="对公银行账号" />
            <button className="btn primary" style={{ marginTop: '20px', marginBottom: '60px' }}>下一步</button>
          </div>
        );
      };
  }
  return (
    <MainLayout
      headerName="实名认证"
      loading={loading}
    >
      <div>
        <StepBar current="2" nameStep1="企业基本信息" nameStep2="企业认证" nameStep3="实名完成" />
        {element()}
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.global, ...state.organRnBank, loading: state.loading.global };
}

export default connect(mapStateToProps)(OrganRnBank);
