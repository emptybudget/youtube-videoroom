import { dismissHelp } from '../utils/storage'

export default function HelpModal({ onClose }) {
  function handleDismiss() {
    dismissHelp()
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">📺 비디오방 사용법</h2>
        <ol className="modal-list">
          <li>재생목록 URL 붙여넣기 → <strong>추가</strong> → 이름 입력</li>
          <li>재생목록 이름 클릭 → 영상 목록 펼치기/접기</li>
          <li>영상 클릭 → 재생 시작, 끝나면 자동으로 다음 영상 재생</li>
          <li>다 본 영상은 자동으로 회색 처리 (초기화 버튼으로 리셋)</li>
          <li>재생 중 타임스탬프 댓글이 있으면 해당 시점에 자동 팝업</li>
          <li>재생 속도는 플레이어 하단에서 조절 (0.5x ~ 2x)</li>
          <li><strong>⛶</strong> 버튼으로 전체화면 — 댓글도 같이 표시됨</li>
          <li>역순 재생은 목록 상단 <strong>역순</strong> 버튼</li>
        </ol>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={handleDismiss}>오늘 다시 보지 않기</button>
          <button className="btn-primary" onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  )
}
