import { useState, useCallback, useEffect } from 'react'
import PlaylistInput from './components/PlaylistInput'
import VideoList from './components/VideoList'
import VideoPlayer from './components/VideoPlayer'
import { getSavedApiKey, getWatched, markWatched, getLastVideos, saveLastVideos } from './utils/storage'
import './App.css'

export default function App() {
  const [apiKey, setApiKey] = useState(getSavedApiKey)
  const [videos, setVideos] = useState(getLastVideos)
  const [currentVideo, setCurrentVideo] = useState(null)
  const [watched, setWatched] = useState(getWatched)
  const [loading, setLoading] = useState(false)
  const [mobileTab, setMobileTab] = useState('player')
  const [reversed, setReversed] = useState(false)

  const orderedVideos = reversed ? [...videos].reverse() : videos

  function handleLoad(items) {
    setVideos(items)
    saveLastVideos(items)
    setCurrentVideo(null)
  }

  function handleSelect(video) {
    setCurrentVideo(video)
    setMobileTab('player')
  }

  const handleEnded = useCallback(() => {
    if (!currentVideo) return
    markWatched(currentVideo.id)
    setWatched(getWatched())

    const idx = orderedVideos.findIndex(v => v.id === currentVideo.id)
    const next = orderedVideos[idx + 1]
    if (next) setCurrentVideo(next)
  }, [currentVideo, orderedVideos])

  function handleClearWatched() {
    setWatched(new Set())
  }

  return (
    <div className="layout">
      <aside className={`sidebar ${mobileTab === 'list' ? 'mobile-show' : 'mobile-hide'}`}>
        <header className="sidebar-header">
          <span className="logo">📺 비디오방</span>
        </header>
        <PlaylistInput
          apiKey={apiKey}
          setApiKey={setApiKey}
          onLoad={handleLoad}
          loading={loading}
          setLoading={setLoading}
        />
        <VideoList
          videos={orderedVideos}
          currentId={currentVideo?.id}
          watched={watched}
          onSelect={handleSelect}
          onClearWatched={handleClearWatched}
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
          ☰ 목록 {videos.length > 0 && `(${videos.length})`}
        </button>
      </nav>
    </div>
  )
}
