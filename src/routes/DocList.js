import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { Modal, Timeline, Table, DatePicker } from 'antd';
import classnames from 'classnames';
import MainLayout from '../components/Layout/MainLayout';
import InputWithLabelInLine from '../components/InputWithLabelInLine';
import styles from './mixins.less';
import Constants from '../Constants';

function DocList(props) {
  const { dispatch, form, type, waitForMeCount, waitForOthersCount, finishedCount, closedCount, draftCount, children, loading, optlogs, optlogsModVisible, receiverList, receiversModVisible, startDate, endDate } = props;
  const { getFieldProps } = form;

  const waitForMeCls = classnames({
    [styles.menu_item]: true,
    [styles.active]: type === Constants.DocType.WAITFORME,
  });
  const waitForOthersCls = classnames({
    [styles.menu_item]: true,
    [styles.active]: type === Constants.DocType.WAITFOROTHERS,
  });
  const finishedCls = classnames({
    [styles.menu_item]: true,
    [styles.active]: type === Constants.DocType.FINISHED,
  });
  const closedCls = classnames({
    [styles.menu_item]: true,
    [styles.active]: type === Constants.DocType.CLOSED,
  });
  const draftCls = classnames({
    [styles.menu_item]: true,
    [styles.active]: type === Constants.DocType.DRAFT,
  });

  const receiverListColumns = [
    {
      key: 0,
      title: '',
      width: '10%',
    },
    {
      key: 1,
      title: '发件人',
      dataIndex: 'senderName',
      width: '30%',
    },
    {
      key: 2,
      title: '收件人',
      dataIndex: 'receiverName',
      width: '30%',
    },
    {
      key: 3,
      title: '签署状态',
      dataIndex: 'isRead',
      width: '30%',
      render: text => (
        <span>
          { text === 0 ?
            '未签署' :
            '已签署'
          }
        </span>
      ),
    },
  ];

  const changeType = (t) => {
    dispatch({
      type: 'docList/changeType',
      payload: {
        type: t,
      },
    });
  };

  const cancel = () => {
    dispatch({
      type: 'docList/closeOptLogsMod',
    });
  };

  const cancelReceiverList = () => {
    dispatch({
      type: 'docList/closeReceiversMod',
    });
  };

  const convertOpt = (opt) => {
    switch (opt) {
      case 0:
        return '未处理';
      case 1:
        return '发起签署';
      case 2:
        return '已签署';
      case 4:
        return '重新发起签署';
      case 5:
        return '退回文件';
      case 6:
        return '关闭文件';
      default:
        return '未处理';
    }
  };

  const disabledStartDate = (startValue) => {
    const endValue = endDate;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  const disabledEndDate = (endValue) => {
    const startValue = startDate;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  const onStartChange = (value) => {
    changeField('startDate', value);
  };

  const onEndChange = (value) => {
    changeField('endDate', value);
  };

  const changeField = (fieldName, fieldValue) => {
    dispatch({
      type: 'docList/changeField',
      payload: {
        fieldName,
        fieldValue,
      },
    });
  };

  const resetSeach = () => {
    dispatch({
      type: 'docList/resetSeach',
    });
  };

  const seach = () => {
    dispatch({
      type: 'docList/seach',
    });
  };

  return (
    <MainLayout
      noHeaderTitle
      headerHeight="70px"
      noFooter
      loading={loading}
    >
      <div className="container" style={{ height: '100%' }}>
        <div className={styles.sidebar_panel}>
          <div className={styles.sidebar}>
            <div className={styles.menu}>
              <div className={styles.menu_title}>文档</div>
              <div className={waitForMeCls} onClick={() => { changeType(Constants.DocType.WAITFORME); }} >
                <div>待我签署</div>
                <div>{waitForMeCount}</div>
              </div>
              <div className={waitForOthersCls} onClick={() => { changeType(Constants.DocType.WAITFOROTHERS); }} >
                <div>待他人签署</div>
                <div>{waitForOthersCount}</div>
              </div>
              <div className={finishedCls} onClick={() => { changeType(Constants.DocType.FINISHED); }} >
                <div>已完成</div>
                <div>{finishedCount}</div>
              </div>
              <div className={draftCls} onClick={() => { changeType(Constants.DocType.DRAFT); }} >
                <div>草稿箱</div>
                <div>{draftCount}</div>
              </div>
              <div className={closedCls} onClick={() => { changeType(Constants.DocType.CLOSED); }} >
                <div>已关闭</div>
                <div>{closedCount}</div>
              </div>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.seachbar}>
              <InputWithLabelInLine
                labelName="文档名称"
                placeholder="请输入文档名称"
                {...getFieldProps('docName')}
              />
              <InputWithLabelInLine
                labelName="发件人"
                placeholder="手机号/邮箱"
                {...getFieldProps('sender')}
              />
              <InputWithLabelInLine
                labelName="收件人"
                placeholder="手机号/邮箱"
                {...getFieldProps('receiver')}
              />
              <InputWithLabelInLine
                hideInput
                labelName="发送时间"
              >
                <div>
                  <DatePicker
                    format="YYYY-MM-DD"
                    disabledDate={disabledStartDate}
                    placeholder="开始时间"
                    onChange={onStartChange}
                    value={startDate}
                  />
                  <span style={{ marginLeft: '5px', marginRight: '5px' }}>至</span>
                  <DatePicker
                    format="YYYY-MM-DD"
                    disabledDate={disabledEndDate}
                    placeholder="结束时间"
                    onChange={onEndChange}
                    value={endDate}
                  />
                </div>
              </InputWithLabelInLine>
              <div className={styles.btn_group}>
                <button className="btn default" onClick={resetSeach}>清空</button>
                <button className="btn primary" onClick={seach}>查询</button>
              </div>
            </div>
            <div className={styles.table}>
              {children}
            </div>
          </div>
        </div>
      </div>
      <Modal
        id="signlog" onCancel={cancel} width={500} wrapClassName="signlog"
        visible={optlogsModVisible} footer={null}
      >
        <Timeline>
          {Object.keys(optlogs).map((index) => {
            const log = optlogs[index];
            return (
              log.createDate ?
                <Timeline.Item color="green" key={index}>
                  <p className={styles.signlog_title}>{log.name}({convertOpt(log.opt)})</p>
                  <p className={styles.signlog_desc}>操作时间: {log.createDate}</p>
                </Timeline.Item> :
                <Timeline.Item key={index}>
                  <p className={styles.signlog_title}>{log.name}({convertOpt(log.opt)})</p>
                </Timeline.Item>
            );
          })}
        </Timeline>
      </Modal>
      <Modal
        id="receiverList" onCancel={cancelReceiverList} width={500} wrapClassName="receiverList"
        visible={receiversModVisible} footer={null} title="收件人列表"
      >
        <Table columns={receiverListColumns} dataSource={receiverList} pagination={false} />
      </Modal>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.docList, loading: state.loading.global };
}

const formOpts = {
  mapPropsToFields(props) {
    return props;
  },
  onFieldsChange(props, changedFields) {
    const { dispatch } = props;
    const fields = {};
    for (const value of Object.values(changedFields)) {
      fields[value.name] = { value: value.value };
      fields[value.name].errors = value.errors;
    }
    dispatch({
      type: 'docList/fieldsChange',
      fields,
    });
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(DocList));
