import React from 'react';
import { connect } from 'dva';
import MainLayout from '../components/Layout/MainLayout';
import InputWithLabel from '../components/InputWithLabel';
import SelectWithLabel from '../components/SelectWithLabel';
import './mixins.less';

function SignPwd(props) {
  const { loading } = props;
  return (
    <MainLayout
      headerName="签署密码"
      loading={loading}
    >
      <div>
        <InputWithLabel
          type="password"
          labelName="签署密码" style={{ paddingTop: '40px' }}
          placeholder="6-15个英文字母、数字或符号的组合"
        />
        <SelectWithLabel
          labelName="安全问题1"
        />
        <InputWithLabel
          labelName="答案"
          placeholder="支持2-10个字符"
        />
        <InputWithLabel
          labelName="安全问题2"
        />
        <InputWithLabel
          labelName="答案"
          placeholder="支持2-10个字符"
        />
        <button className="btn primary" style={{ marginTop: '30px', marginBottom: '40px' }} >确认提交</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.global, loading: state.loading.global };
}

export default connect(mapStateToProps)(SignPwd);
