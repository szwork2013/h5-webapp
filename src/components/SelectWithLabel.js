import React from 'react';

class SelectWithLabel extends React.Component {
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
            <select className={error ? 'input error' : 'input'} {...otherProps} style={{ width: `${inputWidth}` }}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
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

SelectWithLabel.propTypes = {
  labelName: React.PropTypes.string,
  inputWidth: React.PropTypes.string,
  style: React.PropTypes.object,
  error: React.PropTypes.bool,
  errorMsg: React.PropTypes.string,
  children: React.PropTypes.node,
};

export default SelectWithLabel;
