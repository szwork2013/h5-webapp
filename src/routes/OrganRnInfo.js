import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import MainLayout from '../components/Layout/MainLayout';
import StepBar from '../components/StepBar';
import InputWithLabel from '../components/InputWithLabel';
import './mixins.less';

function OrganRnInfo(props) {
  const { dispatch, form } = props;
  const { getFieldProps, getFieldError } = form;
  const onSubmit = (e) => {
    e.stopPropagation();
    form.validateFields({ force: true }, (error) => {
      if (error) {
        alert('校验失败');
      } else {
        dispatch(routerRedux.push('/organRnBank'));
      }
    });
  };
  const test = { ...getFieldProps('name', {
    rules: [
      { required: true, message: '请输入企业名称' },
    ],
  }) };
  return (
    <MainLayout
      headerName="实名认证"
    >
      <div>
        <StepBar current="1" />
        <InputWithLabel
          labelName="企业全称" style={{ marginTop: '40px' }}
          {...getFieldProps('name', {
            rules: [
              { required: true, message: '请输入企业名称' },
            ],
          })}
        />
        <InputWithLabel labelName="组织机构代码/统一社会信用代码" />
        <InputWithLabel labelName="营业期限至" />
        <InputWithLabel labelName="法人姓名" />
        <InputWithLabel labelName="法人身份证号" />
        <button className="btn primary" style={{ marginTop: '20px', marginBottom: '60px' }} onClick={onSubmit} >下一步</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.organRnInfo };
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
