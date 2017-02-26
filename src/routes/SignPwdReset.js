import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import MainLayout from '../components/Layout/MainLayout';
import styles from './mixins.less';
import phoneImg from '../assets/phone.png';
import upImg from '../assets/upimg.png';

function SignPwdReset(props) {
  const { dispatch } = props;
  const bySecurity = () => {
    dispatch(routerRedux.push('/sealCreateHand'));
  };
  const byIdFiles = () => {
    dispatch(routerRedux.push('/sealCreateHand'));
  };
  return (
    <MainLayout
      headerName="签署密码重置"
    >
      <div>
        <div className={styles.reset_title}>您正在找回签署密码，请选择找回方式：</div>
        <div className={styles.reset_panel}>
          <div className={styles.reset_panel_item}>
            <div className={styles.reset_panel_item_img} onClick={bySecurity}>
              <img role="presentation" src={phoneImg} />
              <div className={styles.title}>通过“安全保护问题+验证手机/邮箱”</div>
            </div>
            <div className={styles.reset_panel_item_desc}>
              <p>如果您的账号当前绑定的手机号或者邮箱还在使用，</p>
              <p>且记得预留的安全保护问题，请选择此方式</p>
            </div>
          </div>
          <div className={styles.reset_panel_item}>
            <div className={styles.reset_panel_item_img} onClick={byIdFiles}>
              <img role="presentation" src={upImg} />
              <div className={styles.title}>通过人工服务</div>
            </div>
            <div className={styles.reset_panel_item_desc}>
              <p>填写申请单，上传身份证件图片，</p>
              <p>我们会在48小时内受理，请耐心等待</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.signPwdReset };
}

export default connect(mapStateToProps)(SignPwdReset);
