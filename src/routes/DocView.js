import React from 'react';
import { connect } from 'dva';
import styles from './mixins.less';

const { PDFJS } = require('pdfjs-dist');
PDFJS.workerSrc = require('pdfjs-dist/build/pdf.worker');

class PDF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pdf: null,
      scale: 1.2,
    };
  }
  getChildContext() {
    return {
      pdf: this.state.pdf,
      scale: this.state.scale,
    };
  }
  componentDidMount() {
    PDFJS.getDocument(this.props.src).then((pdf) => {
      console.log(pdf);
      this.setState({ pdf });
    });
  }
  render() {
    return (<div className="pdf-context">{this.props.children}</div>);
  }
}
PDF.propTypes = {
  src: React.PropTypes.string.isRequired,
};

PDF.childContextTypes = {
  pdf: React.PropTypes.object,
  scale: React.PropTypes.number,
};

class Viewer extends React.Component {
  render() {
    const { pdf } = this.context;
    const numPages = pdf ? pdf.pdfInfo.numPages : 0;
    const fingerprint = pdf ? pdf.pdfInfo.fingerprint : 'none';
    const pages = Array.from({ length: numPages }).map((v, i) => (<Page index={i + 1} key={`${fingerprint}-${i}`} />));
    return (
      <div className="pdf-viewer">
        {pages}
      </div>
    );
  }
}
Viewer.contextTypes = PDF.childContextTypes;

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'N/A',
      page: null,
      width: 0,
      height: 0,
    };
  }
  componentDidMount() {
    this._update(this.context.pdf);
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.context.pdf !== nextContext.pdf || this.state.status !== nextState.status;
  }
  componentDidUpdate(nextProps, nextState, nextContext) {
    this._update(nextContext.pdf);
  }
  _update(pdf) {
    if (pdf) {
      this._loadPage(pdf);
    } else {
      this.setState({ status: 'loading' });
    }
  }
  _loadPage(pdf) {
    if (this.state.status === 'rendering' || this.state.page != null) return;
    pdf.getPage(this.props.index).then(this._renderPage.bind(this));
    this.setState({ status: 'rendering' });
  }
  _renderPage(page) {
    console.log(page);
    const { scale } = this.context;
    const viewport = page.getViewport(scale);
    const { width, height } = viewport;
    const canvas = this.ref;
    const context = canvas.getContext('2d');
    console.log(viewport.height, viewport.width);
    canvas.width = width;
    canvas.height = height;
    page.render({
      canvasContext: context,
      viewport,
    });
    this.setState({ status: 'rendered', page, width, height });
  }
  render() {
    const { width, height, status } = this.state;
    return (
      <div className={`pdf-page ${status}`} style={{ width, height }}>
        <canvas ref={(c) => { this.ref = c; }} />
      </div>
    );
  }
}
Page.propTypes = {
  index: React.PropTypes.number.isRequired,
};
Page.contextTypes = PDF.childContextTypes;

function DocView(props) {
  const { docDetailSrc } = props;
  return (
    <PDF src={docDetailSrc}>
      <Viewer />
    </PDF>
  );
}

function mapStateToProps(state) {
  return { ...state.docView, loading: state.loading.global };
}

export default connect(mapStateToProps)(DocView);
