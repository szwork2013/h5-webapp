import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = (props) => {
  return (
    <div>
      <Header name={props.headerName} />
      <div className="content">
        {props.children}
      </div>
      <Footer />
    </div>
  );
};

MainLayout.propTypes = {
  headerName: React.PropTypes.string,
  children: React.PropTypes.node,
};

export default MainLayout;
