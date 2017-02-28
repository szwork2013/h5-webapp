import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import { Upload } from 'antd';
import MainLayout from '../components/Layout/MainLayout';
import StepBar from '../components/StepBar';
import InputWithLabel from '../components/InputWithLabel';
import styles from './mixins.less';

function PersonRnInfo(props) {
  const { dispatch, form, loading, frontIdOssKey, endIdOssKey } = props;
  const { getFieldProps, getFieldError } = form;

  const onFileChange = (info, fieldName) => {
    console.log(info.file);
    dispatch({
      type: 'personRnInfo/fileUpload',
      payload: {
        info,
        fieldName,
      },
    });
  };
  const next = (e) => {
    e.stopPropagation();
    form.validateFields({ force: true }, (error) => {
      if (error) {
        return null;
      } else {
        dispatch({
          type: 'personRnInfo/updatePersonInfo',
        });
      }
    });
  };
  return (
    <MainLayout
      headerName="实名认证"
      loading={loading}
    >
      <div>
        <StepBar current="1" nameStep1="身份证验证" nameStep2="银行卡验证" nameStep3="实名完成" />
        <div className={styles.up_warning}>请上传身份证的正面照和手持身份证照片，保证五官清晰可见，照片内容真实有效。</div>
        <div className={styles.upload}>
          <div className={styles.upload_local}>
            <div className={styles.upload_local_desc}>身份证件照</div>
            { frontIdOssKey.value ?
              <div className={`${styles.upload_local_img} ${styles.img1}`} style={{ backgroundImage: `url(${frontIdOssKey.value})` }} /> :
              <div className={`${styles.upload_local_img} ${styles.img1}`} />
            }
            <Upload
              name="frontId"
              action="../../service/file/uploadFile"
              withCredentials
              showUploadList={false}
              onChange={(info) => { onFileChange(info, 'frontIdOssKey'); }}
            >
              <button className="btn cutout">本地上传</button>
            </Upload>
            <InputWithLabel
              labelName="身份证件照" hideInput
              {...getFieldProps('frontIdOssKey', {
                rules: [
                  { required: true, message: '请上传身份证件照' },
                ],
              })}
              error={!!getFieldError('frontIdOssKey')}
              errorMsg={!getFieldError('frontIdOssKey') ? '' : getFieldError('frontIdOssKey').join('、')}
            />
            <div className={styles.upload_local_desc}>手持身份证照</div>
            { endIdOssKey.value ?
              <div className={`${styles.upload_local_img} ${styles.img2}`} style={{ backgroundImage: `url(${endIdOssKey.value})` }} /> :
              <div className={`${styles.upload_local_img} ${styles.img2}`} />
            }
            <Upload
              name="backId"
              action="../../service/file/uploadFile"
              withCredentials
              showUploadList={false}
              onChange={(info) => { onFileChange(info, 'endIdOssKey'); }}
            >
              <button className="btn cutout">本地上传</button>
            </Upload>
            <InputWithLabel
              labelName="手持身份证照" hideInput
              {...getFieldProps('endIdOssKey', {
                rules: [
                  { required: true, message: '请上传手持身份证照' },
                ],
              })}
              error={!!getFieldError('endIdOssKey')}
              errorMsg={!getFieldError('endIdOssKey') ? '' : getFieldError('endIdOssKey').join('、')}
            />
          </div>
          <div className={styles.upload_divide}><span>或</span></div>
          <div className={styles.upload_phone}>
            <div className={styles.upload_phone_img} />
            <div>手机扫一扫拍照上传</div>
          </div>
        </div>
        <button className="btn primary" style={{ marginTop: '40px', marginBottom: '60px' }} onClick={next}>下一步</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.personRnInfo, loading: state.loading.global };
}

const formOpts = {
  mapPropsToFields(props) {
    return props;
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(PersonRnInfo));
