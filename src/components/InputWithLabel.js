import React from 'react';

class InputWithLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { labelName, style, error, errorMsg, ...otherProps } = this.props;
    return (
      <div className="input-item" style={style}>
        <div className="input-label">{labelName}</div>
        <input className={error ? 'input error' : 'input'} {...otherProps} />
        {error ?
          <div className="input-error">{errorMsg}</div> :
          null
        }
      </div>
    );
  }
}

InputWithLabel.propTypes = {
  labelName: React.PropTypes.string,
  style: React.PropTypes.object,
  error: React.PropTypes.bool,
  errorMsg: React.PropTypes.string,
};

export default InputWithLabel;
