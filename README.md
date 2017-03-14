常见问题：

1.点击事件
onClick={method}  点击时调用 无参数
onClick={() => {method(p1)}}  点击时调用 有参数
onClick={method(p1)}  组件渲染时就调用 慎用, 需要传参用第二种方式

2.同步state到storage, 避免刷新后导致的各种问题

3.upload控件中修改rc-upload/lib/request.js，加入lrz上传时压缩图片：
require('lrz');
function upload(option) {
  lrz(option.file).then(function(rst) {
    var xhr = new XMLHttpRequest();

    if (option.onProgress && xhr.upload) {
      xhr.upload.onprogress = function progress(e) {
        if (e.total > 0) {
          e.percent = e.loaded / e.total * 100;
        }
        option.onProgress(e);
      };
    }

    var formData = new FormData();

    if (option.data) {
      Object.keys(option.data).map(function (key) {
        formData.append(key, option.data[key]);
      });
    }

    formData.append(option.filename, rst.formData.get('file'));

    xhr.onerror = function error(e) {
      option.onError(e);
    };

    xhr.onload = function onload() {
      // allow success when 2xx status
      // see https://github.com/react-component/upload/issues/34
      if (xhr.status < 200 || xhr.status >= 300) {
        return option.onError(getError(option, xhr), getBody(xhr));
      }

      option.onSuccess(getBody(xhr));
    };

    xhr.open('post', option.action, true);

    // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
    if (option.withCredentials && 'withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    var headers = option.headers || {};

    // when set headers['X-Requested-With'] = null , can close default XHR header
    // see https://github.com/react-component/upload/issues/33
    if (headers['X-Requested-With'] !== null) {
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }

    for (var h in headers) {
      if (headers.hasOwnProperty(h) && headers[h] !== null) {
        xhr.setRequestHeader(h, headers[h]);
      }
    }
    xhr.send(formData);

    return {
      abort: function abort() {
        xhr.abort();
      }
    };
  }).catch(function(err) {
    console.log('lrz error: ', err);
  });
}
