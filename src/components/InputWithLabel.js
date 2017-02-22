import React from 'react';

class InputWithLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { labelName, style, ...otherProps } = this.props;
    return (
      <div className="input-item" style={style}>
        <div className="input-label">{labelName}</div>
        <input className="input" {...otherProps} />
      </div>
    );
  }
}

InputWithLabel.propTypes = {
  labelName: React.PropTypes.string,
  style: React.PropTypes.object,
};

export default InputWithLabel;
