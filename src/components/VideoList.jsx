import { clearWatched } from '../utils/storage'

export default function VideoList({
  playlists, currentId, watched,
  onSelect, onRemove, onClearWatched,
  expanded, onExpand,
  reversed, onToggleReverse,
}) {
  if (!playlists.length) {
    return (
      <div className="video-list-empty">
        <p>재생목록 URL을 붙여넣고<br/>추가를 눌러주세요</p>
      </div>
    )
  }

  function handleClear() {
    clearWatched()
    onClearWatched()
  }

  return (
    <div className="video-list">
      <div className="list-header">
        <span className="list-count">재생목록 {playlists.length}개</span>
        <div className="list-header-actions">
          <button className={`btn-ghost ${reversed ? 'active' : ''}`} onClick={onToggleReverse}>역순</button>
          <button className="btn-ghost" onClick={handleClear}>초기화</button>
        </div>
      </div>
      <ul className="list-items">
        {playlists.map(pl => {
          const isExpanded = expanded === pl.id
          const displayVideos = reversed ? [...pl.videos].reverse() : pl.videos
          const unwatched = pl.videos.filter(v => !watched.has(v.id)).length

          return (
            <li key={pl.id} className="playlist-group">
              <div className="playlist-row" onClick={() => onExpand(isExpanded ? null : pl.id)}>
                <span className="playlist-arrow">{isExpanded ? '▾' : '▸'}</span>
                <span className="playlist-name">{pl.name}</span>
                <span className="playlist-meta">{unwatched}/{pl.videos.length}</span>
                <button
                  className="saved-remove"
                  onClick={e => { e.stopPropagation(); onRemove(pl.id) }}
                  title="삭제"
                >×</button>
              </div>
              {isExpanded && (
                <ul className="playlist-videos">
                  {displayVideos.map(video => {
                    const isWatched = watched.has(video.id)
                    const isCurrent = video.id === currentId
                    return (
                      <li
                        key={video.id}
                        className={`list-item ${isCurrent ? 'current' : ''} ${isWatched ? 'watched' : ''}`}
                        onClick={() => onSelect(video, pl.id)}
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
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
