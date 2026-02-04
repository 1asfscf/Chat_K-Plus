// ======================
// 티비 스포캠 JavaScript (최종: 모바일 헤더, 인프라 번역, 서비스 탭, 애니메이션 수정)
// ======================

const translations = {
  ko: {
    nav_home: "홈", nav_live: "라이브", nav_vod: "VOD", nav_community: "커뮤니티", nav_event: "이벤트",
    search_placeholder: "검색어를 입력하세요...", login: "로그인",
    hero_title: "모든 경기를<br>완벽하게 담다", hero_desc: "티비 스포캠은 팬을 위해 탄생했습니다.",
    watch_now: "지금 시청하기", learn_more: "더 알아보기",
    latest_updates: "최신 업데이트", view_all: "전체 보기 &rarr;",
    views: "조회수", hours_ago: "시간 전", live_viewers: "실시간 시청자", now: "지금", yesterday: "어제", days_ago: "일 전",
    card1_title: "손흥민 시즌 20호 골 모음", card2_title: "2023 KBO Korean Series Game 5",
    card3_title: "르브론 제임스 분석", card4_title: "감독 인터뷰",
    infra_title: "INFRASTRUCTURE MONITORING", cluster_label: "CLUSTER:", region_label: "REGION:", status_label: "STATUS:",
    maintenance_status: "MAINTENANCE MODE", uptime_label: "UPTIME", api_label: "API", db_label: "DB", cdn_label: "CDN",
    req_per_sec: "REQ/S", latency_label: "LATENCY", maintenance_in_progress: "SYSTEM MAINTENANCE IN PROGRESS",
    system_metrics: "SYSTEM METRICS", updated_just_now: "Updated just now", cpu_util: "CPU UTILIZATION", memory_usage: "MEMORY USAGE",
    network_io: "NETWORK I/O", disk_io: "DISK I/O", service_deps: "SERVICE DEPENDENCIES", healthy_status: "Healthy", degraded_status: "Degraded",
    recent_alerts: "RECENT ALERTS", alert1_title: "High CPU Load on worker-03", alert1_time: "2 minutes ago",
    alert2_title: "Database connection pool 80% full", alert2_time: "15 minutes ago", alert3_title: "Scheduled maintenance started", alert3_time: "1 hour ago",
    live_logs: "LIVE LOGS", pause_btn: "PAUSE", log1_msg: "Health check passed", log2_msg: "User session created", log3_msg: "Query optimization completed",
    footer_desc: "스포츠의 모든 순간을 당신의 눈앞에 선명하게 전합니다.",
    quick_links: "바로가기", terms: "이용약관", privacy: "개인정보처리방침", youth: "청소년보호정책", winners: "이벤트 당첨자 발표",
    support: "고객센터", support_hours: "평일 09:00 - 18:00", lunch_break: "(점심시간 12:00 - 13:00, 주말/공휴일 휴무)",
    newsletter: "뉴스레터 구독", newsletter_desc: "최신 소식과 이벤트 정보를 가장 먼저 받아보세요.", email_placeholder: "이메일 주소 입력", subscribe_btn: "구독",
    copyright: "© 2023 TV SpotCam Inc. All Rights Reserved.", business_info: "사업자정보", partnership: "제휴문의", guide: "이용가이드",
    current_time: "현재 시간", uptime_value: "가동 시간"
  },
  en: {
    nav_home: "Home", nav_live: "Live", nav_vod: "VOD", nav_community: "Community", nav_event: "Events",
    search_placeholder: "Enter search term...", login: "Login",
    hero_title: "Capture Every Match<br>Perfectly", hero_desc: "Born for fans.",
    watch_now: "Watch Now", learn_more: "Learn More",
    latest_updates: "Latest Updates", view_all: "View All &rarr;",
    views: "Views", hours_ago: "hours ago", live_viewers: "Live Viewers", now: "Now", yesterday: "Yesterday", days_ago: "days ago",
    card1_title: "Son Heung-min's 20th Goal Compilation", card2_title: "2023 KBO Korean Series Game 5",
    card3_title: "LeBron James Analysis", card4_title: "Coach Interview",
    infra_title: "INFRASTRUCTURE MONITORING", cluster_label: "CLUSTER:", region_label: "REGION:", status_label: "STATUS:",
    maintenance_status: "MAINTENANCE MODE", uptime_label: "UPTIME", api_label: "API", db_label: "DB", cdn_label: "CDN",
    req_per_sec: "REQ/S", latency_label: "LATENCY", maintenance_in_progress: "SYSTEM MAINTENANCE IN PROGRESS",
    system_metrics: "SYSTEM METRICS", updated_just_now: "Updated just now", cpu_util: "CPU UTILIZATION", memory_usage: "MEMORY USAGE",
    network_io: "NETWORK I/O", disk_io: "DISK I/O", service_deps: "SERVICE DEPENDENCIES", healthy_status: "Healthy", degraded_status: "Degraded",
    recent_alerts: "RECENT ALERTS", alert1_title: "High CPU Load on worker-03", alert1_time: "2 minutes ago",
    alert2_title: "Database connection pool 80% full", alert2_time: "15 minutes ago", alert3_title: "Scheduled maintenance started", alert3_time: "1 hour ago",
    live_logs: "LIVE LOGS", pause_btn: "PAUSE", log1_msg: "Health check passed", log2_msg: "User session created", log3_msg: "Query optimization completed",
    footer_desc: "We deliver every moment of sports vividly to your eyes.",
    quick_links: "Quick Links", terms: "Terms of Service", privacy: "Privacy Policy", youth: "Youth Policy", winners: "Event Winners",
    support: "Support", support_hours: "Weekdays 09:00 - 18:00", lunch_break: "(Lunch 12:00 - 13:00, Closed on weekends/holidays)",
    newsletter: "Newsletter Subscription", newsletter_desc: "Be the first to receive the latest news and event information.", email_placeholder: "Enter email address", subscribe_btn: "Subscribe",
    copyright: "© 2023 TV SpotCam Inc. All Rights Reserved.", business_info: "Business Info", partnership: "Partnership", guide: "Guide",
    current_time: "Current Time", uptime_value: "Uptime"
  }
};

// 1. 언어 설정
function setLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang-key]').forEach(el => {
    const key = el.getAttribute('data-lang-key');
    if (translations[lang] && translations[lang][key]) {
      if (el.innerHTML.includes('<br>')) el.innerHTML = translations[lang][key];
      else el.textContent = translations[lang][key];
    }
  });
  localStorage.setItem('selectedLanguage', lang);
  const sel = document.getElementById('langSelect');
  if (sel) sel.value = lang;
}

// 2. 모바일 헤더 애니메이션 (IN/OUT 스크롤 제어)
function initMobileHeaderAnimation() {
  const header = document.getElementById('header');
  if (!header) return;
  let lastScroll = 0;
  let isHidden = false;
  window.addEventListener('scroll', () => {
    const current = window.pageYOffset;
    if (current > 50) {
      header.classList.add('scrolled');
      if (current > 200 && current > lastScroll) {
        header.classList.add('hidden');
        isHidden = true;
      } else {
        header.classList.remove('hidden');
        isHidden = false;
      }
    } else {
      header.classList.remove('scrolled', 'hidden');
      isHidden = false;
    }
    lastScroll = current;
  });
}

// 3. 서비스 의존성 탭 (LIVE / HEALTH / PERF) 기능 수정
function initServiceDepsTabs() {
  const tabs = document.querySelectorAll('.service-map-panel .view-controls .view-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

// 4. 기타 기능들 (실시간 시계, 대시보드, 로그 등)
function updateClock() {
  const now = new Date();
  document.getElementById('currentTime')?.textContent = now.toISOString().slice(11, 19) + ' UTC';
}

function updateMetrics() { /* Dummy */ }
function renderLogs() { /* Dummy */ }
function addRandomLog() { /* Dummy */ }
function initScrollEffects() { /* Dummy */ }
function initHud() {
  updateMetrics();
  renderLogs();
  setInterval(() => { updateMetrics(); addRandomLog(); }, 2000);
}

// 5. 전체 초기화
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 로드 완료');

  // 기본 언어 한국어
  const lang = localStorage.getItem('selectedLanguage') || 'ko';
  setLanguage(lang);

  const langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.addEventListener('change', (e) => setLanguage(e.target.value));

  // 모바일 헤더 애니메이션
  initMobileHeaderAnimation();

  // 서비스 의존성 탭
  initServiceDepsTabs();

  // 초기화
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
        const perf = performance.getEntriesByType('navigation')[0];
        if (perf?.loadEventEnd && perf?.navigationStart) {
          console.log(`로드 시간: ${perf.loadEventEnd - perf.navigationStart}ms`);
        }
      }, 0);
    });
  }
});
