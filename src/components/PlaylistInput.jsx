import { useState } from 'react'
import { extractPlaylistId, fetchPlaylistItems } from '../utils/youtube'
import { saveApiKey, hasEnvApiKey } from '../utils/storage'

export default function PlaylistInput({ apiKey, setApiKey, onAdd, loading, setLoading }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [showKey, setShowKey] = useState(false)

  async function handleAdd() {
    setError('')
    const listId = extractPlaylistId(url.trim())
    if (!listId) return setError('재생목록 URL에서 list= 파라미터를 찾을 수 없습니다.')
    if (!apiKey.trim()) return setError('YouTube Data API 키를 입력해 주세요.')

    setLoading(true)
    try {
      const items = await fetchPlaylistItems(apiKey.trim(), listId)
      const name = window.prompt('재생목록 이름을 입력해 주세요:')
      if (!name?.trim()) return
      onAdd(name.trim(), items)
      setUrl('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="playlist-input">
      {!hasEnvApiKey && (
        <div className="input-row">
          <input
            type={showKey ? 'text' : 'password'}
            placeholder="YouTube Data API 키"
            value={apiKey}
            onChange={e => { setApiKey(e.target.value); saveApiKey(e.target.value) }}
            className="input api-key-input"
          />
          <button className="btn-icon" onClick={() => setShowKey(s => !s)}>
            {showKey ? '🙈' : '👁'}
          </button>
        </div>
      )}
      <div className="input-row">
        <input
          type="text"
          placeholder="재생목록 URL 붙여넣기"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="input url-input"
        />
        <button className="btn-primary" onClick={handleAdd} disabled={loading}>
          {loading ? '로딩 중…' : '추가'}
        </button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {!hasEnvApiKey && (
        <p className="hint">
          API 키: <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noreferrer">Google Cloud Console</a>에서 발급
        </p>
      )}
    </div>
  )
}
