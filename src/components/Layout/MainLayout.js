import React from 'react';
import { Spin } from 'antd';
import Header from './Header';
import Footer from './Footer';

const MainLayout = (props) => {
  return (
    // 如果不显示footer，则设置容器高度为100%；（显示footer时，如果设置height:100%，footer不能随滚动条滚动）
    // 不显示footer，同时设置content的padding-bottom：0
    // 不显示footer，同时设置header的position：fixed，不然出现滚动条
    <Spin
      size="large"
      spinning={props.loading}
      tip={props.loadingTip}
    >
      <div style={props.noFooter ? { minHeight: '100%', height: '100%', position: 'relative' } : { minHeight: '100%', position: 'relative' }}>
        { !props.noHeader ?
          <Header headerHeight={props.headerHeight} noHeaderTitle={props.noHeaderTitle} name={props.headerName} style={props.noFooter ? { position: 'fixed', height: props.headerHeight } : { height: props.headerHeight }} /> :
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
    </Spin>
  );
};

MainLayout.propTypes = {
  headerName: React.PropTypes.string,
  children: React.PropTypes.node,
  noHeader: React.PropTypes.bool,
  noFooter: React.PropTypes.bool,
  loading: React.PropTypes.bool,
  loadingTip: React.PropTypes.string,
};

export default MainLayout;
