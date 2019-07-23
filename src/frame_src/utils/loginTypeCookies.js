import Cookies from 'js-cookie'

const loginKey = 'loginType'

export function getLoginType() {
  return Cookies.get(loginKey)
}

export function setLoginType(loginType) {
  return Cookies.set(loginKey, loginType)
}

export function removeLoginType() {
  return Cookies.remove(loginKey)
}
