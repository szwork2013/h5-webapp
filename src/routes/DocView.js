import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import MainLayout from '../components/Layout/MainLayout';
// import SignDocPage from '../components/SignDocPage';
import styles from './mixins.less';

function DocView(props) {
  const { dispatch, page, loading, form, pageNum, curPage } = props;
  const { getFieldProps } = form;

  const back = () => {
    dispatch(routerRedux.go(-1));
  };
  // const changePage = (e) => {
  //   dispatch({
  //     type: 'signDoc/setCurPage',
  //     payload: {
  //       curPage: e.target.value,
  //     },
  //   });
  // };
  const getDocPage = () => {
    dispatch({
      type: 'signDoc/getDocInfo',
      payload: {
        docId: '',
      },
    });
  };
  const validatorPage = (rule, value, callback) => {
    if (value && /^[0-9]*$/.test(value) && value >= 1 && value <= pageNum) {
      callback();
    } else {
      callback(new Error('格式不正确'));
    }
  };
  const up = () => {
    dispatch({
      type: 'signDoc/pageUp',
    });
    dispatch({
      type: 'signDoc/getDocInfo',
      payload: {
        docId: '',
      },
    });
  };
  const down = () => {
    dispatch({
      type: 'signDoc/pageDown',
    });
    dispatch({
      type: 'signDoc/getDocInfo',
      payload: {
        docId: '',
      },
    });
  };

  const style = {
    marginTop: '17px',
    marginLeft: 'auto',
    marginRight: 'auto',
    border: '#bdbdbd 1px solid',
    position: 'relative',
  };
  return (
    <MainLayout
      headerName="文档详情"
      loading={loading}
      noFooter
    >
      <div className={styles.sign_panel}>
        <div id="docPanel" className={styles.doc}>
          <div style={{ ...style, ...page }} />
          {/* <div className={styles.page}>1</div> */}
        </div>
      </div>
      <div className={styles.sign_action}>
        <div className={styles.next_page}>
          {/* onKeyDown={e => getDocPage(e)} */}
          {curPage.value === 1 ?
            <span className={styles.page_up} /> :
            <span className={styles.page_up} onClick={() => { up(); }} />
          }
          {curPage.value === pageNum ?
            <span className={styles.page_down} /> :
            <span className={styles.page_down} onClick={() => { down(); }} />
          }
          <span>页码：</span>
          <input
            {...getFieldProps('curPage', {
              rules: [
                { required: true, message: '请输入' },
                { validator: validatorPage },
              ],
            })}
            className={styles.page_input} onBlur={e => getDocPage(e)}
          />
          <span><span className={styles.page_split}> / </span><span className={styles.page_total}>{pageNum}</span></span>
        </div>
        <button className="btn primary" onClick={back}>返回</button> :
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { sealList: state.global.validSeals, hasSignPwd: state.global.hasSignPwd, ...state.signDoc, loading: state.loading.global };
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
      type: 'signDoc/fieldsChange',
      fields,
    });
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(DocView));
