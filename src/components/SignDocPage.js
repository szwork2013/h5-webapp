import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import { DropTarget } from 'react-dnd';
import SignDocSeal from './SignDocSeal';
import sealEx1 from '../assets/seal-ex1.png';

const style = {
  marginTop: '17px',
  marginLeft: 'auto',
  marginRight: 'auto',
  border: '#bdbdbd 1px solid',
  position: 'relative',
};

const pageTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    const left = Math.round(!item.left ? monitor.getInitialSourceClientOffset().x : item.left + delta.x);
    const top = Math.round(!item.top ? monitor.getInitialSourceClientOffset().y : item.top + delta.y);

    if (props.seals[item.id]) {
      component.moveSeal(item.id, left, top);
    }
  },
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  monitor,
});

class SignDocPage extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    page: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.moveSeal = this.moveSeal.bind(this);
  }

  moveSeal(id, left, top) {
    this.props.dispatch({
      type: 'signDoc/addSeal',
      payload: {
        seal: { [id]: { top, left } },
      },
    });
  }

  render() {
    const { canDrop, isOver, connectDropTarget, page, monitor, dispatch } = this.props;
    const { seals } = this.props;

    console.log('isOver: ', isOver);
    if (isOver) {
      console.log(monitor.getItem().left);
    }
    const isActive = canDrop && isOver;

    const sealComponents = (
      <div>
        {Object.keys(seals).map((key) => {
          const { left, top, name } = seals[key];
          return (
            <SignDocSeal
              added
              dispatch={dispatch}
              hideSourceOnDrag
              key={key} id={key} name={name}
              seal={sealEx1} top={top} left={left}
            />
          );
        })}
      </div>
    );
    return connectDropTarget(
      <div style={{ ...style, ...page }}>
        {sealComponents}
      </div>
    );
  }
}

export default new DropTarget('signDoc', pageTarget, collect)(SignDocPage);
