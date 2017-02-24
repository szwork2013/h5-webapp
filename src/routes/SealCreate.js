import React from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import classnames from 'classnames';
import MainLayout from '../components/Layout/MainLayout';
import styles from './mixins.less';
import defaultStar from '../assets/round.png';
import defaultOval from '../assets/oval.png';

function SealCreate(props) {
  const { dispatch, sealType, colorType, previewImgUrl } = props;
  let previewImgSrc;
  if (previewImgUrl.value === '') {
    if (sealType.value === 'star') {
      previewImgSrc = defaultStar;
    } else {
      previewImgSrc = defaultOval;
    }
  } else {
    previewImgSrc = previewImgUrl.value;
  }
  const sealTypeStarCls = classnames({
    [styles.seal_type_item]: true,
    [styles.select]: sealType.value === 'star',
  });
  const sealTypeOvalCls = classnames({
    [styles.seal_type_item]: true,
    [styles.select]: sealType.value === 'oval',
  });
  const colorTypeRedCls = classnames({
    [styles.seal_color_item_red]: true,
    [styles.select]: colorType.value === '1',
  });
  const colorTypeBlueCls = classnames({
    [styles.seal_color_item_blue]: true,
    [styles.select]: colorType.value === '2',
  });
  const colorTypeBlackCls = classnames({
    [styles.seal_color_item_black]: true,
    [styles.select]: colorType.value === '3',
  });
  const changeSealType = (e, type) => {
    e.stopPropagation();
    const fields = {};
    fields.sealType = { value: type };
    dispatch({
      type: 'sealCreate/fieldsChange',
      fields,
    });
  };
  const changeColorType = (e, type) => {
    e.stopPropagation();
    const fields = {};
    fields.colorType = { value: type };
    dispatch({
      type: 'sealCreate/fieldsChange',
      fields,
    });
  };
  return (
    <MainLayout
      headerName="创建模板印章"
    >
      <div className={`container ${styles.seal_create}`}>
        <div>
          <div className={styles.seal_create_label}>您的印章</div>
          <div className={styles.seal_preview}>
            <img role="presentation" src={previewImgSrc} />
          </div>
        </div>
        <div>
          <div className={styles.seal_create_label} style={{ marginLeft: '30px' }}>选择模板样式</div>
          <div className={styles.seal_customize}>
            <div className={styles.seal_type}>
              <div className={sealTypeStarCls} onClick={(e) => { changeSealType(e, 'star'); }}>
                <div className={styles.seal_type_item_star} />
              </div>
              <div className={sealTypeOvalCls} onClick={(e) => { changeSealType(e, 'oval'); }}>
                <div className={styles.seal_type_item_oval} />
              </div>
            </div>
            <div>
              <div className={styles.seal_create_label} style={{ marginLeft: '30px', marginTop: '10px' }}>选择颜色</div>
              <div className={styles.seal_color}>
                <span className={colorTypeRedCls} onClick={(e) => { changeColorType(e, '1'); }} />
                <span className={colorTypeBlueCls} onClick={(e) => { changeColorType(e, '2'); }} />
                <span className={colorTypeBlackCls} onClick={(e) => { changeColorType(e, '3'); }} />
              </div>
            </div>
            <div>
              <div className={styles.seal_create_label} style={{ marginLeft: '30px', marginTop: '10px' }}>横向文</div>
              <div className={styles.seal_crosswise}>
                <input className="input" placeholder="选填，支持0-8个字符" />
              </div>
            </div>
            <div>
              <div className={styles.seal_create_label} style={{ marginLeft: '30px', marginTop: '10px' }}>下弦文</div>
              <div className={styles.seal_gibbous}>
                <input className="input" placeholder="选填，支持0-15个字符" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.seal_btn_group}>
        <button className="btn default" >预览</button>
        <button className="btn primary" >完成</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.sealCreate };
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
      type: 'sealCreate/fieldsChange',
      fields,
    });
  },
};

export default connect(mapStateToProps)(createForm(formOpts)(SealCreate));
