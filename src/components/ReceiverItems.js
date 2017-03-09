import React from 'react';
import styles from './ReceiverItems.less';

const ReceiverItems = (props) => {
  const { receivers, dispatch } = props;
  return (
    <div className={styles.receiver_item_list}>
      {Object.keys(receivers).map((key) => {
        const { uuid, email, name } = receivers[key];
        return (
          <ReceiverItem key={uuid} uuid={uuid} email={email} name={name} dispatch={dispatch} />
        );
      })}
    </div>
  );
};

class ReceiverItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDelete: false,
    };
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  componentDidMount = () => {
    // 渲染完成 获取当前dom对象，然后绑定事件
    const thisComponent = this.receiverItem;
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
        this.setState({ showDelete: true });
      }
    } else {
      const reg = thisComponent.compareDocumentPosition(s);
      if (!(reg === 20 || reg === 0)) {
        this.setState({ showDelete: true });
      }
    }
  };

  onMouseOut = (e, thisComponent) => {
    e = window.event || e;
    const s = e.toElement || e.relatedTarget;
    if (document.all) {
      if (!thisComponent.contains(s)) {
        this.setState({ showDelete: false });
      }
    } else {
      const reg = thisComponent.compareDocumentPosition(s);
      if (!(reg === 20 || reg === 0)) {
        this.setState({ showDelete: false });
      }
    }
  };

  deleteItem = (uuid, dispatch) => {
    dispatch({
      type: 'signDoc/deleteReceiver',
      payload: {
        uuid,
      },
    });
  }

  render() {
    const { dispatch, uuid, email, name, style, ...otherProps } = this.props;

    return (
      <div ref={(c) => { this.receiverItem = c; }} {...otherProps} className={`${styles.receiver_item} ${styles.receiver_item_hover}`} style={style}>
        <div className={styles.receiver_email}>{email}</div>
        <div className={styles.receiver_name}>{name}</div>
        { this.state.showDelete ?
          <span className={styles.delete_icon} onClick={() => this.deleteItem(uuid, dispatch)} /> :
          null
        }
      </div>
    );
  }
}

ReceiverItem.propTypes = {
  style: React.PropTypes.object,
};

export default ReceiverItems;
