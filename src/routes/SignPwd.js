import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import MainLayout from '../components/Layout/MainLayout';
import InputWithLabel from '../components/InputWithLabel';
import SelectWithLabel from '../components/SelectWithLabel';
import './mixins.less';

function SignPwd(props) {
  const { dispatch, form, loading, questionList } = props;
  const { getFieldProps, getFieldError } = form;
  const onSubmit = (e) => {
    e.stopPropagation();
    form.validateFields({ force: true }, (error) => {
      if (error) {
        return null;
      } else {
        dispatch({
          type: 'signPwd/updateAccountPwd',
        });
      }
    });
  };
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
          {...getFieldProps('pwd', {
            rules: [
              { required: true, message: '请输入签署密码' },
              { min: 6, message: '需6至15位' },
              { max: 15, message: '需6至15位' },
              { pattern: /[a-zA-Z]+(?=[0-9]+)|[0-9]+(?=[a-zA-Z]+)/g, message: '需数字、字母或符号组合' },
            ],
          })}
          error={!!getFieldError('pwd')}
          errorMsg={!getFieldError('pwd') ? '' : getFieldError('pwd').join('、')}
        />
        <SelectWithLabel
          labelName="安全问题1"
          options={questionList}
          {...getFieldProps('question1', {
            rules: [
              { required: true, message: '请选择问题' },
            ],
          })}
          error={!!getFieldError('question1')}
          errorMsg={!getFieldError('question1') ? '' : getFieldError('question1').join('、')}
        />
        <InputWithLabel
          labelName="答案"
          placeholder="支持2-10个字符"
          {...getFieldProps('answer1', {
            rules: [
              { required: true, message: '请输入答案' },
              { min: 2, message: '支持2-10个字符' },
              { max: 10, message: '支持2-10个字符' },
            ],
          })}
          error={!!getFieldError('answer1')}
          errorMsg={!getFieldError('answer1') ? '' : getFieldError('answer1').join('、')}
        />
        <SelectWithLabel
          labelName="安全问题2"
          options={questionList}
          {...getFieldProps('question2', {
            rules: [
              { required: true, message: '请选择问题' },
            ],
          })}
          error={!!getFieldError('question2')}
          errorMsg={!getFieldError('question2') ? '' : getFieldError('question2').join('、')}
        />
        <InputWithLabel
          labelName="答案"
          placeholder="支持2-10个字符"
          {...getFieldProps('answer2', {
            rules: [
              { required: true, message: '请输入答案' },
              { min: 2, message: '支持2-10个字符' },
              { max: 10, message: '支持2-10个字符' },
            ],
          })}
          error={!!getFieldError('answer2')}
          errorMsg={!getFieldError('answer2') ? '' : getFieldError('answer2').join('、')}
        />
        <button className="btn primary" style={{ marginTop: '30px', marginBottom: '40px' }} onClick={onSubmit}>确认提交</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.signPwd, loading: state.loading.global };
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
      type: 'signPwd/fieldsChange',
      fields,
    });
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(SignPwd));
