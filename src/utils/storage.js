const WATCHED_KEY = 'yt_watched'
const API_KEY = 'yt_api_key'
const PLAYLISTS_KEY = 'yt_playlists'

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
  return localStorage.getItem(API_KEY) || import.meta.env.VITE_API_KEY || ''
}

export const hasEnvApiKey = !!import.meta.env.VITE_API_KEY

export function saveApiKey(key) {
  localStorage.setItem(API_KEY, key)
}

export function getSavedPlaylists() {
  try {
    return JSON.parse(localStorage.getItem(PLAYLISTS_KEY) || '[]')
  } catch {
    return []
  }
}

export function savePlaylist(name, url) {
  const list = getSavedPlaylists()
  list.unshift({ id: Date.now().toString(), name, url })
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(list))
}

export function removePlaylist(id) {
  const list = getSavedPlaylists().filter(p => p.id !== id)
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(list))
}
