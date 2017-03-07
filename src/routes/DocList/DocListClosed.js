import React from 'react';
import { connect } from 'dva';
import DocListTable from '../../components/DocListTable';
import styles from '../mixins.less';

function DocListClosed(props) {
  const { dispatch, selectedRowKeys, columns, data, pageInfo } = props;
  // 操作列添加操作按钮
  for (const col of columns) {
    if (col.key === 99) {
      col.render = (text, record, index) => {
        return (
          <div className={styles.operation}>
            <a>删除</a>
            <a onClick={() => { dispatch({ type: 'docList/showLogModal', payload: { docId: record.docId } }); }}>文档流程</a>
          </div>
        );
      };
    }
  }
  return (
    <div>
      <DocListTable dispatch={dispatch} selectedRowKeys={selectedRowKeys} columns={columns} data={data} pageInfo={pageInfo} />
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state.docList, loading: state.loading.global };
}

export default connect(mapStateToProps)(DocListClosed);
