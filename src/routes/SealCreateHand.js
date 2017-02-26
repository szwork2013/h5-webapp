import React from 'react';
import { connect } from 'dva';
import MainLayout from '../components/Layout/MainLayout';
import styles from './mixins.less';

function SealCreateHand(props) {
  const { qrUrl } = props;
  return (
    <MainLayout
      headerName="创建手绘印章"
    >
      <div>
        <div style={{ marginTop: '140px' }}>
          <img width="130px" height="130px" role="presentation" src={qrUrl} />
          <div className={styles.qr_desc}>手机扫一扫创建手绘签名</div>
        </div>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.sealCreateHand };
}

export default connect(mapStateToProps)(SealCreateHand);
