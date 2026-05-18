import { useState, useCallback, useMemo } from 'react'
import PlaylistInput from './components/PlaylistInput'
import VideoList from './components/VideoList'
import VideoPlayer from './components/VideoPlayer'
import { getSavedApiKey, getWatched, markWatched, getSavedPlaylists, addPlaylist, removePlaylist } from './utils/storage'
import './App.css'

export default function App() {
  const [apiKey, setApiKey] = useState(getSavedApiKey)
  const [playlists, setPlaylists] = useState(getSavedPlaylists)
  const [currentVideo, setCurrentVideo] = useState(null)
  const [activePlaylistId, setActivePlaylistId] = useState(null)
  const [watched, setWatched] = useState(getWatched)
  const [loading, setLoading] = useState(false)
  const [mobileTab, setMobileTab] = useState('player')
  const [expanded, setExpanded] = useState(null)
  const [reversed, setReversed] = useState(false)

  const activeVideos = useMemo(() => {
    const pl = playlists.find(p => p.id === activePlaylistId)
    const vids = pl?.videos ?? []
    return reversed ? [...vids].reverse() : vids
  }, [playlists, activePlaylistId, reversed])

  function handleAdd(name, videos) {
    addPlaylist(name, videos)
    const updated = getSavedPlaylists()
    setPlaylists(updated)
    setExpanded(updated[0].id)
  }

  function handleSelect(video, playlistId) {
    setCurrentVideo(video)
    setActivePlaylistId(playlistId)
    setMobileTab('player')
  }

  function handleRemove(id) {
    removePlaylist(id)
    setPlaylists(getSavedPlaylists())
    if (activePlaylistId === id) setCurrentVideo(null)
    if (expanded === id) setExpanded(null)
  }

  const handleEnded = useCallback(() => {
    if (!currentVideo) return
    markWatched(currentVideo.id)
    setWatched(getWatched())
    const idx = activeVideos.findIndex(v => v.id === currentVideo.id)
    const next = activeVideos[idx + 1]
    if (next) setCurrentVideo(next)
  }, [currentVideo, activeVideos])

  return (
    <div className="layout">
      <aside className={`sidebar ${mobileTab === 'list' ? 'mobile-show' : 'mobile-hide'}`}>
        <header className="sidebar-header">
          <span className="logo">📺 비디오방</span>
        </header>
        <PlaylistInput
          apiKey={apiKey}
          setApiKey={setApiKey}
          onAdd={handleAdd}
          loading={loading}
          setLoading={setLoading}
        />
        <VideoList
          playlists={playlists}
          currentId={currentVideo?.id}
          watched={watched}
          onSelect={handleSelect}
          onRemove={handleRemove}
          onClearWatched={() => setWatched(getWatched())}
          expanded={expanded}
          onExpand={setExpanded}
          reversed={reversed}
          onToggleReverse={() => setReversed(r => !r)}
        />
      </aside>
      <main className={`main ${mobileTab === 'player' ? 'mobile-show' : 'mobile-hide'}`}>
        <VideoPlayer
          video={currentVideo}
          apiKey={apiKey}
          onEnded={handleEnded}
        />
      </main>
      <nav className="mobile-tab-bar">
        <button
          className={`mobile-tab ${mobileTab === 'player' ? 'active' : ''}`}
          onClick={() => setMobileTab('player')}
        >
          ▶ 플레이어
        </button>
        <button
          className={`mobile-tab ${mobileTab === 'list' ? 'active' : ''}`}
          onClick={() => setMobileTab('list')}
        >
          ☰ 목록 {playlists.length > 0 && `(${playlists.length})`}
        </button>
      </nav>
    </div>
  )
}
