import React from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import MainLayout from '../components/Layout/MainLayout';
import StepBar from '../components/StepBar';
import styles from './mixins.less';

function PersonRnInfo() {
  return (
    <MainLayout
      headerName="实名认证"
    >
      <div>
        <StepBar current="1" nameStep1="身份证验证" nameStep2="银行卡验证" nameStep3="签署密码设置" />
        <div className={styles.up_warning}>请上传身份证的正面照和手持身份证照片，保证五官清晰可见，照片内容真实有效。</div>
        <div className={styles.upload}>
          <div className={styles.upload_local}>
            <div className={styles.upload_local_desc}>身份证件照</div>
            <div className={`${styles.upload_local_img} ${styles.img1}`} />
            <button className="btn cutout">本地上传</button>
            <div className={styles.upload_local_desc}>手持身份证照</div>
            <div className={`${styles.upload_local_img} ${styles.img2}`} />
            <button className="btn cutout">本地上传</button>
          </div>
          <div className={styles.upload_divide}><span>或</span></div>
          <div className={styles.upload_phone}>
            <div className={styles.upload_phone_img} />
            <div>手机扫一扫拍照上传</div>
          </div>
        </div>
        <button className="btn primary" style={{ marginTop: '40px', marginBottom: '60px' }}>下一步</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.personRnInfo };
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
      type: 'personRnInfo/fieldsChange',
      fields,
    });
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(PersonRnInfo));
