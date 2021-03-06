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

// 草稿箱中的签署（docType=1）签署完后 需要调用此接口
export async function sendEmail(values) {
  const postData = `signdocId=${values.signdocId}&payMethod=${values.payMethod}&edit=${new Date().getTime()}`;
  return request('../../user/sign!sendEmail.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function getDocInfo(values) {
  const postData = `docId=${values.docId}&edit=${new Date().getTime()}`;
  return request('../../service/sign/getDocInfo', {
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

export async function compressSeal(values) {
  const postData = `sealWay=${values.sealWay}&isUpload=${values.isUpload}&base64=${values.base64}&templateName=${values.templateName}&color=${values.color}&typeName=${values.typeName}&rune=${values.rune}&edit=${new Date().getTime()}`;
  return request('../../user/seal!compressSeal.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function addSeal(values) {
  const postData = `sealWay=${values.sealWay}&url=${values.url}&type=${values.type}&templateName=${values.templateName}&rune=${values.rune}&typeName=${values.typeName}&isDefault=${values.isDefault}&edit=${new Date().getTime()}`;
  return request('../../user/seal!addSeal.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function deleteSeal(values) {
  const postData = `sealId=${values.sealId}&edit=${new Date().getTime()}`;
  return request('../../user/seal!deleteSeal.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function saveDefaultSeal(values) {
  const postData = `sealId=${values.sealId}&edit=${new Date().getTime()}`;
  return request('../../user/seal!saveDefaultSeal.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function getSeals() {
  const postData = `edit=${new Date().getTime()}`;
  return request('../../user/seal!getSeals.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function getDocCount() {
  const postData = `edit=${new Date().getTime()}`;
  return request('../../user/doc!getDocCount.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function getDocList2(values) {
  const postData = `type=${values.type}&startIndex=${values.startIndex}&pageSize=${values.pageSize}&docBean=${values.docBean}&edit=${new Date().getTime()}`;
  return request('../../user/doc!getDocList2.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function signLog(values) {
  const postData = `docId=${values.docId}&edit=${new Date().getTime()}`;
  return request('../../user/sign!signLog.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function updateDoc(values) {
  const postData = `docId=${values.docId}&optType=${values.optType}&url=${values.url}&reason=${values.reason}&edit=${new Date().getTime()}`;
  return request('../../user/doc!updateDoc.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function downloadDoc(values) {
  const postData = `docId=${values.docId}&accountUid=${values.accountUid}&edit=${new Date().getTime()}`;
  return request('../../user/doc!downloadDoc.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function deleteDoc(values) {
  const postData = `docId=${values.docId}&edit=${new Date().getTime()}`;
  return request('../../user/doc!deleteDoc.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function getReceiveInfo(values) {
  const postData = `email=${values.email}&edit=${new Date().getTime()}`;
  return request('../../user/doc!getReceiveInfo.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function addReceiver(values) {
  const postData = `signdocId=${values.signdocId}&sends=${values.sends}&edit=${new Date().getTime()}`;
  return request('../../user/sign!addReceiver.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function uploadFileWithBase64(file) {
  return request('../../service/file/uploadFileWithBase64', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(file),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function createSealKey() {
  const postData = `edit=${new Date().getTime()}`;
  return request('../../user/seal!createSealKey.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function getMobileSeal(values) {
  const postData = `code=${values.code}&edit=${new Date().getTime()}`;
  return request('../../user/seal!getMobileSeal.xml', {
    method: 'POST',
    credentials: 'same-origin',
    body: postData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
