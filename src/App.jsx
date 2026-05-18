import { useState, useCallback } from 'react'
import PlaylistInput from './components/PlaylistInput'
import VideoList from './components/VideoList'
import VideoPlayer from './components/VideoPlayer'
import { getSavedApiKey, getWatched, markWatched } from './utils/storage'
import './App.css'

export default function App() {
  const [apiKey, setApiKey] = useState(getSavedApiKey)
  const [videos, setVideos] = useState([])
  const [currentVideo, setCurrentVideo] = useState(null)
  const [watched, setWatched] = useState(getWatched)
  const [loading, setLoading] = useState(false)

  function handleLoad(items) {
    setVideos(items)
    setCurrentVideo(null)
  }

  function handleSelect(video) {
    setCurrentVideo(video)
  }

  const handleEnded = useCallback(() => {
    if (!currentVideo) return
    markWatched(currentVideo.id)
    setWatched(getWatched())

    const idx = videos.findIndex(v => v.id === currentVideo.id)
    const next = videos[idx + 1]
    if (next) setCurrentVideo(next)
  }, [currentVideo, videos])

  function handleClearWatched() {
    setWatched(new Set())
  }

  return (
    <div className="layout">
      <aside className="sidebar">
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
          videos={videos}
          currentId={currentVideo?.id}
          watched={watched}
          onSelect={handleSelect}
          onClearWatched={handleClearWatched}
        />
      </aside>
      <main className="main">
        <VideoPlayer
          video={currentVideo}
          apiKey={apiKey}
          onEnded={handleEnded}
        />
      </main>
    </div>
  )
}
