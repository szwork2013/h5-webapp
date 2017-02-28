import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

const style = {
  marginTop: '17px',
  marginLeft: 'auto',
  marginRight: 'auto',
  border: '#bdbdbd 1px solid',
  position: 'relative',
};

const boxTarget = {
  drop() {
    return { name: 'SignDocPage' };
  },
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  monitor,
});

class SignDocPage extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    page: PropTypes.object,
  };

  render() {
    const { canDrop, isOver, connectDropTarget, page, monitor } = this.props;
    console.log('isOver: ', isOver);
    console.log('target getInitialClientOffset: ', monitor.getInitialClientOffset());
    console.log('target getInitialSourceClientOffset: ', monitor.getInitialSourceClientOffset());
    console.log('target getClientOffset: ', monitor.getClientOffset());
    console.log('target getDifferenceFromInitialOffset: ', monitor.getDifferenceFromInitialOffset());
    console.log('target getSourceClientOffset: ', monitor.getSourceClientOffset());
    const isActive = canDrop && isOver;

    return connectDropTarget(
      <div style={{ ...style, ...page }} />,
    );
  }
}

export default new DropTarget('signDoc', boxTarget, collect)(SignDocPage);
