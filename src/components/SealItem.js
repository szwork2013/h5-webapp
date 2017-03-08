import React from 'react';
import classnames from 'classnames';
import styles from './SealItem.less';

class SealItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { isDefault, style, children, ...otherProps } = this.props;

    const itemInnerCls = classnames({
      [styles.seal_item_inner]: true,
      [styles.seal_item_default]: isDefault === 1,
    });

    return (
      <div className={styles.seal_item} style={style}>
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
