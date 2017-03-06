import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { generateConfigID } from '../utils/signTools';

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

  render() {
    const { monitor, isDragging, hideSourceOnDrag, connectDragSource, connectDragPreview, key, id, name, sealId, sealType, sealWay, left, top, seal, isDefault, added, dispatch } = this.props;

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
        <img
          draggable={false} key={key} data-sealId={sealId} data-sealType={sealType} data-sealWay={sealWay}
          id={id} name={name} role="presentation" src={seal} style={{ ...style, left, top }}
        />
      )
    );
  }
}

export default new DragSource('signDoc', sealSource, collect)(SignDocSeal);
