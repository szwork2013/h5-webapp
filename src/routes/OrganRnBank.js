import React from 'react';
import { connect } from 'dva';
import MainLayout from '../components/Layout/MainLayout';
import StepBar from '../components/StepBar';
import InputWithLabel from '../components/InputWithLabel';
import './mixins.less';

function OrganRnBank() {
  return (
    <MainLayout
      headerName="实名认证"
    >
      <div>
        <StepBar current="2" />
        <InputWithLabel labelName="对公银行名称" style={{ marginTop: '40px' }} />
        <InputWithLabel labelName="对公银行支行名称" />
        <InputWithLabel labelName="对公银行账号" />
        <button className="btn primary" style={{ marginTop: '20px', marginBottom: '60px' }}>下一步</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.organRnBank };
}

export default connect(mapStateToProps)(OrganRnBank);
