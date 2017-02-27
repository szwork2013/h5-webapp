import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

const boxSource = {
  beginDrag(props) {
    return {
      name: props.name,
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      window.alert( // eslint-disable-line no-alert
        `You dropped ${item.name} into ${dropResult.name}!`,
      );
    }
  },
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

class SignDocSeal extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    seal: PropTypes.any,
  };

  render() {
    const { isDragging, connectDragSource, name, seal } = this.props;

    return (
      connectDragSource(
        <img draggable={false} role="presentation" src={seal} />
      )
    );
  }
}

export default new DragSource('signDoc', boxSource, collect)(SignDocSeal);
