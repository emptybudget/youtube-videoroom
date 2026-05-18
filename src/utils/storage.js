const WATCHED_KEY = 'yt_watched'
const API_KEY = 'yt_api_key'

export function getWatched() {
  try {
    return new Set(JSON.parse(localStorage.getItem(WATCHED_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

export function markWatched(videoId) {
  const set = getWatched()
  set.add(videoId)
  localStorage.setItem(WATCHED_KEY, JSON.stringify([...set]))
}

export function clearWatched() {
  localStorage.removeItem(WATCHED_KEY)
}

export function getSavedApiKey() {
  return localStorage.getItem(API_KEY) || ''
}

export function saveApiKey(key) {
  localStorage.setItem(API_KEY, key)
}
