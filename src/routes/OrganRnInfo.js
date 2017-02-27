import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import MainLayout from '../components/Layout/MainLayout';
import StepBar from '../components/StepBar';
import InputWithLabel from '../components/InputWithLabel';
import './mixins.less';

function OrganRnInfo(props) {
  const { dispatch, form, loading } = props;
  const { getFieldProps, getFieldError } = form;
  const onSubmit = (e) => {
    e.stopPropagation();
    form.validateFields({ force: true }, (error) => {
      if (error) {
        return null;
      } else {
        dispatch({
          type: 'global/setRnStatus',
          rnStatus: '4',
        });
        dispatch(routerRedux.push('/organRnBank'));
      }
    });
  };
  return (
    <MainLayout
      headerName="实名认证"
      loading={loading}
    >
      <div>
        <StepBar current="1" nameStep1="企业基本信息" nameStep2="企业认证" nameStep3="实名完成" />
        <InputWithLabel
          labelName="企业全称" style={{ marginTop: '40px' }}
          {...getFieldProps('name', {
            rules: [
              { required: true, message: '请输入企业名称' },
            ],
          })}
          error={!!getFieldError('name')}
          errorMsg={!getFieldError('name') ? '' : getFieldError('name').join('、')}
        />
        <InputWithLabel
          labelName="组织机构代码/统一社会信用代码"
          {...getFieldProps('codeORG', {
            rules: [
              { required: true, message: '请输入组织机构代码' },
            ],
          })}
          error={!!getFieldError('codeORG')}
          errorMsg={!getFieldError('codeORG') ? '' : getFieldError('codeORG').join('、')}
        />
        <InputWithLabel labelName="营业期限至" />
        <InputWithLabel
          labelName="法人姓名"
          {...getFieldProps('legalName', {
            rules: [
              { required: true, message: '请输入法人姓名' },
            ],
          })}
          error={!!getFieldError('legalName')}
          errorMsg={!getFieldError('legalName') ? '' : getFieldError('legalName').join('、')}
        />
        <InputWithLabel
          labelName="法人身份证号"
          {...getFieldProps('legalIdno', {
            rules: [
              { required: true, message: '请输入法人身份证号' },
            ],
          })}
          error={!!getFieldError('legalIdno')}
          errorMsg={!getFieldError('legalIdno') ? '' : getFieldError('legalIdno').join('、')}
        />
        <button className="btn primary" style={{ marginTop: '20px', marginBottom: '60px' }} onClick={onSubmit} >下一步</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.organRnInfo, loading: state.loading.global };
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
      type: 'organRnInfo/fieldsChange',
      fields,
    });
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(OrganRnInfo));
