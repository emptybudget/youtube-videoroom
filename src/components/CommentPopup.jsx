import { useState, useEffect, useRef } from 'react'

const SHOW_DURATION = 6000
const TIME_THRESHOLD = 2

export default function CommentPopup({ comments, currentTime, onSeek }) {
  const [visible, setVisible] = useState([])
  const shownRef = useRef(new Set())
  const timersRef = useRef({})

  useEffect(() => {
    shownRef.current = new Set()
    setVisible([])
    Object.values(timersRef.current).forEach(clearTimeout)
    timersRef.current = {}
  }, [comments])

  useEffect(() => {
    for (const comment of comments) {
      for (const ts of comment.timestamps) {
        const key = `${comment.id}-${ts}`
        if (shownRef.current.has(key)) continue
        if (Math.abs(currentTime - ts) <= TIME_THRESHOLD) {
          shownRef.current.add(key)
          setVisible(prev => [...prev, { ...comment, matchedTs: ts, key }])
          timersRef.current[key] = setTimeout(() => {
            setVisible(prev => prev.filter(c => c.key !== key))
          }, SHOW_DURATION)
        }
      }
    }
  }, [currentTime, comments])

  function formatTime(sec) {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    return `${m}:${String(s).padStart(2, '0')}`
  }

  if (!visible.length) return null

  return (
    <div className="comment-popup-container">
      {visible.map(c => (
        <div key={c.key} className="comment-popup">
          <div className="popup-header">
            {c.authorPhoto && <img src={c.authorPhoto} alt="" className="popup-avatar" />}
            <span className="popup-author">{c.authorName}</span>
            <button
              className="popup-ts"
              onClick={() => onSeek(c.matchedTs)}
              title="이 시점으로 이동"
            >
              {formatTime(c.matchedTs)}
            </button>
          </div>
          <p className="popup-text">{c.text.slice(0, 200)}{c.text.length > 200 ? '…' : ''}</p>
        </div>
      ))}
    </div>
  )
}
