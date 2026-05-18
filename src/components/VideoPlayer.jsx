import { useEffect, useRef, useState } from 'react'
import CommentPopup from './CommentPopup'
import { fetchComments } from '../utils/youtube'

const PLAYER_DIV_ID = 'yt-player'
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]

function loadYTScript() {
  if (document.getElementById('yt-iframe-api')) return
  const tag = document.createElement('script')
  tag.id = 'yt-iframe-api'
  tag.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(tag)
}

export default function VideoPlayer({ video, apiKey, onEnded }) {
  const playerRef = useRef(null)
  const onEndedRef = useRef(onEnded)
  const currentVideoIdRef = useRef(null)
  const timerRef = useRef(null)
  const speedRef = useRef(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  onEndedRef.current = onEnded

  function startTimer() {
    clearInterval(timerRef.current)
    playerRef.current?.setPlaybackRate(speedRef.current)
    timerRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(Math.floor(playerRef.current.getCurrentTime()))
      }
    }, 500)
  }

  function stopTimer() {
    clearInterval(timerRef.current)
  }

  function createPlayer(videoId) {
    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId)
      return
    }
    playerRef.current = new window.YT.Player(PLAYER_DIV_ID, {
      videoId,
      width: '100%',
      height: '100%',
      playerVars: { autoplay: 1, modestbranding: 1, rel: 0, iv_load_policy: 3, fs: 0 },
      events: {
        onStateChange(e) {
          if (e.data === window.YT.PlayerState.PLAYING) startTimer()
          else stopTimer()
          if (e.data === window.YT.PlayerState.ENDED) onEndedRef.current?.()
        },
      },
    })
  }

  useEffect(() => {
    loadYTScript()
    if (!window.YT?.Player) {
      const prev = window.onYouTubeIframeAPIReady || (() => {})
      window.onYouTubeIframeAPIReady = () => {
        prev()
        if (currentVideoIdRef.current) createPlayer(currentVideoIdRef.current)
      }
    }
    return () => stopTimer()
  }, [])

  useEffect(() => {
    if (!video) return
    currentVideoIdRef.current = video.id
    if (window.YT?.Player) createPlayer(video.id)
    if (apiKey) {
      setCommentsLoading(true)
      fetchComments(apiKey, video.id)
        .then(setComments)
        .catch(() => setComments([]))
        .finally(() => setCommentsLoading(false))
    }
  }, [video, apiKey])

  function handleSeek(seconds) {
    playerRef.current?.seekTo(seconds, true)
  }

  function handleSpeed(s) {
    setSpeed(s)
    speedRef.current = s
    playerRef.current?.setPlaybackRate(s)
  }

  if (!video) {
    return (
      <div className="player-empty">
        <div className="player-placeholder">
          <span className="placeholder-icon">▶</span>
          <p>영상을 선택해 주세요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="player-area">
      <div className={`player-wrapper${isFullscreen ? ' player-fullscreen' : ''}`}>
        <div id={PLAYER_DIV_ID} />
        <CommentPopup comments={comments} currentTime={currentTime} onSeek={handleSeek} />
        {commentsLoading && <div className="comments-loading">댓글 로딩 중…</div>}
        <button
          className="btn-fullscreen"
          onClick={() => setIsFullscreen(f => !f)}
          title={isFullscreen ? '전체화면 종료' : '전체화면'}
        >
          {isFullscreen ? '✕' : '⛶'}
        </button>
      </div>
      <div className="player-info">
        <div className="player-info-top">
          <div className="player-titles">
            <h2 className="player-title">{video.title}</h2>
            {video.channelTitle && <p className="player-channel">{video.channelTitle}</p>}
          </div>
          <div className="speed-bar">
            {SPEEDS.map(s => (
              <button
                key={s}
                className={`speed-btn ${speed === s ? 'active' : ''}`}
                onClick={() => handleSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
        <p className="player-comment-hint">
          {comments.length > 0
            ? `타임스탬프 댓글 ${comments.length}개 • 재생 중 자동 표시`
            : apiKey ? '타임스탬프 댓글 없음' : ''}
        </p>
      </div>
    </div>
  )
}
