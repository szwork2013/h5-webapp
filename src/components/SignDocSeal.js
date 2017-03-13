import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { generateConfigID } from '../utils/signTools';
import styles from './SignDocSeal.less';
import { timeout } from '../utils/commonUtils';

const sealSource = {
  beginDrag(props) {
    // monitor.getItem()时返回的对象
    const { name, id, sealId, sealType, sealWay, seal, left, top } = props;
    return { name, id, sealId, sealType, sealWay, seal, left, top };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const { name, sealId, sealType, sealWay, seal, left, top } = item;
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      console.log('drop done');
      // const delta = monitor.getDifferenceFromInitialOffset();
      // const left = Math.round(!item.left ? monitor.getInitialSourceClientOffset().x : item.left + delta.x);
      // const top = Math.round(!item.top ? monitor.getInitialSourceClientOffset().y : item.top + delta.y);
      // TODO
      console.log('monitor: ', monitor);
      console.log('item left: ', left);
      console.log('item top: ', top);
      console.log('pageX: ', event.pageX);
      console.log('pageY: ', event.pageY);
      const scrollLeft = document.getElementById('docPanel').scrollLeft;
      const scrollTop = document.getElementById('docPanel').scrollTop
      console.log('docPanel scrollX: ', scrollLeft);
      console.log('docPanel scrollY: ', scrollTop);
      if (!props.added) {
        props.dispatch({
          type: 'signDoc/addSeal',
          payload: {
            seal: { [generateConfigID()]: { top: event.pageY + scrollTop + -136, left: event.pageX + scrollLeft + -136, name, sealId, sealType, seal, sealWay, added: true } },
          },
        });
      }
    }
  },
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
  monitor,
});

class SignDocSeal extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    hideSourceOnDrag: PropTypes.bool.isRequired,
    name: PropTypes.string,
    seal: PropTypes.any,
    key: PropTypes.any,
    id: PropTypes.any,
    dispatch: PropTypes.func,
    added: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      showDelete: false,
    };
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.deleteSeal = this.deleteSeal.bind(this);
  }

  componentDidMount = () => {
    // 渲染完成 获取当前dom对象，然后绑定事件
    // const thisComponent = this.sealRef;
    // thisComponent.onmouseover = e => this.onMouseOver(e, thisComponent);
    // thisComponent.onmouseout = e => this.onMouseOut(e, thisComponent);
  };

  // 下面两个函数从网上copy的，目的：父元素进入子元素时，onMouseOut不执行，子元素进入父元素时，onMouseOver不执行
  // 不然父元素进入子元素时会触发onMouseOut
  onMouseOver = (e, thisComponent) => {
    // e = window.event || e;
    // const s = e.fromElement || e.relatedTarget;
    // if (document.all) {
    //   if (!thisComponent.contains(s)) {
    //     this.setState({ showDelete: true });
    //   }
    // } else {
    //   const reg = thisComponent.compareDocumentPosition(s);
    //   if (!(reg === 20 || reg === 0)) {
    //     this.setState({ showDelete: true });
    //   }
    // }
    this.setState({ showDelete: true });
  };

  onMouseOut = (e, thisComponent) => {
    // e = window.event || e;
    // const s = e.toElement || e.relatedTarget;
    // if (document.all) {
    //   if (!thisComponent.contains(s)) {
    //     this.setState({ showDelete: false });
    //   }
    // } else {
    //   const reg = thisComponent.compareDocumentPosition(s);
    //   if (!(reg === 20 || reg === 0)) {
    //     this.setState({ showDelete: false });
    //   }
    // }
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
    promise.then(() => {
      this.setState({ showDelete: false });
    });
  };

  deleteSeal = (id, dispatch) => {
    console.log('show delete icon: ', id);
    dispatch({
      type: 'signDoc/deleteSeal',
      payload: {
        key: id,
      },
    });
  };

  render() {
    const { monitor, isDragging, hideSourceOnDrag, connectDragSource, connectDragPreview, key, id, name, sealId, sealType, sealWay, left, top, seal, isDefault, added, dispatch, closable } = this.props;

    const img = new Image();
    img.src = seal;
    img.onload = () => connectDragPreview(img);
    let style;
    if (isDefault) {
      style = {
        width: '140px',
      };
    } else {
      style = {
        position: 'absolute',
        width: '140px',
      };
    }

    if (isDragging && hideSourceOnDrag) {
      return null;
    }

    return (
      connectDragSource(
        closable ?
          // <div ref={(c) => { this.sealRef = c; }} key={key} >
          //   <img
          //     draggable={false} key={key} data-sealId={sealId} data-sealType={sealType} data-sealWay={sealWay}
          //     id={id} name={name} role="presentation" src={seal} style={{ ...style, left, top }}
          //     onMouseOver={() => this.onMouseOver()} onMouseOut={() => this.onMouseOut()}
          //   />
          //   { this.state.showDelete ?
          //     <span className={styles.delete_icon} style={{ left: left - 20, top: top - 20 }} onClick={() => this.deleteSeal(id, dispatch)} /> :
          //     null
          //   }
          // </div>
          <img
            ref={(c) => { this.sealRef = c; }} draggable={false} key={key} data-sealId={sealId} data-sealType={sealType} data-sealWay={sealWay}
            id={id} name={name} role="presentation" src={seal} style={{ ...style, left, top }}
          />
        :
          <img
            ref={(c) => { this.sealRef = c; }} draggable={false} key={key} data-sealId={sealId} data-sealType={sealType} data-sealWay={sealWay}
            id={id} name={name} role="presentation" src={seal} style={{ ...style, left, top }}
          />
      )
    );
  }
}

export default new DragSource('signDoc', sealSource, collect)(SignDocSeal);
