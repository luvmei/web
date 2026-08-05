/*
  데모 데이터와 문구는 이 파일의 배열에서 바로 수정할 수 있습니다.
  실제 로그인/API 연동 시에는 handleLogin, notices, withdrawals 부분을 교체하세요.
*/
const notices = [
  { priority: 'IMPORTANT', title: '8월 정기 시스템 점검 안내', date: '2026.08.01', content: '함대 지휘 시스템 정기 점검이 진행됩니다.\n\n점검 시간: 2026년 8월 3일 02:00 ~ 06:00\n점검 중에는 로그인, 보급 기록 조회 및 출금 요청을 포함한 일부 기능을 이용할 수 없습니다.\n\n안정적인 시스템 운영을 위한 점검이오니 승무원 여러분의 양해를 부탁드립니다.' },
  { priority: 'NOTICE', title: '출금 처리 시간 변경 안내', date: '2026.07.29', content: '보급 출금 요청의 처리 시간이 아래와 같이 변경됩니다.\n\n처리 시간: 매일 10:00 ~ 23:30\n접수 마감 이후의 요청은 다음 운항일에 순차적으로 처리됩니다.\n\n정확한 계좌 정보 입력 여부를 출금 요청 전 다시 확인해 주세요.' },
  { priority: 'NOTICE', title: '함대 보안 정책 업데이트', date: '2026.07.24', content: '승무원 계정 보호를 위한 보안 정책이 업데이트되었습니다.\n\n비밀번호는 타인과 공유하지 말아 주세요.\n의심스러운 접속 기록이 확인되면 즉시 1:1 문의 채널로 보고해 주세요.\n\n보안 절차를 준수해 안전한 함대 운용에 협조 바랍니다.' },
  { priority: 'EVENT', title: '신규 승무원 환영 보급품 지급', date: '2026.07.18', content: '신규 승무원 등록을 완료한 전원에게 환영 보급품이 지급됩니다.\n\n대상: 7월 18일 이후 등록을 완료한 승무원\n지급: 등록 정보 확인 후 순차 지급\n\n보급품 수령을 위해 승무원 등록 정보와 계좌 정보를 최신 상태로 유지해 주세요.' },
  { priority: 'NOTICE', title: '1:1 문의 채널 운영 시간 안내', date: '2026.07.11', content: '1:1 문의 채널의 운영 시간을 안내드립니다.\n\n운영 시간: 평일 10:00 ~ 18:00\n운영 시간 외에 접수된 문의는 다음 운항일에 순차 답변됩니다.\n\n문의 내용에는 승무원 ID와 요청 사항을 함께 남겨 주세요.' },
];

const withdrawals = [
  { time: '방금 전', name: 'KIM***', amount: '₩ 1,500,000' },
  { time: '1분 전', name: 'LEE***', amount: '₩ 320,000' },
  { time: '2분 전', name: 'CHOI***', amount: '₩ 870,000' },
  { time: '4분 전', name: 'PARK***', amount: '₩ 2,100,000' },
  { time: '6분 전', name: 'HAN***', amount: '₩ 540,000' },
  { time: '8분 전', name: 'JUNG***', amount: '₩ 1,250,000' },
  { time: '11분 전', name: 'SONG***', amount: '₩ 760,000' },
];

const $ = (selector) => document.querySelector(selector);
const backdropVideo = $('#backdropVideo');
const loginForm = $('#loginForm');
const mainScreen = $('#mainScreen');
const clipTimer = $('#clipTimer');
const launchScreen = $('#launchScreen');
const clipVolume = 0.55;
const mainBgmVolume = 0.4;
const audioFadeDuration = 1.5;
const backgroundSlides = [...document.querySelectorAll('.dashboard-background')];
const backgroundVideos = backgroundSlides.filter((slide) => slide.tagName === 'VIDEO');
const backgroundCycleDuration = 12000;
const radioCommsTeam = $('#radioCommsTeam');
const radioCommsRival = $('#radioCommsRival');
const analyzerBot = $('#analyzerBot');
const fleetFlyby = $('#fleetFlyby');
const fleetFlybyShip = $('#fleetFlybyShip');
const fighterFormation = $('#fighterFormation');
const mainBgm = $('#mainBgm');
const bgmToggle = $('#bgmToggle');
const teamRadioCard = radioCommsTeam.querySelector('.radio-card');
const rivalRadioCard = radioCommsRival.querySelector('.radio-card');
const commsScenes = ['command', 'bridge', 'cockpit', 'hangar', 'engine'];
const teamMessages = [
  { type: 'signal', label: 'ALLY TRANSMISSION', channel: 'CH-01', source: 'SUSUMU KODAI // TACTICAL', title: 'PRIORITY TRANSMISSION', message: 'Capital ship is holding course.', portrait: 'assets/comm-cutouts/kodai.png', portraitAlt: '고대 진' },
  { type: 'intel', label: 'CREW CHANNEL', channel: 'CH-01', source: 'YUKI MORI // OPERATIONS', title: 'DECK STATUS', message: 'All crew stations are reporting in.', portrait: 'assets/comm-cutouts/mori.png', portraitAlt: '모리 유키' },
  { type: 'mission', label: 'ENGINEERING LINK', channel: 'CH-01', source: 'SHIRO SANADA // ENGINEERING', title: 'OUTPUT STABLE', message: 'Main drive has reached operational output.', portrait: 'assets/comm-cutouts/sanada.png', portraitAlt: '사나다 시로' },
  { type: 'signal', label: 'FLEET COMMAND', channel: 'CH-01', source: 'JŪZŌ OKITA // COMMAND', title: 'HOLD FORMATION', message: 'Maintain course until the next order.', portrait: 'assets/comm-cutouts/okita-officer.png', portraitAlt: '오키타 쥬조' },
  { type: 'mission', label: 'COMMAND PRIORITY', channel: 'CH-01', source: 'CAPT. OKITA // YAMATO', title: 'ALL STATIONS READY', message: 'Prepare for departure sequence.', portrait: 'assets/comm-cutouts/okita-captain.png', portraitAlt: '오키타 함장' },
  { type: 'alert', label: 'AIR WING LINK', channel: 'CH-01', source: 'RYŌ YAMAMOTO // FLIGHT', title: 'INTERCEPT ORDER', message: 'Escort craft are standing by for launch.', portrait: 'assets/comm-cutouts/yamamoto.png', portraitAlt: '야마모토 료' },
  { type: 'intel', label: 'TACTICAL ANALYSIS', channel: 'CH-01', source: 'KAORU NIIMI // ANALYSIS', title: 'DATA LOCKED', message: 'Enemy trajectory calculation complete.', portrait: 'assets/comm-cutouts/niimi.png', portraitAlt: '니이미 카오루' },
  { type: 'alert', label: 'SECURITY CHANNEL', channel: 'CH-01', source: 'MASAYUKI HARADA // SECURITY', title: 'PERIMETER CLEAR', message: 'No hostile contacts on the inner deck.', portrait: 'assets/comm-cutouts/harada.png', portraitAlt: '하라다 마사유키' },
  { type: 'intel', label: 'MEDICAL CHANNEL', channel: 'CH-01', source: 'YURIA MISAKI // MEDICAL', title: 'CREW STATUS', message: 'All active personnel are cleared.', portrait: 'assets/comm-cutouts/misaki.png', portraitAlt: '미사키 유리아' },
  { type: 'mission', label: 'SUPPORT CHANNEL', channel: 'CH-01', source: 'MIKAGE KIRYŪ // SUPPORT', title: 'SUPPLY CHECK', message: 'Support systems are standing by.', portrait: 'assets/comm-cutouts/kiryu.png', portraitAlt: '키류 미카게' },
];
const rivalMessages = [
  { type: 'alert', label: 'HOSTILE SIGNAL', channel: 'CH-02', source: 'RYŪ HIJIKATA // GAMILAS', title: 'WAR FLEET ORDER', message: 'Enemy fleet has acquired our position.', portrait: 'assets/comm-cutouts/hijikata.png', portraitAlt: '히지카타 류' },
  { type: 'alert', label: 'HOSTILE SIGNAL', channel: 'CH-02', source: 'HAJIME SAITŌ // GAMILAS', title: 'ATTACK VECTOR', message: 'Advance formation is moving into range.', portrait: 'assets/comm-cutouts/saito.png', portraitAlt: '사이토 하지메' },
  { type: 'intel', label: 'ENCRYPTED COMMS', channel: 'CH-02', source: 'SABERA // IMPERIAL LINK', title: 'SIGNAL INTERCEPTED', message: 'A command relay has been detected.', portrait: 'assets/comm-cutouts/sabera.png', portraitAlt: '사베라' },
  { type: 'alert', label: 'HOSTILE PRIORITY', channel: 'CH-02', source: 'DESSLER // HIGH COMMAND', title: 'ENEMY CHANNEL', message: 'All battle groups, report status.', portrait: 'assets/comm-cutouts/dessler.png', portraitAlt: '데슬러' },
  { type: 'mission', label: 'FLEET COMMAND', channel: 'CH-02', source: 'DOMEL // STRIKE FLEET', title: 'FORMATION LOCKED', message: 'Attack formation is holding position.', portrait: 'assets/comm-cutouts/domel.png', portraitAlt: '도멜' },
  { type: 'intel', label: 'UNKNOWN ORIGIN', channel: 'CH-02', source: 'STARSHA // ISKANDAR', title: 'LONG-RANGE CALL', message: 'A distant transmission is incoming.', portrait: 'assets/comm-cutouts/starsha.png', portraitAlt: '스타샤' },
  { type: 'signal', label: 'UNKNOWN ORIGIN', channel: 'CH-02', source: 'SASHA // ISKANDAR', title: 'BEACON ACTIVE', message: 'Signal strength is increasing.', portrait: 'assets/comm-cutouts/sasha.png', portraitAlt: '사샤' },
  { type: 'mission', label: 'HOSTILE CHANNEL', channel: 'CH-02', source: 'ALPHON // GAMILAS', title: 'OUTER PERIMETER', message: 'Outer defense line has been deployed.', portrait: 'assets/comm-cutouts/alphon.png', portraitAlt: '알폰' },
  { type: 'alert', label: 'HOSTILE CHANNEL', channel: 'CH-02', source: 'ABERT // GAMILAS', title: 'TARGET ACQUIRED', message: 'Target is locked. Awaiting clearance.', portrait: 'assets/comm-cutouts/abert.png', portraitAlt: '아베르트' },
  { type: 'intel', label: 'ENCRYPTED COMMS', channel: 'CH-02', source: 'HILDE // GAMILAS', title: 'COMMS ESTABLISHED', message: 'Secure channel connection complete.', portrait: 'assets/comm-cutouts/hilde.png', portraitAlt: '힐데' },
];
let toastTimer;
let audioFadeFrame;
let backgroundCycleTimer;
let activeBackgroundIndex = 0;
let heroCarouselTimer;
let activeHeroBanner = 0;
let radioTimer;
let radioHideTimer;
let radioSecondTimer;
let radioStarted = false;
let analyzerTimer;
let analyzerHideTimer;
let analyzerStarted = false;
let fleetFlybyTimer;
let fleetFlybyHideTimer;
let fleetFlybyStarted = false;
let fighterFormationTimer;
let fighterFormationHideTimer;
let fighterFormationStarted = false;
let activeAmbientEffect = null;
let isBgmEnabled = true;
const fleetShips = [
  { src: 'assets/fleet-ships/fleet-navy-cruiser.png', glow: '#52d5ff' },
  { src: 'assets/fleet-ships/fleet-prometheus.png', glow: '#ff9b4a' },
  { src: 'assets/fleet-ships/fleet-dreadnought.png', glow: '#ff5d69' },
  { src: 'assets/fleet-ships/fleet-asuka.png', glow: '#ffc865' },
  { src: 'assets/fleet-ships/fleet-blue-cruiser.png', glow: '#6f9dff' },
  { src: 'assets/fleet-ships/fleet-yamato.png', glow: '#78ecff' },
];
const fighterModels = [
  { src: 'assets/fighters/fighter-cosmo-zero.png', glow: '#ffba58' },
  { src: 'assets/fighters/fighter-cargo-shuttle.png', glow: '#8be8ff' },
  { src: 'assets/fighters/fighter-recon.png', glow: '#ffc46e' },
  { src: 'assets/fighters/fighter-compact.png', glow: '#78efff' },
  { src: 'assets/fighters/fighter-interceptor.png', glow: '#d8f6ff' },
];
const analyzerDanceMinDuration = 13000;
const analyzerDanceMaxDuration = 19000;

function renderData() {
  $('#homeNotices').innerHTML = notices.slice(0, 3).map(noticeItem).join('');
  $('#allNotices').innerHTML = notices.map(noticeItem).join('');

  // 두 번 반복해 끊김 없는 상향 스크롤을 만듭니다.
  $('#homeWithdrawalTicker').innerHTML = [...withdrawals, ...withdrawals].map(withdrawalItem).join('');
  $('#allWithdrawals').innerHTML = withdrawals.map((item) => `
    <tr><td>${item.time}</td><td>${item.name}</td><td class="amount">${item.amount}</td><td><span class="complete">COMPLETED</span></td></tr>
  `).join('');
}

function noticeItem(item, index) {
  return `<li class="notice-row"><button type="button" class="notice-item" data-notice-index="${index}" aria-label="${item.title} 상세 보기"><span class="priority">${item.priority}</span><span class="notice-title">${item.title}</span><time class="notice-date">${item.date}</time><span class="notice-open" aria-hidden="true">→</span></button></li>`;
}

function withdrawalItem(item) {
  return `<li><span><small>${item.time}</small> &nbsp; ${item.name}</span><strong>${item.amount}</strong></li>`;
}

// 로그인 화면에서 영상의 첫 프레임을 고정해 배경으로 사용합니다.
backdropVideo.addEventListener('loadeddata', () => {
  backdropVideo.pause();
  backdropVideo.currentTime = 0;
}, { once: true });

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const crewId = new FormData(loginForm).get('crewId').trim();
  const crewName = $('#crewName');
  if (crewName) crewName.textContent = crewId.toUpperCase() || 'COMMANDER';
  document.body.classList.add('is-launching');
  backdropVideo.currentTime = 0;
  // 첫 화면은 무음으로 고정하고, 사용자가 로그인 버튼을 누른 뒤에만 클립 음향을 재생합니다.
  backdropVideo.muted = false;
  backdropVideo.volume = clipVolume;
  backdropVideo.play().catch(() => showMain());
});

backdropVideo.addEventListener('timeupdate', () => {
  const elapsed = Math.floor(backdropVideo.currentTime);
  clipTimer.textContent = `00:${String(elapsed).padStart(2, '0')}`;
});

function updateClipAudio() {
  if (Number.isFinite(backdropVideo.duration)) {
    const remaining = backdropVideo.duration - backdropVideo.currentTime;
    const progress = Math.max(0, Math.min(1, remaining / audioFadeDuration));
    // 코사인 이징으로 페이드 시작과 종료 지점의 음량 변화를 부드럽게 만듭니다.
    const easedProgress = 0.5 - (0.5 * Math.cos(Math.PI * progress));
    backdropVideo.volume = clipVolume * easedProgress;
  }
  audioFadeFrame = requestAnimationFrame(updateClipAudio);
}

backdropVideo.addEventListener('play', () => {
  cancelAnimationFrame(audioFadeFrame);
  updateClipAudio();
});

backdropVideo.addEventListener('ended', showMain);

launchScreen.addEventListener('click', () => {
  if (document.body.classList.contains('is-launching')) showMain();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('is-launching')) showMain();
});

// 영상이 지나치게 길어도 10초 뒤에는 대시보드로 전환합니다.
function updateBgmToggle() {
  if (!bgmToggle) return;
  bgmToggle.classList.toggle('is-off', !isBgmEnabled);
  bgmToggle.setAttribute('aria-pressed', String(isBgmEnabled));
  bgmToggle.setAttribute('aria-label', isBgmEnabled ? '배경음악 끄기' : '배경음악 켜기');
  bgmToggle.querySelector('b').textContent = isBgmEnabled ? 'BGM ON' : 'BGM OFF';
}

function playMainBgm() {
  if (!mainBgm || !isBgmEnabled) return;
  mainBgm.volume = mainBgmVolume;
  mainBgm.play().catch(() => {
    isBgmEnabled = false;
    updateBgmToggle();
  });
}

function setBgmEnabled(enabled) {
  isBgmEnabled = enabled;
  updateBgmToggle();
  if (!mainBgm) return;
  if (enabled) playMainBgm();
  else mainBgm.pause();
}

bgmToggle?.addEventListener('click', () => setBgmEnabled(!isBgmEnabled));

backdropVideo.addEventListener('play', () => {
  window.setTimeout(() => {
    if (document.body.classList.contains('is-launching')) showMain();
  }, 10000);
}, { once: true });

function showMain() {
  if (!document.body.classList.contains('is-launching')) return;
  document.body.classList.remove('is-launching');
  document.body.classList.add('is-logged-in');
  cancelAnimationFrame(audioFadeFrame);
  backdropVideo.pause();
  mainScreen.hidden = false;
  playMainBgm();
  startBackgroundCycle();
  startHeroCarousel();
  startRadioComms();
  startAnalyzerBot();
  startFleetFlyby();
  startFighterFormation();
  window.scrollTo({ top: 0 });
}

function startBackgroundCycle() {
  playActiveBackgroundVideo();
  if (backgroundSlides.length < 2 || backgroundCycleTimer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  backgroundCycleTimer = window.setInterval(() => {
    backgroundSlides[activeBackgroundIndex].classList.remove('active');
    activeBackgroundIndex = (activeBackgroundIndex + 1) % backgroundSlides.length;
    backgroundSlides[activeBackgroundIndex].classList.add('active');
    playActiveBackgroundVideo();
  }, backgroundCycleDuration);
}

function playActiveBackgroundVideo() {
  const activeSlide = backgroundSlides[activeBackgroundIndex];
  backgroundVideos.forEach((video) => {
    if (video === activeSlide) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}

function updateHeroCarousel() {
  const banners = [...document.querySelectorAll('.hero-banner')];
  const dots = [...document.querySelectorAll('[data-carousel-index]')];
  if (!banners.length) return;

  banners.forEach((banner, index) => {
    const offset = (index - activeHeroBanner + banners.length) % banners.length;
    const position = offset === 0 ? 'is-active' : offset === 1 ? 'is-right' : offset === banners.length - 1 ? 'is-left' : 'is-hidden';
    banner.className = `hero-banner ${banner.classList.contains('banner-blue') ? 'banner-blue' : banner.classList.contains('banner-moon') ? 'banner-moon' : banner.classList.contains('banner-emerald') ? 'banner-emerald' : 'banner-gas'} ${position}`;
    banner.setAttribute('aria-hidden', position === 'is-active' ? 'false' : 'true');
  });
  dots.forEach((dot, index) => dot.classList.toggle('active', index === activeHeroBanner));
}

function moveHeroCarousel(direction) {
  const count = document.querySelectorAll('.hero-banner').length;
  if (!count) return;
  activeHeroBanner = (activeHeroBanner + direction + count) % count;
  updateHeroCarousel();
}

function startHeroCarousel() {
  if (heroCarouselTimer || !$('#heroCarousel')) return;
  updateHeroCarousel();
  heroCarouselTimer = window.setInterval(() => moveHeroCarousel(1), 6200);
}

document.querySelectorAll('[data-carousel-step]').forEach((button) => {
  button.addEventListener('click', () => moveHeroCarousel(button.dataset.carouselStep === 'next' ? 1 : -1));
});
document.querySelectorAll('[data-carousel-index]').forEach((button) => {
  button.addEventListener('click', () => { activeHeroBanner = Number(button.dataset.carouselIndex); updateHeroCarousel(); });
});

function startRadioComms() {
  if (radioStarted || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  radioStarted = true;
  scheduleRadioPair(2600);
}

// 통신 카드는 표시되는 동안 애널라이저를 완전히 숨기므로, 비표시 시 화면을 자유롭게 횡단합니다.
function startAnalyzerBot() {
  if (analyzerStarted || !analyzerBot || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  analyzerStarted = true;
}

function scheduleAnalyzerBot(delay) {
  window.clearTimeout(analyzerTimer);
  analyzerTimer = window.setTimeout(showAnalyzerBot, delay);
}

function hideAnalyzerBot() {
  if (!analyzerBot) return;
  window.clearTimeout(analyzerTimer);
  window.clearTimeout(analyzerHideTimer);
  analyzerBot.classList.remove('is-dancing');
  if (activeAmbientEffect === 'analyzer') activeAmbientEffect = null;
}

function showAnalyzerBot() {
  if (!analyzerBot || !analyzerStarted) return;
  if (activeAmbientEffect) {
    scheduleAnalyzerBot(5000);
    return;
  }
  activeAmbientEffect = 'analyzer';
  const margin = 12;
  const maxX = Math.max(margin, window.innerWidth - analyzerBot.offsetWidth - margin);
  const maxY = Math.max(margin, window.innerHeight - analyzerBot.offsetHeight - margin);
  const randomPoint = () => ({
    x: Math.round(margin + (Math.random() * (maxX - margin))),
    y: Math.round(margin + (Math.random() * (maxY - margin))),
  });
  const startPoint = randomPoint();
  const middlePoint = randomPoint();
  const endPoint = randomPoint();
  const danceDuration = analyzerDanceMinDuration + Math.floor(Math.random() * (analyzerDanceMaxDuration - analyzerDanceMinDuration + 1));

  analyzerBot.classList.remove('is-dancing');
  analyzerBot.style.setProperty('--analyzer-start-x', `${startPoint.x}px`);
  analyzerBot.style.setProperty('--analyzer-start-y', `${startPoint.y}px`);
  analyzerBot.style.setProperty('--analyzer-middle-x', `${middlePoint.x}px`);
  analyzerBot.style.setProperty('--analyzer-middle-y', `${middlePoint.y}px`);
  analyzerBot.style.setProperty('--analyzer-end-x', `${endPoint.x}px`);
  analyzerBot.style.setProperty('--analyzer-end-y', `${endPoint.y}px`);
  analyzerBot.style.setProperty('--analyzer-duration', `${danceDuration}ms`);

  window.requestAnimationFrame(() => analyzerBot.classList.add('is-dancing'));
  window.clearTimeout(analyzerHideTimer);
  analyzerHideTimer = window.setTimeout(() => {
    analyzerBot.classList.remove('is-dancing');
    activeAmbientEffect = null;
    queueNextCinematicAfterAnalyzer();
  }, danceDuration + 240);
}

function queueNextCinematicAfterAnalyzer() {
  if (fleetFlybyStarted) scheduleFleetFlyby(7000 + Math.floor(Math.random() * 12000));
  else scheduleRadioPair(30000 + Math.floor(Math.random() * 20000));
}

function startFleetFlyby() {
  if (fleetFlybyStarted || !fleetFlyby || !fleetFlybyShip || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  fleetFlybyStarted = true;
}

function scheduleFleetFlyby(delay) {
  window.clearTimeout(fleetFlybyTimer);
  fleetFlybyTimer = window.setTimeout(showFleetFlyby, delay);
}

function randomFleetTop() {
  const viewportHeight = window.innerHeight;
  const reservedTop = viewportHeight * 0.05;
  const fleetHeight = fleetFlyby.getBoundingClientRect().height || Math.min(window.innerWidth * 0.3145, viewportHeight * 0.9);
  const maxTop = Math.max(reservedTop, (viewportHeight * 0.95) - fleetHeight);
  return `${Math.round(reservedTop + (Math.random() * (maxTop - reservedTop)))}px`;
}

function showFleetFlyby() {
  if (!fleetFlyby || !fleetFlybyShip || !fleetFlybyStarted) return;
  if (activeAmbientEffect) {
    scheduleFleetFlyby(5000);
    return;
  }

  activeAmbientEffect = 'fleet';
  const ship = fleetShips[Math.floor(Math.random() * fleetShips.length)];
  const entersFromLeft = Math.random() < 0.5;
  const flybyDuration = 11000;
  // 원본은 우측에서 좌측으로 이동할 때 그대로 사용하고,
  // 좌측에서 우측으로 이동할 때만 Y축 기준으로 좌우 반전합니다.
  const fleetFacing = entersFromLeft ? '-1' : '1';

  fleetFlybyShip.src = ship.src;
  fleetFlyby.style.top = randomFleetTop();
  fleetFlyby.style.left = entersFromLeft ? '-48vw' : '105vw';
  fleetFlyby.style.setProperty('--fleet-facing', fleetFacing);
  fleetFlyby.style.setProperty('--fleet-glow', ship.glow);
  fleetFlyby.style.setProperty('--fleet-duration', `${flybyDuration}ms`);
  fleetFlyby.className = `fleet-flyby ${entersFromLeft ? 'from-left' : 'from-right'} slow-in-fast-out`;

  window.requestAnimationFrame(() => fleetFlyby.classList.add('is-flying'));
  window.clearTimeout(fleetFlybyHideTimer);
  fleetFlybyHideTimer = window.setTimeout(() => {
    fleetFlyby.classList.remove('is-flying');
    activeAmbientEffect = null;
    if (fighterFormationStarted) scheduleFighterFormation(6000 + Math.floor(Math.random() * 11000));
    else scheduleRadioPair(30000 + Math.floor(Math.random() * 20000));
  }, flybyDuration + 180);
}

function startFighterFormation() {
  if (fighterFormationStarted || !fighterFormation || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  fighterFormationStarted = true;
}

function scheduleFighterFormation(delay) {
  window.clearTimeout(fighterFormationTimer);
  fighterFormationTimer = window.setTimeout(showFighterFormation, delay);
}

function showFighterFormation() {
  if (!fighterFormation || !fighterFormationStarted) return;
  if (activeAmbientEffect) {
    scheduleFighterFormation(5000);
    return;
  }

  activeAmbientEffect = 'fighters';
  const count = 1 + Math.floor(Math.random() * 5);
  const model = fighterModels[Math.floor(Math.random() * fighterModels.length)];
  const entersFromLeft = Math.random() < 0.5;
  const diagonalSlope = Math.random() < 0.5 ? -1 : 1;
  const growsTowardTail = Math.random() < 0.5;
  const formationDuration = 1500 + Math.floor(Math.random() * 1501);

  fighterFormation.replaceChildren();
  const verticalSpread = (count - 1) * 6.2;
  const fighterTopMin = 5 + (diagonalSlope < 0 ? verticalSpread : 0);
  const fighterTopMax = 95 - 13 - (diagonalSlope > 0 ? verticalSpread : 0);
  fighterFormation.style.top = `${fighterTopMin + (Math.random() * Math.max(0, fighterTopMax - fighterTopMin))}vh`;
  fighterFormation.style.left = entersFromLeft ? '-25vw' : '105vw';
  fighterFormation.style.setProperty('--fighter-glow', model.glow);
  fighterFormation.style.setProperty('--formation-duration', `${formationDuration}ms`);
  fighterFormation.className = `fighter-formation ${entersFromLeft ? 'from-left' : 'from-right'} formation-diagonal`;

  for (let index = 0; index < count; index += 1) {
    const plane = document.createElement('span');
    const image = document.createElement('img');
    const sizeProgress = count === 1 ? 0 : index / (count - 1);
    const scale = growsTowardTail ? 0.84 + (sizeProgress * 0.2) : 1.04 - (sizeProgress * 0.2);
    const trailingX = (entersFromLeft ? -1 : 1) * index * 10.5;
    const trailingY = diagonalSlope * index * 6.2;

    plane.className = 'fighter-plane';
    plane.style.setProperty('--fighter-x', `${trailingX}vw`);
    plane.style.setProperty('--fighter-y', `${trailingY}vh`);
    plane.style.setProperty('--fighter-scale', scale.toFixed(2));
    image.src = model.src;
    image.alt = '';
    image.style.setProperty('--fighter-facing', entersFromLeft ? '-1' : '1');
    plane.append(image);
    fighterFormation.append(plane);
  }

  window.requestAnimationFrame(() => fighterFormation.classList.add('is-flying'));
  window.clearTimeout(fighterFormationHideTimer);
  fighterFormationHideTimer = window.setTimeout(() => {
    fighterFormation.classList.remove('is-flying');
    fighterFormation.replaceChildren();
    activeAmbientEffect = null;
    scheduleRadioPair(30000 + Math.floor(Math.random() * 20000));
  }, formationDuration + 180);
}

function scheduleRadioPair(delay) {
  window.clearTimeout(radioTimer);
  radioTimer = window.setTimeout(showRadioPair, delay);
}

function randomMessage(messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

function updateRadioCard(side, message) {
  const isTeam = side === 'team';
  const prefix = isTeam ? 'team' : 'rival';
  const card = isTeam ? teamRadioCard : rivalRadioCard;
  const stage = card.querySelector('.radio-portrait-stage');
  $(`#${prefix}SignalType`).textContent = message.label;
  $(`#${prefix}Channel`).textContent = message.channel;
  $(`#${prefix}Source`).textContent = message.source;
  $(`#${prefix}Title`).textContent = message.title;
  $(`#${prefix}Message`).textContent = message.message;
  $(`#${prefix}Portrait`).src = message.portrait;
  $(`#${prefix}Portrait`).alt = message.portraitAlt;
  card.className = `radio-card radio-${side}-card card-${message.type}`;
  stage.className = `radio-portrait-stage scene-${commsScenes[Math.floor(Math.random() * commsScenes.length)]}`;
}

function showRadioSide(side, message) {
  const radioComms = side === 'team' ? radioCommsTeam : radioCommsRival;
  // 카드가 한 장이라도 나타난 순간부터는 애널라이저를 중단합니다.
  hideAnalyzerBot();
  updateRadioCard(side, message);
  radioComms.classList.add('is-visible');
  radioComms.setAttribute('aria-hidden', 'false');
}

function hideRadioPair() {
  radioCommsTeam.classList.remove('is-visible');
  radioCommsRival.classList.remove('is-visible');
  radioCommsTeam.setAttribute('aria-hidden', 'true');
  radioCommsRival.setAttribute('aria-hidden', 'true');
  activeAmbientEffect = null;
  // 두 카드가 모두 사라진 뒤에만 다시 등장 대기열에 넣습니다.
  if (analyzerStarted) scheduleAnalyzerBot(9000 + Math.floor(Math.random() * 16000));
}

function showRadioPair() {
  if (activeAmbientEffect) {
    scheduleRadioPair(5000);
    return;
  }
  activeAmbientEffect = 'radio';
  const teamMessage = randomMessage(teamMessages);
  const rivalMessage = randomMessage(rivalMessages);
  const teamFirst = Math.random() < 0.5;
  const firstSide = teamFirst ? 'team' : 'rival';
  const secondSide = teamFirst ? 'rival' : 'team';
  const firstMessage = teamFirst ? teamMessage : rivalMessage;
  const secondMessage = teamFirst ? rivalMessage : teamMessage;

  showRadioSide(firstSide, firstMessage);
  window.clearTimeout(radioSecondTimer);
  radioSecondTimer = window.setTimeout(() => showRadioSide(secondSide, secondMessage), 760);

  window.clearTimeout(radioHideTimer);
  // 두 번째 카드가 등장한 뒤 약 3초간 함께 노출한 뒤 동시 퇴장합니다.
  radioHideTimer = window.setTimeout(() => {
    hideRadioPair();
  }, 3760);
}

function setView(viewName) {
  document.querySelectorAll('[data-view-panel]').forEach((panel) => panel.classList.toggle('active-view', panel.dataset.viewPanel === viewName));
  document.querySelectorAll('.nav-link').forEach((link) => link.classList.toggle('active', link.dataset.view === viewName));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', (event) => {
  const viewTrigger = event.target.closest('[data-view]');
  if (viewTrigger && mainScreen.contains(viewTrigger)) setView(viewTrigger.dataset.view);
});

$('#shortcutDownload').addEventListener('click', () => {
  const pageUrl = window.location.href;
  const shortcut = `[InternetShortcut]\r\nURL=${pageUrl}\r\n`;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([shortcut], { type: 'application/internet-shortcut' }));
  link.download = 'Yamato Command Center.url';
  link.click();
  URL.revokeObjectURL(link.href);
  showToast('바로가기 파일을 다운로드했습니다.');
});

$('#gameStart')?.addEventListener('click', () => {
  showToast('게임 시작 주소가 연결되면 바로 출격할 수 있습니다.');
});

const supportDialog = $('#supportDialog');
$('#supportButton').addEventListener('click', () => supportDialog.showModal());
$('#supportDialog .dialog-close').addEventListener('click', () => supportDialog.close());
$('.dialog-send').addEventListener('click', () => { supportDialog.close(); showToast('문의가 전송되었습니다. (데모)'); });

const signupDialog = $('#signupDialog');
const signupForm = $('#signupForm');
const signupFeedback = $('#signupFeedback');
const signupPasswordFeedback = $('#signupPasswordFeedback');
const signupIdHint = '영문·숫자 조합 4~16자로 입력해 주세요.';
const signupPassword = signupForm?.elements.signupPassword;
const signupPasswordConfirm = signupForm?.elements.signupPasswordConfirm;

function updateSignupPasswordFeedback() {
  if (!signupPassword || !signupPasswordConfirm) return;
  if (!signupPasswordConfirm.value) {
    signupPasswordFeedback.textContent = '';
    signupPasswordFeedback.classList.remove('is-error');
    return;
  }
  const matches = signupPassword.value === signupPasswordConfirm.value;
  signupPasswordFeedback.textContent = matches ? '입력한 비밀번호와 일치합니다.' : '입력한 비밀번호와 일치하지 않습니다.';
  signupPasswordFeedback.classList.toggle('is-error', !matches);
}

signupPassword?.addEventListener('input', updateSignupPasswordFeedback);
signupPasswordConfirm?.addEventListener('input', updateSignupPasswordFeedback);
$('#signupTrigger')?.addEventListener('click', () => {
  signupFeedback.textContent = signupIdHint;
  signupFeedback.classList.remove('is-error');
  signupPasswordFeedback.textContent = '';
  signupPasswordFeedback.classList.remove('is-error');
  signupDialog.showModal();
});
$('#signupClose')?.addEventListener('click', () => signupDialog.close());
$('#duplicateCheck')?.addEventListener('click', () => {
  const signupId = new FormData(signupForm).get('signupId').trim();
  signupFeedback.textContent = signupId ? `'${signupId}' 아이디는 사용할 수 있습니다. (데모)` : '확인할 아이디를 입력하세요.';
  signupFeedback.classList.toggle('is-error', !signupId);
});
signupForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(signupForm);
  if (formData.get('signupPassword') !== formData.get('signupPasswordConfirm')) {
    signupPasswordFeedback.textContent = '비밀번호 확인이 일치하지 않습니다.';
    signupPasswordFeedback.classList.add('is-error');
    return;
  }
  signupDialog.close();
  signupForm.reset();
  showToast('승무원 등록 요청이 전송되었습니다. (데모)');
});
signupDialog?.addEventListener('click', (event) => {
  if (event.target === signupDialog) signupDialog.close();
});

const noticeDialog = $('#noticeDialog');
const noticeDialogTitle = $('#noticeDialogTitle');
const noticeDialogPriority = $('#noticeDialogPriority');
const noticeDialogDate = $('#noticeDialogDate');
const noticeDialogBody = $('#noticeDialogBody');
document.addEventListener('click', (event) => {
  const noticeTrigger = event.target.closest('[data-notice-index]');
  if (!noticeTrigger) return;
  const notice = notices[Number(noticeTrigger.dataset.noticeIndex)];
  if (!notice) return;
  noticeDialogPriority.textContent = `${notice.priority} // TRANSMISSION`;
  noticeDialogTitle.textContent = notice.title;
  noticeDialogDate.textContent = notice.date;
  noticeDialogBody.textContent = notice.content;
  noticeDialog.showModal();
});
$('#noticeDialogClose')?.addEventListener('click', () => noticeDialog.close());
$('#noticeDialogConfirm')?.addEventListener('click', () => noticeDialog.close());
noticeDialog?.addEventListener('click', (event) => {
  if (event.target === noticeDialog) noticeDialog.close();
});

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

renderData();
