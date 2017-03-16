import React from 'react';
import styles from './Upload.less';

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgData: '',
    };
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount = () => {
    const fileInput = this.fileInput;
    const fileBtn = this.fileBtn;
    fileBtn.onclick = () => this.onClick(this.props.name, fileInput);
  };

  onClick = (name, fileInputRef) => {
    fileInputRef.click();
  }

  onChange = (e, obj, name, dispatch, fieldName) => {
    const file = e.target.files[0];

    const img = new Image();
    const reader = new FileReader();
    reader.onload = (ei) => {
      img.src = ei.target.result;
    };
    reader.readAsDataURL(file);

    img.onload = () => {
      // this.filePreview.append(img);
      // 默认按比例压缩
      let w = img.width;
      let h = img.height;
      const scale = w / h;
      w = obj.width || w;
      h = obj.height || (w / scale);
      let quality = 0.7;  // 默认图片质量为0.7
      // 生成canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // 创建属性节点
      const anw = document.createAttribute('width');
      anw.nodeValue = w;
      const anh = document.createAttribute('height');
      anh.nodeValue = h;
      canvas.setAttributeNode(anw);
      canvas.setAttributeNode(anh);
      ctx.drawImage(img, 0, 0, w, h);
      // 图像质量
      if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
        quality = obj.quality;
      }
      // quality值越小，所绘制出的图像越模糊
      const base64 = canvas.toDataURL('image/jpeg', quality);
      this.setState({ imgData: base64 });

      dispatch({
        type: 'personRnInfo/uploadFileWithBase64',
        payload: {
          fileName: name,
          fileData: base64,
          fieldName,
        },
      });
    };
  }

  render() {
    const { width, height, quality, name, dispatch, fieldName } = this.props;
    const obj = {
      width,
      height,
      quality,
    };
    return (
      <div>
        <div className={styles.upload_img_preview}>
          { this.state.imgData ?
            <img role="presentation" width="210" height="132" src={this.state.imgData} /> :
            null
          }
        </div>
        <input ref={(c) => { this.fileInput = c; }} type="file" accept="image/*" id={name} name={name} style={{ display: 'none' }} onChange={e => this.onChange(e, obj, name, dispatch, fieldName)} />
        <button ref={(c) => { this.fileBtn = c; }} className="btn cutout" >本地上传</button>
      </div>
    );
  }
}

export default Upload;
