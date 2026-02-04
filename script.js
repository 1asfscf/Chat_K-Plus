// ======================
// 티비 스포캠 JavaScript (모바일 자동화 강화 포함)
// ======================

// 🔤 다국어 지원 데이터
const translations = {
  ko: {
    nav_home: "홈", nav_live: "라이브", nav_vod: "VOD", nav_community: "커뮤니티", nav_event: "이벤트",
    search_placeholder: "검색어를 입력하세요...", login: "로그인",
    hero_title: "모든 경기를<br>완벽하게 담다", hero_desc: "티비 스포캠은 팬을 위해 탄생했습니다. 4K 고화질 영상, 실시간 스코어, 그리고 분석된 데이터까지. 스포츠 감동을 놓치지 마세요.",
    watch_now: "지금 시청하기", learn_more: "더 알아보기",
    latest_updates: "최신 업데이트", view_all: "전체 보기 &rarr;",
    views: "조회수", hours_ago: "시간 전", live_viewers: "실시간 시청자", now: "지금", yesterday: "어제", days_ago: "일 전",
    card1_title: "손흥민 시즌 20호 골 모음. 드디어 득점왕 등극!", card2_title: "2023 KBO Korean Series Game 5 - 롯데 vs KIA",
    card3_title: "르브론 제임스의 경기 운영 패턴 완벽 분석", card4_title: "감독 인터뷰: \"다음 경기는 반드시 이기겠다\"",
    infra_title: "INFRASTRUCTURE MONITORING", cluster_label: "CLUSTER:", region_label: "REGION:", status_label: "STATUS:",
    maintenance_status: "MAINTENANCE MODE", uptime_label: "UPTIME", api_label: "API", db_label: "DB", cdn_label: "CDN",
    req_per_sec: "REQ/S", latency_label: "LATENCY", maintenance_in_progress: "SYSTEM MAINTENANCE IN PROGRESS",
    system_metrics: "SYSTEM METRICS", updated_just_now: "Updated just now", cpu_util: "CPU UTILIZATION", memory_usage: "MEMORY USAGE",
    network_io: "NETWORK I/O", disk_io: "DISK I/O", service_deps: "SERVICE DEPENDENCIES", healthy_status: "Healthy", degraded_status: "Degraded",
    recent_alerts: "RECENT ALERTS", alert1_title: "High CPU Load on worker-03", alert1_time: "2 minutes ago",
    alert2_title: "Database connection pool 80% full", alert2_time: "15 minutes ago", alert3_title: "Scheduled maintenance started", alert3_time: "1 hour ago",
    live_logs: "LIVE LOGS", pause_btn: "PAUSE", log1_msg: "Health check passed", log2_msg: "User session created: user_88472", log3_msg: "Query optimization completed",
    footer_desc: "스포츠의 모든 순간을 당신의 눈앞에 선명하게 전합니다.<br>전 세계 팬들을 위해 설계된 최고의 스포츠 플랫폼.",
    quick_links: "바로가기", terms: "이용약관", privacy: "개인정보처리방침", youth: "청소년보호정책", winners: "이벤트 당첨자 발표",
    support: "고객센터", support_hours: "평일 09:00 - 18:00", lunch_break: "(점심시간 12:00 - 13:00, 주말/공휴일 휴무)",
    newsletter: "뉴스레터 구독", newsletter_desc: "최신 소식과 이벤트 정보를 가장 먼저 받아보세요.", email_placeholder: "이메일 주소 입력", subscribe_btn: "구독",
    copyright: "© 2023 TV SpotCam Inc. All Rights Reserved.", business_info: "사업자정보", partnership: "제휴문의", guide: "이용가이드"
  },
  en: {
    nav_home: "Home", nav_live: "Live", nav_vod: "VOD", nav_community: "Community", nav_event: "Events",
    search_placeholder: "Enter search term...", login: "Login",
    hero_title: "Capture Every Match<br>Perfectly", hero_desc: "Born for fans. TV SpotCam offers 4K video, real-time scores, and analyzed data. Never miss the thrill of sports.",
    watch_now: "Watch Now", learn_more: "Learn More",
    latest_updates: "Latest Updates", view_all: "View All &rarr;",
    views: "Views", hours_ago: "hours ago", live_viewers: "Live Viewers", now: "Now", yesterday: "Yesterday", days_ago: "days ago",
    card1_title: "Son Heung-min's 20th Goal Compilation. Finally a Top Scorer!", card2_title: "2023 KBO Korean Series Game 5 - Lotte vs KIA",
    card3_title: "Perfect Analysis of LeBron James' Game Management Pattern", card4_title: "Coach Interview: \"We Will Win the Next Match\"",
    infra_title: "INFRASTRUCTURE MONITORING", cluster_label: "CLUSTER:", region_label: "REGION:", status_label: "STATUS:",
    maintenance_status: "MAINTENANCE MODE", uptime_label: "UPTIME", api_label: "API", db_label: "DB", cdn_label: "CDN",
    req_per_sec: "REQ/S", latency_label: "LATENCY", maintenance_in_progress: "SYSTEM MAINTENANCE IN PROGRESS",
    system_metrics: "SYSTEM METRICS", updated_just_now: "Updated just now", cpu_util: "CPU UTILIZATION", memory_usage: "MEMORY USAGE",
    network_io: "NETWORK I/O", disk_io: "DISK I/O", service_deps: "SERVICE DEPENDENCIES", healthy_status: "Healthy", degraded_status: "Degraded",
    recent_alerts: "RECENT ALERTS", alert1_title: "High CPU Load on worker-03", alert1_time: "2 minutes ago",
    alert2_title: "Database connection pool 80% full", alert2_time: "15 minutes ago", alert3_title: "Scheduled maintenance started", alert3_time: "1 hour ago",
    live_logs: "LIVE LOGS", pause_btn: "PAUSE", log1_msg: "Health check passed", log2_msg: "User session created: user_88472", log3_msg: "Query optimization completed",
    footer_desc: "We deliver every moment of sports vividly to your eyes.<br>The ultimate sports platform designed for fans worldwide.",
    quick_links: "Quick Links", terms: "Terms of Service", privacy: "Privacy Policy", youth: "Youth Policy", winners: "Event Winners",
    support: "Support", support_hours: "Weekdays 09:00 - 18:00", lunch_break: "(Lunch 12:00 - 13:00, Closed on weekends/holidays)",
    newsletter: "Newsletter Subscription", newsletter_desc: "Be the first to receive the latest news and event information.", email_placeholder: "Enter email address", subscribe_btn: "Subscribe",
    copyright: "© 2023 TV SpotCam Inc. All Rights Reserved.", business_info: "Business Info", partnership: "Partnership", guide: "Guide"
  }
};

// 🌐 언어 설정 함수
function setLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang-key]').forEach(element => {
    const key = element.getAttribute('data-lang-key');
    if (translations[lang] && translations[lang][key]) {
      if (element.innerHTML.includes('<br>')) element.innerHTML = translations[lang][key];
      else element.textContent = translations[lang][key];
    }
  });
  localStorage.setItem('selectedLanguage', lang);
  const langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.value = lang;
}

// 📱 모바일 최적화 및 자동화 함수
function initMobileOptimization() {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // 1. 헤더 자동 숨김 (스크롤 시)
    let lastScroll = 0;
    const header = document.getElementById('header');
    if (header) {
      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
        if (currentScroll > lastScroll && currentScroll > 200) header.classList.add('hidden');
        else header.classList.remove('hidden');
        lastScroll = currentScroll;
      });
    }

    // 2. 터치 친화적인 버튼 크기 확대
    const buttons = document.querySelectorAll('.btn, .btn-icon, .nav-link');
    buttons.forEach(btn => {
      btn.style.minHeight = '44px'; // Apple 권장 최소 터치 크기
      btn.style.minWidth = '44px';
    });

    // 3. 비디오 카드 클릭 최적화 (터치 피드백)
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
      card.addEventListener('touchstart', () => card.style.transform = 'scale(0.98)');
      card.addEventListener('touchend', () => card.style.transform = '');
    });

    // 4. 로그인 버튼 자동 포커스 (모바일에서 입력 편의성)
    const loginBtn = document.querySelector('.btn-primary[data-lang-key="login"]');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        alert('모바일에서는 로그인 팝업 또는 외부 연동이 필요합니다.');
      });
    }
  }
}

// ⏰ 실시간 시계
function updateClock() {
  const now = new Date();
  const timeString = now.toISOString().substr(11, 8) + ' UTC';
  const timeElement = document.getElementById('currentTime');
  if (timeElement) timeElement.textContent = timeString;
}

// 📊 대시보드 메트릭 업데이트
function updateMetrics() {
  const cpu = Math.floor(Math.random() * 30) + 20;
  const mem = Math.floor(Math.random() * 20) + 60;
  const net = (Math.random() * 5).toFixed(1);
  const disk = Math.floor(Math.random() * 30) + 20;

  const cpuValue = document.querySelector('.metric-card:nth-child(1) .metric-value');
  const cpuBar = document.querySelector('.metric-card:nth-child(1) .bar-fill.cpu');
  if (cpuValue) cpuValue.textContent = `${cpu}%`;
  if (cpuBar) cpuBar.style.width = `${cpu}%`;

  const memValue = document.querySelector('.metric-card:nth-child(2) .metric-value');
  const memBar = document.querySelector('.metric-card:nth-child(2) .bar-fill.memory');
  if (memValue) memValue.textContent = `${mem}%`;
  if (memBar) memBar.style.width = `${mem}%`;

  const netValue = document.querySelector('.metric-card:nth-child(3) .metric-value');
  const netBar = document.querySelector('.metric-card:nth-child(3) .bar-fill.network');
  if (netValue) netValue.textContent = `${net} Gbps`;
  if (netBar) netBar.style.width = `${Math.floor(net / 5 * 100)}%`;

  const diskValue = document.querySelector('.metric-card:nth-child(4) .metric-value');
  const diskBar = document.querySelector('.metric-card:nth-child(4) .bar-fill.disk');
  if (diskValue) diskValue.textContent = `${disk * 20} MB/s`;
  if (diskBar) diskBar.style.width = `${disk}%`;
}

// 📜 로그 관리
function renderLogs() {
  const logContent = document.querySelector('.log-content');
  if (!logContent) return;
  logContent.innerHTML = '';
  const initialLogs = [
    { time: '14:23:01', service: 'API', msg: 'Health check passed' },
    { time: '14:22:58', service: 'AUTH', msg: 'User session created: user_88472' },
    { time: '14:22:55', service: 'DB', msg: 'Query optimization completed' }
  ];
  initialLogs.forEach(log => {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `<span class="log-time">${log.time}</span><span class="log-service">[${log.service}]</span><span class="log-message">${log.msg}</span>`;
    logContent.appendChild(logEntry);
  });
}

function addRandomLog() {
  const logContent = document.querySelector('.log-content');
  if (!logContent) return;
  const services = ['API', 'AUTH', 'DB', 'STREAMING', 'CACHE'];
  const messages = [
    'User login successful', 'Cache cleared', 'New video uploaded',
    'Latency spike detected', 'CDN cache refreshed', 'Auth token issued'
  ];
  const randomService = services[Math.floor(Math.random() * services.length)];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const now = new Date();
  const timeString = now.toTimeString().substr(0, 8);

  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.innerHTML = `<span class="log-time">${timeString}</span><span class="log-service">[${randomService}]</span><span class="log-message">${randomMessage}</span>`;
  logContent.prepend(logEntry);
  if (logContent.children.length > 10) logContent.removeChild(logContent.lastChild);
}

// 🚀 초기화 함수
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM이 완전히 로드되었습니다. JS 실행 시작...');

  // 1. 언어 설정
  const savedLang = localStorage.getItem('selectedLanguage') || 'ko';
  setLanguage(savedLang);

  const langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.addEventListener('change', (e) => setLanguage(e.target.value));

  // 2. 로더 숨김 후 초기화
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      initMobileOptimization(); // 모바일 최적화
      initScrollEffects(); // 헤더 스크롤 효과
      updateClock(); // 시계
      setInterval(updateClock, 1000);
      initHud(); // 대시보드
    }, 1000);
  }

  // 3. 성능 측정
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData && perfData.loadEventEnd && perfData.navigationStart) {
          const loadTime = perfData.loadEventEnd - perfData.navigationStart;
          console.log(`페이지 로드 시간: ${loadTime}ms`);
        }
      }, 0);
    });
  }
});

// 📜 추가 기능 함수들 (기존 코드 재사용)
function initScrollEffects() {
  const header = document.getElementById('header');
  if (!header) return;
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    if (currentScroll > lastScroll && currentScroll > 200) header.classList.add('hidden');
    else header.classList.remove('hidden');
    lastScroll = currentScroll;
  });
}

function initHud() {
  console.log('HUD 대시보드 초기화');
  updateMetrics();
  renderLogs();
  setInterval(() => { updateMetrics(); addRandomLog(); }, 2000);
}
