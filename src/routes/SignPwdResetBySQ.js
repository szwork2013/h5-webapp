import React from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import { Modal } from 'antd';
import './antdCustomization.less';
import MainLayout from '../components/Layout/MainLayout';
import InputWithLabel from '../components/InputWithLabel';
import './mixins.less';

function SignPwdResetBySQ(props) {
  const { form } = props;
  const { getFieldProps, getFieldError } = form;
  const onSubmit = (e) => {
    e.stopPropagation();
    Modal.success({
      title: (
        <div className="modal title">签署密码重置成功</div>
      ),
      content: (
        <div className="modal text warning">签署密码非常重要，请您牢记新密码并做好保密工作。</div>
      ),
      iconType: null,
      okText: '完成',
    });
    form.validateFields({ force: true }, (error) => {
      if (error) {
        return null;
      } else {
        // dispatch({
        //   type: 'global/setStatus',
        //   status: 4,
        // });
        // dispatch(routerRedux.push('/organRnBank'));
      }
    });
  };
  return (
    <MainLayout
      headerName="签署密码重置"
    >
      <div>
        <InputWithLabel
          labelName="安全保护问题" style={{ marginTop: '40px' }}
          {...getFieldProps('question', {
            rules: [
              { required: true, message: '' },
            ],
          })}
          error={!!getFieldError('question')}
          errorMsg={!getFieldError('question') ? '' : getFieldError('question').join('、')}
        />
        <InputWithLabel
          labelName="答案"
          {...getFieldProps('answer', {
            rules: [
              { required: true, message: '请输入答案' },
            ],
          })}
          error={!!getFieldError('answer')}
          errorMsg={!getFieldError('answer') ? '' : getFieldError('answer').join('、')}
        />
        <InputWithLabel labelName="选择验证方式" />
        <InputWithLabel
          labelName="手机/邮箱"
          {...getFieldProps('mobile', {
            rules: [
              { required: true, message: '请输入手机' },
            ],
          })}
          error={!!getFieldError('mobile')}
          errorMsg={!getFieldError('mobile') ? '' : getFieldError('mobile').join('、')}
        />
        <InputWithLabel
          labelName="签署密码"
          {...getFieldProps('signPwd', {
            rules: [
              { required: true, message: '请输入签署密码' },
            ],
          })}
          error={!!getFieldError('signPwd')}
          errorMsg={!getFieldError('signPwd') ? '' : getFieldError('signPwd').join('、')}
        />
        <InputWithLabel
          labelName="确认密码"
          {...getFieldProps('confirmPwd', {
            rules: [
              { required: true, message: '请输入确认密码' },
            ],
          })}
          error={!!getFieldError('confirmPwd')}
          errorMsg={!getFieldError('confirmPwd') ? '' : getFieldError('confirmPwd').join('、')}
        />
        <InputWithLabel
          labelName="图形验证码"
          {...getFieldProps('captcha', {
            rules: [
              { required: true, message: '请输入图形验证码' },
            ],
          })}
          error={!!getFieldError('captcha')}
          errorMsg={!getFieldError('captcha') ? '' : getFieldError('captcha').join('、')}
        />
        <InputWithLabel
          labelName="验证码"
          {...getFieldProps('code', {
            rules: [
              { required: true, message: '请输入验证码' },
            ],
          })}
          error={!!getFieldError('code')}
          errorMsg={!getFieldError('code') ? '' : getFieldError('code').join('、')}
        />
        <button className="btn primary" style={{ marginTop: '20px', marginBottom: '60px' }} onClick={onSubmit} >确认提交</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.signPwdResetBySQ };
}

const formOpts = {
  mapPropsToFields(props) {
    return props;
  },
  onFieldsChange(props, changedFields) {
    const { dispatch } = props;
    const fields = {};
    for (const value of Object.values(changedFields)) {
      fields[value.name] = { value: value.value };
      fields[value.name].errors = value.errors;
    }
    dispatch({
      type: 'signPwdResetBySQ/fieldsChange',
      fields,
    });
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(SignPwdResetBySQ));
