import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import MainLayout from '../components/Layout/MainLayout';
import SealItem from '../components/SealItem';
import styles from './mixins.less';
import add from '../assets/ico-add.png';

function SealManage(props) {
  const { dispatch, loading, sealList } = props;
  const createSeal = () => {
    dispatch(routerRedux.push('/sealCreate'));
  };
  return (
    <MainLayout
      headerName="印章管理"
      loading={loading}
    >
      <div className={`container ${styles.sealList}`}>
        <SealItem onClick={createSeal}>
          <div>
            <img style={{ width: '50px' }} role="presentation" src={add} />
            <div style={{ marginTop: '10px' }}>创建模板印章</div>
          </div>
        </SealItem>
        <SealItem>
          <div>
            <img style={{ width: '50px' }} role="presentation" src={add} />
            <div style={{ marginTop: '10px' }}>上传图片印章</div>
          </div>
        </SealItem>
        {Object.values(sealList).map((seal) => {
          return (
            <SealItem key={seal.id} isDefault={seal.isDefault}>
              <img role="presentation" src={seal.url} />
            </SealItem>
          );
        })}
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { sealList: state.global.seals, ...state.personRnInfo, loading: state.loading.global };
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
      type: 'personRnInfo/fieldsChange',
      fields,
    });
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(SealManage));
