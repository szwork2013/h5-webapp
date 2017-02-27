import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

const boxTarget = {
  drop() {
    return { name: 'SignDocPage' };
  },
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
});

class SignDocPage extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    page: PropTypes.object,
  };

  render() {
    const { canDrop, isOver, connectDropTarget, page } = this.props;
    const isActive = canDrop && isOver;

    return connectDropTarget(
      <div style={page} />,
    );
  }
}

export default new DropTarget('signDoc', boxTarget, collect)(SignDocPage);
