import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import MainLayout from '../components/Layout/MainLayout';
import StepBar from '../components/StepBar';
import InputWithLabel from '../components/InputWithLabel';
import styles from './mixins.less';

function OrganRnBank(props) {
  const { dispatch, form, status, loading } = props;
  const { getFieldProps, getFieldError } = form;
  const onSubmit = (e) => {
    e.stopPropagation();
    form.validateFields({ force: true }, (error) => {
      if (error) {
        return null;
      } else {
        dispatch({
          type: 'organRnBank/organToPay',
        });
      }
    });
  };
  let element;
  switch (status) {
    case 2:
      element = () => {
        return (
          <div>
            <InputWithLabel
              labelName="对公账户户名" style={{ marginTop: '40px' }}
              {...getFieldProps('name', {
                rules: [
                  { required: true, message: '请输入对公账户名(一般来说即企业名称)' },
                ],
              })}
              error={!!getFieldError('name')}
              errorMsg={!getFieldError('name') ? '' : getFieldError('name').join('、')}
            />
            <InputWithLabel
              labelName="对公银行名称"
              {...getFieldProps('bank', {
                rules: [
                  { required: true, message: '请输入对公银行名称' },
                ],
              })}
              error={!!getFieldError('bank')}
              errorMsg={!getFieldError('bank') ? '' : getFieldError('bank').join('、')}
            />
            <InputWithLabel
              labelName="对公银行支行全称"
              {...getFieldProps('subbranch', {
                rules: [
                  { required: true, message: '请输入对公银行支行全称' },
                ],
              })}
              error={!!getFieldError('subbranch')}
              errorMsg={!getFieldError('subbranch') ? '' : getFieldError('subbranch').join('、')}
            />
            <InputWithLabel
              labelName="对公银行账号"
              {...getFieldProps('cardno', {
                rules: [
                  { required: true, message: '请输入对公银行账号' },
                ],
              })}
              error={!!getFieldError('cardno')}
              errorMsg={!getFieldError('cardno') ? '' : getFieldError('cardno').join('、')}
            />
            <InputWithLabel
              labelName="开户行所在省份"
              {...getFieldProps('provice', {
                rules: [
                  { required: true, message: '请输入开户行所在省份' },
                ],
              })}
              error={!!getFieldError('provice')}
              errorMsg={!getFieldError('provice') ? '' : getFieldError('provice').join('、')}
            />
            <InputWithLabel
              labelName="开户行所在城市"
              {...getFieldProps('city', {
                rules: [
                  { required: true, message: '请输入开户行所在省份' },
                ],
              })}
              error={!!getFieldError('city')}
              errorMsg={!getFieldError('city') ? '' : getFieldError('city').join('、')}
            />
            <button className="btn primary" style={{ marginTop: '20px', marginBottom: '60px' }} onClick={onSubmit}>下一步</button>
          </div>
        );
      };
      break;
    case 34:
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
    case 35:
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

export default connect(mapStateToProps)(createForm(formOpts)(OrganRnBank));
