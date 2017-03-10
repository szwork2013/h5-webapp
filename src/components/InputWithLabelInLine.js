import React from 'react';

class InputWithLabelInLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { hideInput, labelName, inputWidth, style, error, children, ...otherProps } = this.props;
    return (
      <div className="input-item-inline" style={style}>
        <div className="input-label-inline">{labelName}</div>
        <div className="input-div">
          { hideInput ?
            null :
            <input autoComplete="off" className={error ? 'input error' : 'input'} {...otherProps} style={{ width: `${inputWidth}` }} />
          }
          {children}
        </div>
      </div>
    );
  }
}

InputWithLabelInLine.propTypes = {
  labelName: React.PropTypes.string,
  inputWidth: React.PropTypes.string,
  style: React.PropTypes.object,
  error: React.PropTypes.bool,
  children: React.PropTypes.node,
};

export default InputWithLabelInLine;
