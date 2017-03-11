import React from 'react';
import { connect } from 'dva';

function DocView() {
  return (
    <div>
      111
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state.docList, loading: state.loading.global };
}

export default connect(mapStateToProps)(DocView);
