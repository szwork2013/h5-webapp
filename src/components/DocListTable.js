import React from 'react';
import { Table } from 'antd';

const DocListTable = (props) => {
  const { dispatch, selectedRowKeys, columns, data, pageInfo } = props;
  const onSelectChange = (keys) => {
    console.log('selectedRowKeys changed: ', keys);
    // this.setState({ selectedRowKeys });
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const onChange = (page) => {
    dispatch({
      type: 'docList/changePage',
      payload: {
        page,
      },
    });
  };
  const showTotal = (total, range) => {
    return `显示 ${range[0]} - ${range[1]} 条，共 ${total} 条记录`;
  };
  const pagination = {
    total: pageInfo.totalCount,
    pageSize: pageInfo.pageSize,
    current: pageInfo.curPage,
    showQuickJumper: true,
    onChange,
    showTotal,
  };
  return (
    <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
  );
};

DocListTable.propTypes = {
};

export default DocListTable;
