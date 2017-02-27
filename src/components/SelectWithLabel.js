import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class SelectWithLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { hideInput, options, labelName, inputWidth, style, error, errorMsg, children, ...otherProps } = this.props;
    const select = (
      <Select size="large" className={error ? 'select error' : 'select'} style={{ width: `${inputWidth}` }} {...otherProps} >
        {options.map((option) => {
          return (
            <Option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </Option>
          );
        })}
      </Select>
      );
    return (
      <div className="input-item" style={style}>
        { hideInput ?
          null :
          <div className="input-label">{labelName}</div>
        }
        { hideInput ?
          null :
          <div>
            {select}
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
  options: React.PropTypes.array,
};

export default SelectWithLabel;
