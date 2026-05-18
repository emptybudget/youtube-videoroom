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
        <p className="modal-desc">
          정주행하고 싶은 재생목록을 저장해두고, 영상 재생 중 타임라인에 맞는 댓글이 자동으로 팝업됩니다.
        </p>
        <ol className="modal-list">
          <li>재생목록 URL 붙여넣기 → <strong>추가</strong> → 이름 입력 후 저장</li>
          <li>재생목록 이름 클릭 → 영상 목록 펼치기 / 다시 클릭하면 접기</li>
          <li>영상 클릭하면 재생 시작, 끝나면 자동으로 다음 영상 재생</li>
          <li>다 본 영상은 자동으로 회색 처리 — <strong>초기화</strong> 버튼으로 리셋 가능</li>
          <li>재생 중 타임스탬프가 포함된 댓글은 해당 시점에 자동 팝업</li>
          <li><strong>⛶</strong> 버튼으로 전체화면 전환 — 전체화면에서도 댓글 팝업 표시</li>
          <li>재생 속도 조절 가능 (0.5x ~ 2x)</li>
          <li><strong>역순</strong> 버튼으로 재생목록을 거꾸로 재생 가능</li>
        </ol>
        <p className="modal-notice">
          💡 시청 기록은 이 브라우저에만 저장됩니다. 다른 기기에서 접속하면 별도로 관리됩니다.
        </p>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={handleDismiss}>오늘 다시 보지 않기</button>
          <button className="btn-primary" onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  )
}
