import { showToast } from 'vant'

const AUTH_KEY = 'travel_agent_user'

export function isLoggedIn() {
  return !!localStorage.getItem(AUTH_KEY)
}

export function getUser() {
  const raw = localStorage.getItem(AUTH_KEY)
  return raw ? JSON.parse(raw) : null
}

export function setUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

/**
 * 检查登录状态，未登录则跳转登录页并提示
 * @param {object} router - vue-router 实例
 * @returns {boolean} 是否已登录
 */
export function checkLogin(router) {
  if (!isLoggedIn()) {
    showToast('你还未登录！')
    router.push('/login')
    return false
  }
  return true
}
