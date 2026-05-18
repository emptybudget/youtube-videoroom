import { useEffect, useRef, useCallback } from 'react'

function loadYTScript() {
  if (document.getElementById('yt-iframe-api')) return
  const script = document.createElement('script')
  script.id = 'yt-iframe-api'
  script.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(script)
}

export function useYouTubePlayer({ containerId, onReady, onStateChange, onTimeUpdate }) {
  const playerRef = useRef(null)
  const timerRef = useRef(null)

  const initPlayer = useCallback((videoId) => {
    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId)
      return
    }

    playerRef.current = new window.YT.Player(containerId, {
      videoId,
      playerVars: {
        autoplay: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: (e) => onReady?.(e),
        onStateChange: (e) => {
          onStateChange?.(e)
          if (e.data === window.YT.PlayerState.PLAYING) {
            timerRef.current = setInterval(() => {
              const time = playerRef.current?.getCurrentTime?.() ?? 0
              onTimeUpdate?.(Math.floor(time))
            }, 500)
          } else {
            clearInterval(timerRef.current)
          }
        },
      },
    })
  }, [containerId, onReady, onStateChange, onTimeUpdate])

  useEffect(() => {
    loadYTScript()

    if (window.YT?.Player) return

    window.onYouTubeIframeAPIReady = () => {}

    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  return { playerRef, initPlayer }
}
