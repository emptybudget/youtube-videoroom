import { clearWatched } from '../utils/storage'

export default function VideoList({ videos, currentId, watched, onSelect, onClearWatched, reversed, onToggleReverse }) {
  if (!videos.length) {
    return (
      <div className="video-list-empty">
        <p>재생목록 URL을 붙여넣고<br/>불러오기를 눌러주세요</p>
      </div>
    )
  }

  const unwatched = videos.filter(v => !watched.has(v.id)).length
  const total = videos.length

  function handleClear() {
    clearWatched()
    onClearWatched()
  }

  return (
    <div className="video-list">
      <div className="list-header">
        <span className="list-count">{unwatched}/{total} 미시청</span>
        <div className="list-header-actions">
          <button className={`btn-ghost ${reversed ? 'active' : ''}`} onClick={onToggleReverse} title="역순 재생">역순</button>
          <button className="btn-ghost" onClick={handleClear} title="시청 기록 초기화">초기화</button>
        </div>
      </div>
      <ul className="list-items">
        {videos.map((video) => {
          const isWatched = watched.has(video.id)
          const isCurrent = video.id === currentId
          return (
            <li
              key={video.id}
              className={`list-item ${isCurrent ? 'current' : ''} ${isWatched ? 'watched' : ''}`}
              onClick={() => onSelect(video)}
            >
              <div className="thumb-wrap">
                <img src={video.thumbnail} alt="" className="thumb" />
                {isCurrent && <div className="thumb-overlay playing-badge">▶</div>}
                {isWatched && !isCurrent && <div className="thumb-overlay watched-overlay" />}
              </div>
              <div className="item-info">
                <p className="item-title">{video.title}</p>
                {video.channelTitle && <p className="item-channel">{video.channelTitle}</p>}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
