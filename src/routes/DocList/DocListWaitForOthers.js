import React from 'react';
import { connect } from 'dva';
import { Popconfirm } from 'antd';
import DocListTable from '../../components/DocListTable';
import styles from '../mixins.less';

function DocListWaitForOthers(props) {
  const { dispatch, selectedRowKeys, columns, data, pageInfo } = props;
  // 操作列添加操作按钮
  for (const col of columns) {
    if (col.key === 99) {
      col.render = (text, record, index) => {
        return (
          <div className={styles.operation}>
            <a>催签</a>
            <Popconfirm placement="top" overlayClassName="closeDocPop" title="您确认结束此文件的签署吗？一旦关闭则无法恢复。" onConfirm={() => { dispatch({ type: 'docList/closeDoc', payload: { docId: record.docId } }); }}>
              <a>关闭</a>
            </Popconfirm>
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

export default connect(mapStateToProps)(DocListWaitForOthers);
