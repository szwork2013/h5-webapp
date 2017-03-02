import React from 'react';
import logo from '../../assets/tsign-logo.png';

const Header = (props) => {
  const { name, headerHeight, noHeaderTitle, ...otherProps } = props;
  return (
    <header className="header" {...otherProps}>
      <div className="container flex-yaxis-center" style={{ height: headerHeight }}>
        <img role="presentation" src={logo} />
        { noHeaderTitle ?
          null :
          <div className="header-title">{name}</div>
        }
      </div>
    </header>
  );
};

Header.propTypes = {
  name: React.PropTypes.string,
};

export default Header;
