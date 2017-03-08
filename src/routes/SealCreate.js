import React from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import classnames from 'classnames';
import MainLayout from '../components/Layout/MainLayout';
import styles from './mixins.less';
import defaultStar from '../assets/round.png';
import defaultOval from '../assets/oval.png';
import defaultHwxkborder from '../assets/hwxkf.png';
import defaultHwxk from '../assets/hwxk.png';
import defaultHwls from '../assets/hwls.png';
import defaultYgymbxs from '../assets/ygyxs.png';
import defaultYgyjfcs from '../assets/ygycs.png';

function SealCreate(props) {
  const { accountType, dispatch, loading, sealType, sealTypeForPerson, colorType, previewImgUrl, form } = props;
  const { getFieldProps } = form;
  let previewImgSrc;
  if (previewImgUrl.value === '') {
    if (accountType === 2 && sealType.value === 'star') {
      previewImgSrc = defaultStar;
    } else if (accountType === 2 && sealType.value === 'oval') {
      previewImgSrc = defaultOval;
    } else if (accountType === 1 && sealTypeForPerson.value === 'hwxkborder') {
      previewImgSrc = defaultHwxkborder;
    } else if (accountType === 1 && sealTypeForPerson.value === 'hwxk') {
      previewImgSrc = defaultHwxk;
    } else if (accountType === 1 && sealTypeForPerson.value === 'hwls') {
      previewImgSrc = defaultHwls;
    } else if (accountType === 1 && sealTypeForPerson.value === 'ygymbxs') {
      previewImgSrc = defaultYgymbxs;
    } else if (accountType === 1 && sealTypeForPerson.value === 'ygyjfcs') {
      previewImgSrc = defaultYgyjfcs;
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
  const sealTypeHwxkborderCls = classnames({
    [styles.seal_type_item_person]: true,
    [styles.select]: sealType.value === 'hwxkborder',
  });
  const sealTypeHwxkCls = classnames({
    [styles.seal_type_item_person]: true,
    [styles.select]: sealType.value === 'hwxk',
  });
  const sealTypeHwlsCls = classnames({
    [styles.seal_type_item_person]: true,
    [styles.select]: sealType.value === 'hwls',
    [styles.seal_type_item_top]: true,
  });
  const sealTypeYgymbxsCls = classnames({
    [styles.seal_type_item_person]: true,
    [styles.select]: sealType.value === 'ygymbxs',
    [styles.seal_type_item_top]: true,
  });
  const sealTypeYgyjfcsCls = classnames({
    [styles.seal_type_item_person]: true,
    [styles.select]: sealType.value === 'ygyjfcs',
    [styles.seal_type_item_top]: true,
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
    dispatch({
      type: 'sealCreate/clearPreviewImgUrl',
    });
  };
  const changeSealTypeForPerson = (e, type) => {
    e.stopPropagation();
    const fields = {};
    fields.sealTypeForPerson = { value: type };
    dispatch({
      type: 'sealCreate/fieldsChange',
      fields,
    });
    dispatch({
      type: 'sealCreate/clearPreviewImgUrl',
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
  const preview = () => {
    dispatch({
      type: 'sealCreate/preview',
    });
  };
  const addSeal = () => {
    dispatch({
      type: 'sealCreate/addSeal',
    });
  };
  return (
    <MainLayout
      headerName="创建模板印章"
      loading={loading}
    >
      <div className={`container ${styles.seal_create}`}>
        <div>
          <div className={styles.seal_create_label}>您的印章</div>
          { accountType === 2 ?
            <div className={styles.seal_preview}>
              <img role="presentation" src={previewImgSrc} />
            </div> :
            <div className={styles.seal_preview_person}>
              <img role="presentation" src={previewImgSrc} />
            </div>
          }
        </div>
        <div>
          <div className={styles.seal_create_label} style={{ marginLeft: '30px' }}>选择模板样式</div>
          <div className={styles.seal_customize}>
            { accountType === 2 ?
              <div className={styles.seal_type}>
                <div className={sealTypeStarCls} onClick={(e) => { changeSealType(e, 'star'); }}>
                  <div className={styles.seal_type_item_star} />
                </div>
                <div className={sealTypeOvalCls} onClick={(e) => { changeSealType(e, 'oval'); }}>
                  <div className={styles.seal_type_item_oval} />
                </div>
              </div> :
              <div className={styles.seal_type_person}>
                <div className={sealTypeHwxkborderCls} onClick={(e) => { changeSealTypeForPerson(e, 'hwxkborder'); }}>
                  <div className={styles.seal_type_item_hwxkborder} />
                </div>
                <div className={sealTypeHwxkCls} onClick={(e) => { changeSealTypeForPerson(e, 'hwxk'); }}>
                  <div className={styles.seal_type_item_hwxk} />
                </div>
                <div className={sealTypeHwlsCls} onClick={(e) => { changeSealTypeForPerson(e, 'hwls'); }}>
                  <div className={styles.seal_type_item_hwls} />
                </div>
                <div className={sealTypeYgymbxsCls} onClick={(e) => { changeSealTypeForPerson(e, 'ygymbxs'); }}>
                  <div className={styles.seal_type_item_ygymbxs} />
                </div>
                <div className={sealTypeYgyjfcsCls} onClick={(e) => { changeSealTypeForPerson(e, 'ygyjfcs'); }}>
                  <div className={styles.seal_type_item_ygyjfcs} />
                </div>
              </div>
            }
            <div>
              <div className={styles.seal_create_label} style={{ marginLeft: '30px', marginTop: '10px' }}>选择颜色</div>
              <div className={styles.seal_color}>
                <span className={colorTypeRedCls} onClick={(e) => { changeColorType(e, '1'); }} />
                <span className={colorTypeBlueCls} onClick={(e) => { changeColorType(e, '2'); }} />
                <span className={colorTypeBlackCls} onClick={(e) => { changeColorType(e, '3'); }} />
              </div>
            </div>
            { accountType === 2 ?
              <div>
                <div className={styles.seal_create_label} style={{ marginLeft: '30px', marginTop: '10px' }}>横向文</div>
                <div className={styles.seal_crosswise}>
                  <input className="input" placeholder="选填，支持0-8个字符" {...getFieldProps('typeName')} />
                </div>
              </div> :
              null
            }
            { accountType === 2 ?
              <div>
                <div className={styles.seal_create_label} style={{ marginLeft: '30px', marginTop: '10px' }}>下弦文</div>
                <div className={styles.seal_gibbous}>
                  <input className="input" placeholder="选填，支持0-15个字符" {...getFieldProps('rune')} />
                </div>
              </div> :
              null
            }
          </div>
        </div>
      </div>
      <div className={styles.seal_btn_group}>
        <button className="btn default" onClick={preview} >预览</button>
        <button className="btn primary" onClick={addSeal} >完成</button>
      </div>
    </MainLayout>
  );
}

function mapStateToProps(state) {
  return { ...state.sealCreate, accountType: state.global.type, loading: state.loading.global };
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
