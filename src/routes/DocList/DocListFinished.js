import React from 'react';
import { connect } from 'dva';
import { Popconfirm } from 'antd';
import DocListTable from '../../components/DocListTable';
import styles from '../mixins.less';

function DocListFinished(props) {
  const { dispatch, selectedRowKeys, columns, data, pageInfo } = props;
  const showReceivers = (record) => {
    dispatch({
      type: 'docList/setReceiverList',
      payload: {
        receiverList: record.sends,
      },
    });
  };
  const docInfo = (record) => {
  };
  for (const col of columns) {
    // 操作列添加操作按钮
    if (col.key === 99) {
      col.render = (text, record, index) => {
        return (
          <div className={styles.operation}>
            <a onClick={() => { dispatch({ type: 'docList/downloadDoc', payload: { docId: record.docId } }); }}>下载</a>
            <Popconfirm placement="top" overlayClassName="deleteDocPop" title="确认删除文档？" onConfirm={() => { dispatch({ type: 'docList/deleteDoc', payload: { docId: record.docId } }); }}>
              <a>删除</a>
            </Popconfirm>
            <a onClick={() => { dispatch({ type: 'docList/showLogModal', payload: { docId: record.docId } }); }}>文档流程</a>
          </div>
        );
      };
    }
    // 收件人特殊处理
    if (col.key === 2) {
      col.render = (text, record, index) => {
        return (
          <div className={styles.operation}>
            { text === '多人' ?
              <a onClick={() => { showReceivers(record); }}>{text}</a> :
              <span>{ text }</span>
            }
          </div>
        );
      };
    }
    // 文件名处理 增加链接到详情
    if (col.key === 3) {
      col.render = (text, record, index) => {
        return (
          <div className={styles.operation}>
            <a onClick={() => { docInfo(record); }}>{text}</a>
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

export default connect(mapStateToProps)(DocListFinished);
