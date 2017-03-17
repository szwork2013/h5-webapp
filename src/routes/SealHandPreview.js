import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import MainLayout from '../components/Layout/MainLayout';
import styles from './mixins.less';

function SealHandPreview(props) {
  const { dispatch, loading, previewUrl } = props;
  const reCreate = () => {
    dispatch(routerRedux.push('/sealCreateHand'));
  };
  return (
    <MainLayout
      headerName="创建手绘印章"
      loading={loading}
    >
      <div>
        <div className={styles.hand_preview_div}>
          <img role="presentation" src={previewUrl} />
        </div>
        <div className={styles.hand_preview_btn_grp}>
          <button className="btn default" onClick={reCreate}>重建</button>
          <button className="btn primary">完成</button>
        </div>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.sealHandPreview, loading: state.loading.global };
}

export default connect(mapStateToProps)(SealHandPreview);
