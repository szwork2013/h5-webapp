import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = (props) => {
  return (
    // 如果不显示footer，则设置容器高度为100%；（显示footer时，如果设置height:100%，footer不能随滚动条滚动）
    // 不显示footer，同时设置content的padding-bottom：0
    // 不显示footer，同时设置header的position：fixed，不然出现滚动条
    <div style={props.noFooter ? { minHeight: '100%', height: '100%', position: 'relative' } : { minHeight: '100%', position: 'relative' }}>
      { !props.noHeader ?
        <Header name={props.headerName} style={props.noFooter ? { position: 'fixed' } : {}} /> :
        null
      }
      <div className="content" style={props.noFooter ? { paddingBottom: '0' } : {}}>
        {props.children}
      </div>
      { !props.noFooter ?
        <Footer /> :
        null
      }
    </div>
  );
};

MainLayout.propTypes = {
  headerName: React.PropTypes.string,
  children: React.PropTypes.node,
  noHeader: React.PropTypes.bool,
  noFooter: React.PropTypes.bool,
};

export default MainLayout;
