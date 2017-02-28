import React from 'react';
import { connect } from 'dva';
import MainLayout from '../components/Layout/MainLayout';
import './mixins.less';

function NotFound(props) {
  const { loading } = props;
  return (
    <MainLayout
      headerName="页面未找到"
      loading={loading}
    >
      <div>
        <h1>404</h1>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { loading: state.loading.global };
}

export default connect(mapStateToProps)(NotFound);
