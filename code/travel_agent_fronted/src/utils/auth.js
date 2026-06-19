import { showToast } from 'vant'
import 'vant/es/toast/style/index.mjs'

const AUTH_KEY = 'travel_agent_user'
const PROFILE_PREFIX = 'travel_agent_profile_'

export function isLoggedIn() {
  return !!localStorage.getItem(AUTH_KEY)
}

export function getUser() {
  const raw = localStorage.getItem(AUTH_KEY)
  return raw ? JSON.parse(raw) : null
}

export function setUser(user) {
  const profileKey = PROFILE_PREFIX + user.username
  const saved = localStorage.getItem(profileKey)
  if (saved) {
    const profile = JSON.parse(saved)
    const merged = { ...profile, ...user }
    localStorage.setItem(AUTH_KEY, JSON.stringify(merged))
    localStorage.setItem(profileKey, JSON.stringify(merged))
  } else {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    localStorage.setItem(profileKey, JSON.stringify(user))
  }
}

export function updateUser(partial) {
  const user = getUser()
  if (user) {
    const updated = { ...user, ...partial }
    localStorage.setItem(AUTH_KEY, JSON.stringify(updated))
    localStorage.setItem(PROFILE_PREFIX + user.username, JSON.stringify(updated))
  }
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
    showToast({
      message: '你还未登录！',
      onClose: () => {
        router.push('/login')
      }
    })
    return false
  }
  return true
}

// ========== 收藏功能 ==========

const FAVORITES_PREFIX = 'travel_agent_favorites_'

function getFavoritesKey() {
  const user = getUser()
  if (!user) return null
  return FAVORITES_PREFIX + user.username
}

export function getFavorites() {
  const key = getFavoritesKey()
  if (!key) return { trips: [], spots: [], messages: [] }
  const raw = localStorage.getItem(key)
  const data = raw ? JSON.parse(raw) : {}
  return { trips: data.trips || [], spots: data.spots || [], messages: data.messages || [] }
}

function saveFavorites(data) {
  const key = getFavoritesKey()
  if (key) {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function addTripFavorite(tripData) {
  const fav = getFavorites()
  const id = 'trip_' + Date.now()
  const item = {
    id,
    city: tripData.city,
    days: tripData.days,
    totalBudget: tripData.totalBudget,
    dailyItinerary: tripData.dailyItinerary,
    budgetBreakdown: tripData.budgetBreakdown,
    tips: tripData.tips,
    warnings: tripData.warnings,
    createdAt: Date.now()
  }
  fav.trips.unshift(item)
  saveFavorites(fav)
  return id
}

export function removeTripFavorite(id) {
  const fav = getFavorites()
  fav.trips = fav.trips.filter(t => t.id !== id)
  saveFavorites(fav)
}

export function isTripFavorited(city, days) {
  const fav = getFavorites()
  return fav.trips.some(t => t.city === city && t.days === days)
}

export function getTripFavoriteId(city, days) {
  const fav = getFavorites()
  const trip = fav.trips.find(t => t.city === city && t.days === days)
  return trip ? trip.id : null
}

export function addSpotFavorite(spot, city) {
  const fav = getFavorites()
  const id = 'spot_' + Date.now()
  const item = {
    id,
    spot: spot.spot || spot.name,
    duration: spot.duration,
    ticket: spot.ticket,
    transportation: spot.transportation,
    description: spot.description,
    city,
    createdAt: Date.now()
  }
  fav.spots.unshift(item)
  saveFavorites(fav)
  return id
}

export function removeSpotFavorite(id) {
  const fav = getFavorites()
  fav.spots = fav.spots.filter(s => s.id !== id)
  saveFavorites(fav)
}

export function isSpotFavorited(spotName, city) {
  const fav = getFavorites()
  return fav.spots.some(s => s.spot === spotName && s.city === city)
}

export function getSpotFavoriteId(spotName, city) {
  const fav = getFavorites()
  const spot = fav.spots.find(s => s.spot === spotName && s.city === city)
  return spot ? spot.id : null
}

export function addMessageFavorite(question, content) {
  const fav = getFavorites()
  const id = 'msg_' + Date.now()
  const item = {
    id,
    question,
    content,
    createdAt: Date.now()
  }
  fav.messages.unshift(item)
  saveFavorites(fav)
  return id
}

export function removeMessageFavorite(id) {
  const fav = getFavorites()
  fav.messages = fav.messages.filter(m => m.id !== id)
  saveFavorites(fav)
}

export function isMessageFavorited(content) {
  const fav = getFavorites()
  return fav.messages.some(m => m.content === content)
}

export function getMessageFavoriteId(content) {
  const fav = getFavorites()
  const msg = fav.messages.find(m => m.content === content)
  return msg ? msg.id : null
}

// ========== 历史记录功能 ==========

const HISTORY_PREFIX = 'travel_agent_history_'

function getHistoryKey() {
  const user = getUser()
  if (!user) return null
  return HISTORY_PREFIX + user.username
}

export function getHistory() {
  const key = getHistoryKey()
  if (!key) return { trips: [], chats: [] }
  const raw = localStorage.getItem(key)
  const data = raw ? JSON.parse(raw) : {}
  return { trips: data.trips || [], chats: data.chats || [] }
}

function saveHistory(data) {
  const key = getHistoryKey()
  if (key) {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function addTripHistory(tripData) {
  const history = getHistory()
  const id = 'trip_' + Date.now()
  const item = {
    id,
    city: tripData.city,
    budget: tripData.totalBudget || tripData.budget,
    totalBudget: tripData.totalBudget || tripData.budget,
    days: tripData.days,
    dailyItinerary: tripData.dailyItinerary,
    budgetBreakdown: tripData.budgetBreakdown,
    tips: tripData.tips,
    warnings: tripData.warnings,
    createdAt: Date.now()
  }
  history.trips.unshift(item)
  saveHistory(history)
  return id
}

export function removeTripHistory(id) {
  const history = getHistory()
  history.trips = history.trips.filter(t => t.id !== id)
  saveHistory(history)
}

export function addChatHistory(city, messages) {
  const history = getHistory()
  const id = 'chat_' + Date.now()
  const item = {
    id,
    city,
    messageCount: messages.length,
    messages,
    createdAt: Date.now()
  }
  history.chats.unshift(item)
  saveHistory(history)
  return id
}

export function removeChatHistory(id) {
  const history = getHistory()
  history.chats = history.chats.filter(c => c.id !== id)
  saveHistory(history)
}
