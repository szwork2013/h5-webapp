import request from '../utils/request';


export async function getAccountInfo() {
  return request('../../service/ic/account/detail', {
    method: 'GET',
    credentials: 'same-origin',
  });
}

export async function updateAccountSafeInfo(values) {
  return request('../../service/ic/account/updateSafeInfo', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function organInfoAuth(values) {
  return request('../../service/ic/auth/organInfoAuth', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function organToPay(values) {
  return request('../../service/ic/auth/organToPay', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function organPayAuth(values) {
  return request('../../service/ic/auth/organPayAuth', {
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
  return request('../../service/ic/file/uploadFile', {
    method: 'POST',
    credentials: 'same-origin',
    body: formData,
  });
}
