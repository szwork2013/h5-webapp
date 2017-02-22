import React from 'react';

const InputWithLabel = (props) => {
  const { labelName, style, ...otherProps } = props;
  console.log(otherProps);
  return (
    <div className="input-item" style={style}>
      <div className="input-label">{labelName}</div>
      <input className="input" {...otherProps} />
    </div>
  );
};

InputWithLabel.propTypes = {
  labelName: React.PropTypes.string,
  style: React.PropTypes.object,
};

export default InputWithLabel;
