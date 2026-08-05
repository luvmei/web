# 우주전함 야마토 커맨드 센터

별도 빌드 도구 없이 `index.html`을 브라우저에서 열어 실행할 수 있는 정적 HTML·CSS·JavaScript 프로젝트입니다.

## 주요 파일

- 화면 구조: `index.html`
- 스타일과 연출: `css/style.css`
- 더미 공지·출금 데이터 및 상호작용: `js/app.js`
- GitHub Pages 배포: `.github/workflows/deploy-pages.yml`

## 에셋 구성

- 로그인 전환 영상: `assets/space-battleship.mp4`
- 메인 전투 배경: `assets/battle-clips/`의 MP4 영상과 `assets/battle-art/`의 정적 전투 이미지
- 배경음: `assets/audio/yamato_bgm.mp3`
- 통신 카드 인물·배경: `assets/comm-cutouts/`, `assets/comm-backgrounds/`
- 함대·전투기 연출: `assets/fleet-ships/`, `assets/fighters/`
- 전투 시작 및 애널라이저 연출: `assets/game-start/`, `assets/analyzer/`

## 데이터 및 실제 기능 연결

`js/app.js` 상단의 `notices`, `withdrawals`, `teamMessages`, `rivalMessages` 배열은 모두 더미 데이터입니다. 실제 API 연결 시 해당 배열과 로그인·회원가입 제출 이벤트를 교체하면 됩니다.

현재 로그인 화면은 데모이며 어떤 ID와 비밀번호로도 진입할 수 있습니다. 실제 인증을 연동할 때는 `loginForm`의 제출 이벤트에서 인증 API를 호출한 후, 성공한 경우에만 `showMain()`을 실행하도록 변경하면 됩니다.

`바로가기 다운로드`는 현재 페이지 주소를 가리키는 Windows `.url` 파일을 생성합니다. 실제 도메인으로 배포한 뒤에도 별도 수정 없이 해당 주소를 내려받습니다.
