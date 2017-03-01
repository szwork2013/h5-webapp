import request from '../utils/request';


export async function getAccountInfo() {
  return request('../../service/account/info', {
    method: 'GET',
    credentials: 'same-origin',
  });
}

export async function getSealImgUrl(values) {
  return request('../../service/oss/getUrl', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function updateAccountInfo(values) {
  return request('../../service/account/updateAccountInfo', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


export async function updateAccountSafeInfo(values) {
  return request('../service/ic/account/updateSafeInfo', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function personAuthApply(values) {
  return request('../../service/realname/authApply', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function personAuthAuth(values) {
  return request('../../service/realname/authAuth', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function organInfoAuth(values) {
  return request('../../service/realname/organInfoAuth', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function organToPay(values) {
  return request('../../service/realname/organToPay', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function organPayAuth(values) {
  return request('../../service/realname/organPayAuth', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  return request('../../service/file/uploadFile', {
    method: 'POST',
    credentials: 'same-origin',
    body: formData,
  });
}

export async function validatePwd(values) {
  const postData = `signPwd=${values.signPwd}&edit=${new Date().getTime()}`;
  return request('../../user/account!validatePwd.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function pdfSign(values) {
  const postData = `signdocId=${values.signdocId}&signInfo=${values.signInfo}&password=${values.password}&signType=${values.signType}&posType=${values.posType}&edit=${new Date().getTime()}`;
  return request('../../user/sign!pdfSign.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function getDocPic(values) {
  const postData = `pageNum=${values.pageNum}&signdocId=${values.docId}&edit=${new Date().getTime()}`;
  return request('../../user/sign!getDocPic.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function pdfSignSingle(values) {
  return request('../../service/sign/pdfSign', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
