// ======================
// 티비 스포캠 JavaScript (모바일 자동화 + 인프라 대시보드 언어 + 서비스 탭 수정)
// ======================

// 🔤 다국어 번역 데이터 (기존 데이터에 인프라 대시보드 키 포함되어 있음)
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

// 🌐 언어 설정 함수 (전역 적용)
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

// 📱 모바일 전용 헤더 임시 추가 (DOM 생성)
function addMobileHeader() {
  if (window.innerWidth <= 768) {
    let mobileHeader = document.getElementById('mobile-header');
    if (!mobileHeader) {
      mobileHeader = document.createElement('header');
      mobileHeader.id = 'mobile-header';
      mobileHeader.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; height: 50px; background: #1a1a1a; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; z-index: 9999;
      `;
      const logo = document.createElement('div');
      logo.textContent = 'TVSPOTCAM';
      logo.style.color = '#fff; font-weight: bold;';
      const menuBtn = document.createElement('button');
      menuBtn.textContent = '☰';
      menuBtn.style.cssText = 'background: none; border: none; color: #fff; font-size: 20px;';
      mobileHeader.appendChild(logo);
      mobileHeader.appendChild(menuBtn);
      document.body.insertBefore(mobileHeader, document.body.firstChild);
    }
  }
}

// 📊 인프라 대시보드 - 서비스 의존성 뷰 선택 버튼 기능 수정
function initServiceDepsTabs() {
  const tabButtons = document.querySelectorAll('.service-map-panel .view-controls .view-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // TODO: 추후 이 부분에서 LIVE/HEALTH/PERF 상태에 따른 컨텐츠 변경 로직 구현 가능
    });
  });
}

// ⏰ 실시간 시계, 대시보드, 로그 등 기존 함수들 (기존 코드 그대로 사용)
function updateClock() { /* ... */ }
function updateMetrics() { /* ... */ }
function renderLogs() { /* ... */ }
function addRandomLog() { /* ... */ }
function initScrollEffects() { /* ... */ }
function initHud() { /* ... */ }

// 🚀 전체 초기화
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM 로드 완료. JS 실행 시작');

  // 1. 언어 설정
  const savedLang = localStorage.getItem('selectedLanguage') || 'ko';
  setLanguage(savedLang);

  const langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.addEventListener('change', (e) => setLanguage(e.target.value));

  // 2. 모바일 헤더 임시 추가
  addMobileHeader();

  // 3. 인프라 대시보드 서비스 의존성 탭 기능 수정
  initServiceDepsTabs();

  // 4. 기타 초기화 (헤더 스크롤, 대시보드, 시계 등)
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      initScrollEffects();
      updateClock();
      setInterval(updateClock, 1000);
      initHud();
    }, 1000);
  }

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
