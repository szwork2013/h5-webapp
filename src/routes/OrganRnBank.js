import React from 'react';
import { connect } from 'dva';
import MainLayout from '../components/Layout/MainLayout';
import StepBar from '../components/StepBar';
import InputWithLabel from '../components/InputWithLabel';
import './mixins.less';

function OrganRnBank(props) {
  const { rnStatus } = props;
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
            <div>正在打款</div>
          </div>
        );
      };
      break;
    case '5':
      element = (() => {
        return (
          <div>
            <div>请输入金额验证</div>
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
    >
      <div>
        <StepBar current="2" />
        {element()}
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.organRnGlobal, ...state.organRnBank };
}

export default connect(mapStateToProps)(OrganRnBank);
