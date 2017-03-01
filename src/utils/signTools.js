const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
        'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
        'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// 生成八位configID
const generateConfigID = () => {
  let res = '';
  for (let i = 0; i < 8; i += 1) {
    const id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }
  return res;
};

// 将地址栏中的参数转成json对象    假设地址栏的值是http://www.baidu.com?a=MQ%3D%3D&b=6LW1    输出{a:"1",b:'赵'}
const getCurrentUrlParams = () => {
  const params = {};
  let hash;
  if (window.location.href.indexOf('?') !== -1 && window.location.href.slice(window.location.href.indexOf('?') + 1)) {
    const hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i += 1) {
      hash = hashes[i].split('=');
      const value = decodeURIComponent(hash[1]);
      params[hash[0]] = value;
    }
  }
  return params;
};

export { generateConfigID, getCurrentUrlParams };
