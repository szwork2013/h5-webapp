import React from 'react';
import styles from './SealItem.less';

class SealItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { style, children, ...otherProps } = this.props;
    return (
      <div className={styles.seal_item} style={style}>
        <div className={styles.seal_item_inner} {...otherProps}>
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
