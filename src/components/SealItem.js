import React from 'react';
import classnames from 'classnames';
import styles from './SealItem.less';

class SealItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOpts: false,
    };
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  componentDidMount = () => {
    // 渲染完成 获取当前dom对象，然后绑定事件
    const thisComponent = this.sealItem;
    thisComponent.onmouseover = e => this.onMouseOver(e, thisComponent);
    thisComponent.onmouseout = e => this.onMouseOut(e, thisComponent);
  };

  // 下面两个函数从网上copy的，目的：父元素进入子元素时，onMouseOut不执行，子元素进入父元素时，onMouseOver不执行
  // 不然父元素进入子元素时会触发onMouseOut
  onMouseOver = (e, thisComponent) => {
    e = window.event || e;
    const s = e.fromElement || e.relatedTarget;
    if (document.all) {
      if (!thisComponent.contains(s)) {
        this.setState({ showOpts: true });
      }
    } else {
      const reg = thisComponent.compareDocumentPosition(s);
      if (!(reg === 20 || reg === 0)) {
        this.setState({ showOpts: true });
      }
    }
  };

  onMouseOut = (e, thisComponent) => {
    e = window.event || e;
    const s = e.toElement || e.relatedTarget;
    if (document.all) {
      if (!thisComponent.contains(s)) {
        this.setState({ showOpts: false });
      }
    } else {
      const reg = thisComponent.compareDocumentPosition(s);
      if (!(reg === 20 || reg === 0)) {
        this.setState({ showOpts: false });
      }
    }
  };

  setDefaultSeal = (sealId, dispatch) => {
    dispatch({
      type: 'sealCreate/setDefaultSeal',
      payload: {
        sealId,
      },
    });
  };

  deleteSeal = (sealId, dispatch) => {
    dispatch({
      type: 'sealCreate/deleteSeal',
      payload: {
        sealId,
      },
    });
  };

  render() {
    const { showOpts, dispatch, sealId, isDefault, style, children, ...otherProps } = this.props;

    const itemInnerCls = classnames({
      [styles.seal_item_inner]: true,
      [styles.seal_item_default]: isDefault === 1,
    });

    return (
      showOpts ?
        <div ref={(c) => { this.sealItem = c; }} className={styles.seal_item} style={style}>
          <div className={itemInnerCls} {...otherProps}>
            {children}
          </div>
          { this.state.showOpts ?
            <div className={styles.opt_btns}>
              <a className={styles.opt} onClick={() => this.deleteSeal(sealId, dispatch)}>删除</a>
              { isDefault ? null : <a className={styles.opt} onClick={() => this.setDefaultSeal(sealId, dispatch)}>设为默认</a>}
            </div> :
            null
          }
        </div> :
        <div ref={(c) => { this.sealItem = c; }} className={styles.seal_item} style={style}>
          <div className={itemInnerCls} {...otherProps}>
            {children}
          </div>
        </div>
    );
  }
}

SealItem.propTypes = {
  style: React.PropTypes.object,
  children: React.PropTypes.node,
};

export default SealItem;
