import React from 'react';
import logo from '../../assets/tsign-logo.png';

const Header = (props) => {
  const { name, ...otherProps } = props;
  return (
    <header className="header" {...otherProps}>
      <div className="container flex-yaxis-center">
        <img role="presentation" src={logo} />
        <div className="header-title">{name}</div>
      </div>
    </header>
  );
};

Header.propTypes = {
  name: React.PropTypes.string,
};

export default Header;
