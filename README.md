# 📺 비디오방

YouTube 재생목록을 불러와서 영상을 관리하고 시청할 수 있는 웹앱입니다.

## 기능

- **재생목록 불러오기** — YouTube 재생목록 URL을 붙여넣으면 영상 목록 자동 표시
- **시청 기록** — 다 본 영상은 회색으로 표시, 브라우저에 자동 저장
- **연속 재생** — 영상이 끝나면 다음 영상 자동 재생
- **타임스탬프 댓글 팝업** — 재생 시점에 맞는 댓글이 화면에 자동 표시

## 사용 방법

1. [Google Cloud Console](https://console.cloud.google.com)에서 YouTube Data API v3 키 발급
2. 앱 상단에 API 키 입력 (이후 자동 저장)
3. YouTube 재생목록 URL 붙여넣기 → 불러오기
4. 영상 클릭해서 재생

## 로컬 실행

Node.js가 설치되어 있어야 합니다.

```bash
git clone https://github.com/emptybudget/youtube-videoroom.git
cd youtube-videoroom
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.
