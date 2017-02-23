import React from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import MainLayout from '../components/Layout/MainLayout';
import StepBar from '../components/StepBar';
import InputWithLabel from '../components/InputWithLabel';
import './mixins.less';

function PersonRnBank(props) {
  const { dispatch, form } = props;
  const { getFieldProps, getFieldError } = form;
  const onSubmit = (e) => {
    e.stopPropagation();
    form.validateFields({ force: true }, (error) => {
      if (error) {
        return null;
      } else {
        dispatch({
          type: 'global/setRnStatusPerson',
          rnStatusPerson: '4',
        });
      }
    });
  };
  const onSend = (e) => {
    e.stopPropagation();
    form.validateFields(['name', 'idno', 'cardno', 'mobile'], { force: true }, (error) => {
      if (error) {
        return null;
      } else {
        dispatch({
          type: 'global/setRnStatusPerson',
          rnStatusPerson: '4',
        });
      }
    });
  };
  return (
    <MainLayout
      headerName="实名认证"
    >
      <div>
        <StepBar current="2" nameStep1="身份证验证" nameStep2="银行卡验证" nameStep3="实名完成" />
        <InputWithLabel
          labelName="姓名" style={{ marginTop: '40px' }}
          {...getFieldProps('name', {
            rules: [
              { required: true, message: '请输入姓名' },
            ],
          })}
          error={!!getFieldError('name')}
          errorMsg={!getFieldError('name') ? '' : getFieldError('name').join('、')}
        />
        <InputWithLabel
          labelName="身份证号"
          {...getFieldProps('idno', {
            rules: [
              { required: true, message: '请输入身份证号' },
            ],
          })}
          error={!!getFieldError('idno')}
          errorMsg={!getFieldError('idno') ? '' : getFieldError('idno').join('、')}
        />
        <InputWithLabel
          labelName="银行卡号"
          {...getFieldProps('cardno', {
            rules: [
              { required: true, message: '请输入银行卡号' },
            ],
          })}
          error={!!getFieldError('cardno')}
          errorMsg={!getFieldError('cardno') ? '' : getFieldError('cardno').join('、')}
        />
        <InputWithLabel
          labelName="银行预留手机号"
          {...getFieldProps('mobile', {
            rules: [
              { required: true, message: '请输入银行预留手机号' },
            ],
          })}
          error={!!getFieldError('mobile')}
          errorMsg={!getFieldError('mobile') ? '' : getFieldError('mobile').join('、')}
        />
        <InputWithLabel
          labelName="短信验证码"
          inputWidth="140px"
          {...getFieldProps('code', {
            rules: [
              { required: true, message: '请输入短信验证码' },
            ],
          })}
          error={!!getFieldError('code')}
          errorMsg={!getFieldError('code') ? '' : getFieldError('code').join('、')}
        >
          <button className="btn send" onClick={onSend} >发送验证码</button>
        </InputWithLabel>
        <button className="btn primary" style={{ marginTop: '20px', marginBottom: '60px' }} onClick={onSubmit} >下一步</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.personRnBank };
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
      type: 'personRnBank/fieldsChange',
      fields,
    });
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(PersonRnBank));
