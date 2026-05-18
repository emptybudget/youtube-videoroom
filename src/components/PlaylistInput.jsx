import { useState } from 'react'
import { extractPlaylistId, fetchPlaylistItems } from '../utils/youtube'
import { saveApiKey, getSavedPlaylists, savePlaylist, removePlaylist } from '../utils/storage'

export default function PlaylistInput({ apiKey, setApiKey, onLoad, loading, setLoading }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(getSavedPlaylists)

  async function handleLoad(targetUrl) {
    const u = targetUrl ?? url
    setError('')
    const listId = extractPlaylistId(u.trim())
    if (!listId) return setError('재생목록 URL에서 list= 파라미터를 찾을 수 없습니다.')
    if (!apiKey.trim()) return setError('YouTube Data API 키를 입력해 주세요.')

    setLoading(true)
    try {
      const items = await fetchPlaylistItems(apiKey.trim(), listId)
      onLoad(items)
      if (!targetUrl) setUrl(u)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleApiKeyChange(v) {
    setApiKey(v)
    saveApiKey(v)
  }

  function handleSave() {
    if (!url.trim()) return
    const name = window.prompt('저장할 이름을 입력해 주세요:')
    if (!name?.trim()) return
    savePlaylist(name.trim(), url.trim())
    setSaved(getSavedPlaylists())
  }

  function handleRemove(id) {
    removePlaylist(id)
    setSaved(getSavedPlaylists())
  }

  return (
    <div className="playlist-input">
      <div className="input-row">
        <input
          type={showKey ? 'text' : 'password'}
          placeholder="YouTube Data API 키"
          value={apiKey}
          onChange={e => handleApiKeyChange(e.target.value)}
          className="input api-key-input"
        />
        <button className="btn-icon" onClick={() => setShowKey(s => !s)} title={showKey ? '숨기기' : '보기'}>
          {showKey ? '🙈' : '👁'}
        </button>
      </div>
      <div className="input-row">
        <input
          type="text"
          placeholder="재생목록 URL 붙여넣기"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLoad()}
          className="input url-input"
        />
        <button className="btn-icon" onClick={handleSave} title="즐겨찾기 저장">★</button>
        <button className="btn-primary" onClick={() => handleLoad()} disabled={loading}>
          {loading ? '로딩 중…' : '불러오기'}
        </button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {saved.length > 0 && (
        <ul className="saved-list">
          {saved.map(p => (
            <li key={p.id} className="saved-item">
              <button className="saved-name" onClick={() => { setUrl(p.url); handleLoad(p.url) }}>
                ★ {p.name}
              </button>
              <button className="saved-remove" onClick={() => handleRemove(p.id)} title="삭제">×</button>
            </li>
          ))}
        </ul>
      )}
      <p className="hint">
        API 키: <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noreferrer">Google Cloud Console</a>에서 발급
      </p>
    </div>
  )
}
