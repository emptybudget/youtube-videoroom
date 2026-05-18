import { useState } from 'react'
import { extractPlaylistId, fetchPlaylistItems } from '../utils/youtube'
import { saveApiKey } from '../utils/storage'

export default function PlaylistInput({ apiKey, setApiKey, onLoad, loading, setLoading }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [showKey, setShowKey] = useState(false)

  async function handleLoad() {
    setError('')
    const listId = extractPlaylistId(url.trim())
    if (!listId) return setError('재생목록 URL에서 list= 파라미터를 찾을 수 없습니다.')
    if (!apiKey.trim()) return setError('YouTube Data API 키를 입력해 주세요.')

    setLoading(true)
    try {
      const items = await fetchPlaylistItems(apiKey.trim(), listId)
      onLoad(items)
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
        <button className="btn-primary" onClick={handleLoad} disabled={loading}>
          {loading ? '로딩 중…' : '불러오기'}
        </button>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <p className="hint">
        API 키: <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noreferrer">Google Cloud Console</a>에서 YouTube Data API v3 활성화 후 발급
      </p>
    </div>
  )
}
