import React from 'react';

class InputWithLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { hideInput, labelName, inputWidth, style, error, errorMsg, children, ...otherProps } = this.props;
    return (
      <div className="input-item" style={style}>
        { hideInput ?
          null :
          <div className="input-label">{labelName}</div>
        }
        { hideInput ?
          null :
          <div>
            <input autoComplete="off" className={error ? 'input error' : 'input'} {...otherProps} style={{ width: `${inputWidth}` }} />
            {children}
          </div>
        }
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
  inputWidth: React.PropTypes.string,
  style: React.PropTypes.object,
  error: React.PropTypes.bool,
  errorMsg: React.PropTypes.string,
  children: React.PropTypes.node,
};

export default InputWithLabel;
