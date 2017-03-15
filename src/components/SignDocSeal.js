import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { createDragPreview } from 'react-dnd-text-dragpreview';
import { generateConfigID } from '../utils/signTools';
import styles from './SignDocSeal.less';
// import { timeout } from '../utils/commonUtils';

const sealSource = {
  beginDrag(props) {
    // monitor.getItem()时返回的对象
    const { name, id, sealId, sealType, sealWay, seal, left, top, width, height } = props;
    return { name, id, sealId, sealType, sealWay, seal, left, top, width, height };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const { name, sealId, sealType, sealWay, seal, width, height } = item;
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      // console.log('drop done');
      // const delta = monitor.getDifferenceFromInitialOffset();
      // const left = Math.round(!item.left ? monitor.getInitialSourceClientOffset().x : item.left + delta.x);
      // const top = Math.round(!item.top ? monitor.getInitialSourceClientOffset().y : item.top + delta.y);
      // TODO
      // console.log('monitor: ', monitor);
      // console.log('item left: ', left);
      // console.log('item top: ', top);
      // console.log('pageX: ', event.pageX);
      // console.log('pageY: ', event.pageY);
      const scrollLeft = document.getElementById('docPanel').scrollLeft;
      const scrollTop = document.getElementById('docPanel').scrollTop;
      // console.log('docPanel scrollX: ', scrollLeft);
      // console.log('docPanel scrollY: ', scrollTop);
      if (!props.added) {
        props.dispatch({
          type: 'signDoc/addSeal',
          payload: {
            seal: { [generateConfigID()]: { top: event.pageY + scrollTop + -136, left: event.pageX + scrollLeft + -136, width, height, name, sealId, sealType, seal, sealWay, added: true } },
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
    // added: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      showDelete: false,
      dragPreviewStyle: {
        width: '140px',
        height: '140px',
        backgroundImage: props.seal,
        backgroundColor: '#454545',
        borderColor: 'transparent',
        color: 'white',
        fontSize: 12,
        paddingTop: 90,
        paddingRight: 40,
        paddingBottom: 60,
        paddingLeft: 40,
      },
    };
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.deleteSeal = this.deleteSeal.bind(this);
  }

  componentDidMount = () => {
    // this.dragPreview = createDragPreview('拖动到指定位置', this.state.dragPreviewStyle);
    // this.props.connectDragPreview(this.dragPreview);
    // const div = document.createElement('div');
    // div.style.width = '140px';
    // div.style.height = '140px';
    // div.style.backgroundImage = this.props.seal;
    // if (this.props.seal) {
    //   div.onload = () => this.props.connectDragPreview(div);
    // }
    // 渲染完成 获取当前dom对象，然后绑定事件
    // const thisComponent = this.sealRef;
    // thisComponent.onmouseover = e => this.onMouseOver(e, thisComponent);
    // thisComponent.onmouseout = e => this.onMouseOut(e, thisComponent);
  };

  // componentDidUpdate() {
  //   this.dragPreview = createDragPreview('拖动到指定位置', this.state.dragPreviewStyle, this.dragPreview);
  // }

  // 下面两个函数从网上copy的，目的：父元素进入子元素时，onMouseOut不执行，子元素进入父元素时，onMouseOver不执行
  // 不然父元素进入子元素时会触发onMouseOut
  onMouseOver = (e) => {
    e = window.event || e;
    const s = e.relatedTarget;
    if (document.all) {
      if (!e.target.contains(s)) {
        this.setState({ showDelete: true });
      }
    } else {
      const reg = e.target.compareDocumentPosition(s);
      if (!(reg === 20 || reg === 0)) {
        this.setState({ showDelete: true });
      }
    }
  };

  onMouseOut = (e) => {
    e = window.event || e;
    const s = e.relatedTarget;
    if (document.all) {
      if (!e.target.contains(s)) {
        this.setState({ showDelete: false });
      }
    } else {
      const reg = e.target.compareDocumentPosition(s);
      if (!(reg === 20 || reg === 0)) {
        this.setState({ showDelete: false });
      }
    }
  };

  deleteSeal = (id, dispatch) => {
    dispatch({
      type: 'signDoc/deleteSeal',
      payload: {
        key: id,
      },
    });
  };

  render() {
    const { isDragging, hideSourceOnDrag, connectDragSource, key, id, name, connectDragPreview, sealId, sealType, sealWay, left, top, seal, isDefault, dispatch, closable } = this.props;

    // const img = new Image();
    // // img.width = 140;
    // // img.height = 140;
    // img.src = seal;
    // if (seal) {
    //   img.onload = () => connectDragPreview(img);
    // }
    const dragPreview = createDragPreview('拖动到指定位置', this.state.dragPreviewStyle);
    connectDragPreview(dragPreview);
    let style;
    if (isDefault) {
      style = {
        width: '140px',
        height: '140px',
        display: 'flex',
        justifyContent: 'flex-end',
      };
    } else {
      style = {
        position: 'absolute',
        width: '140px',
        height: '140px',
        display: 'flex',
        justifyContent: 'flex-end',
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
          <div
            ref={(c) => { this.sealRef = c; }} draggable={false} key={key} data-sealId={sealId} data-sealType={sealType} data-sealWay={sealWay}
            id={id} name={name} role="presentation" src={seal} style={{ ...style, left, top, backgroundImage: `url(${seal})`, backgroundRepeat: 'round' }}
            onMouseOver={e => this.onMouseOver(e)} onMouseOut={e => this.onMouseOut(e)}
          >
            { this.state.showDelete ?
              <span id={`deleteIcon_${id}`} className={styles.delete_icon} style={{ marginRight: '-8px', marginTop: '-8px' }} onClick={() => this.deleteSeal(id, dispatch)} /> :
              null
            }
          </div>
        :
          <div
            ref={(c) => { this.sealRef = c; }} draggable={false} key={key} data-sealId={sealId} data-sealType={sealType} data-sealWay={sealWay}
            id={id} name={name} role="presentation" src={seal} style={{ ...style, left, top, backgroundImage: `url(${seal})`, backgroundRepeat: 'round' }}
          />
      )
    );
  }
}

export default new DragSource('signDoc', sealSource, collect)(SignDocSeal);
