import React from 'react';
import { connect } from 'dva';
import MainLayout from '../components/Layout/MainLayout';
import InputWithLabel from '../components/InputWithLabel';
import styles from './mixins.less';

function OrganSignPwd() {
  return (
    <MainLayout
      headerName="签署密码"
    >
      <div>
        <InputWithLabel
          type="password"
          labelName="签署密码" style={{ paddingTop: '40px' }}
        />
        <InputWithLabel
          labelName="安全问题1"
        />
        <InputWithLabel
          labelName="答案"
        />
        <InputWithLabel
          labelName="安全问题2"
        />
        <InputWithLabel
          labelName="答案"
        />
        <button className="btn primary" style={{ marginTop: '30px', marginBottom: '40px' }} >确认提交</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.global };
}

export default connect(mapStateToProps)(OrganSignPwd);
