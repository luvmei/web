# Yamato Command Center

정적 HTML/CSS/JavaScript 데모입니다. 별도의 빌드나 패키지 설치 없이 `index.html`을 브라우저에서 열면 됩니다.

## 수정 위치

- 공지사항·출금 더미 데이터: `js/app.js` 상단의 `notices`, `withdrawals` 배열
- 로그인 처리 및 영상 전환: `js/app.js`의 로그인 이벤트와 `showMain()` 함수
- 로그인 전환 영상: `assets/space-battleship.mp4`
- 로그인 후 전투 배경: `assets/battle-clips/`의 무음 MP4 6개와 `assets/battle-stills/`의 보정된 전투·함대전 프레임 6장을 번갈아 12초마다 1.8초 교차 페이드 전환합니다. 새 영상에서 추가한 클립은 `shock-laser-net.mp4`, `shock-fleet-battle.mp4`, `shock-cannon-volley.mp4`, `shock-red-armada.mp4`입니다. `js/app.js`의 `backgroundCycleDuration`으로 간격 조정이 가능합니다.
- 교차 무선통신 카드: `js/app.js`의 `teamMessages`(1번, 아군)와 `rivalMessages`(2번, 상대팀)를 사용합니다. 로그인 후 첫 표시 뒤, 60~100초의 넉넉한 랜덤 대기 시간을 두고 다음 통신이 시작됩니다. 먼저 나온 카드 뒤에 반대편 카드가 0.76초 뒤 따라 나오며, 두 카드는 동시에 화면 밖으로 퇴장합니다.
- 통신 카드 초상: 사용자가 제공한 20인 설정화 시트의 상단 10명은 아군, 하단 10명은 상대팀으로 분리했습니다. 인물 외의 흰 배경을 제거한 투명 PNG는 `assets/comm-cutouts/`에 있으며, 카드의 통신 배경과 겹쳐 보이도록 사용합니다.
- 통신 카드 내부 배경: 실제 세로 일러스트 5장(관제실·함교·전투기 콕핏·격납고·기관실)을 `assets/comm-backgrounds/`에 저장했습니다. 카드가 표시될 때마다 랜덤으로 선택되며, 이미지 자체는 천천히 이동하고 CSS HUD·스캔·광원 애니메이션이 위에 겹쳐집니다.
- 화면 문구·구조: `index.html`
- 색상·레이아웃·애니메이션: `css/style.css`

## 실제 연동 시

현재 로그인은 어떤 ID/비밀번호로도 진입하는 데모입니다. 실제 API 연동 시 `loginForm`의 submit 이벤트에서 인증 API를 호출하고, 성공 시 현재의 영상 재생 로직을 이어서 사용하면 됩니다.

`바로가기 다운로드`는 열려 있는 페이지 주소를 가리키는 Windows `.url` 파일을 만듭니다. 실제 도메인으로 배포한 뒤에도 별도 수정 없이 그 주소가 다운로드됩니다.
