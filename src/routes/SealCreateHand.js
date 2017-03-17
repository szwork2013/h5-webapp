import React from 'react';
import { connect } from 'dva';
import MainLayout from '../components/Layout/MainLayout';
import styles from './mixins.less';

class QR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.code,
    };
  }

  componentDidMount = () => {
    if (this.state.code) {
      new QRCode(document.getElementById('qrcode'), { // eslint-disable-line no-new, no-undef
        text: `${location.href.substring(0, location.href.substring(8).indexOf('/') + 8)}/draw.html?code=${this.state.code}`,
        width: 130,
        height: 130,
      });
    } else {
      new QRCode(document.getElementById('qrcode'), { // eslint-disable-line no-new, no-undef
        text: '二维码已失效',
        width: 130,
        height: 130,
      });
    }
  };

  render() {
    return (
      <div id="qrcode" className={this.props.cls} />
    );
  }
}

const SealCreateHand = (props) => {
  const { dispatch, loading, code } = props;

  const refresh = () => {
    const promise = new Promise((resolve) => {
      dispatch({
        type: 'sealCreateHand/createSealKey',
        payload: {
          resolve,
        },
      });
    });
    promise.then(() => {
      return;
    });
  };

  return (
    <MainLayout
      headerName="创建手绘印章"
      loading={loading}
    >
      <div>
        <div style={{ marginTop: '140px' }}>
          {!code ?
            <div>
              <QR code={code} cls={styles.qrcode_disabled} />
              <div className={styles.fresh}>二维码已经失效，请点击<a onClick={() => refresh()}>刷新</a></div>
            </div> :
            <QR code={code} cls={styles.qrcode} />
          }
          <div className={styles.qr_desc}>手机扫一扫创建手绘签名</div>
        </div>
      </div>
    </MainLayout>
  );
};

function mapStateToProps(state) {
  return { ...state.sealCreateHand, loading: state.loading.global };
}

export default connect(mapStateToProps)(SealCreateHand);
