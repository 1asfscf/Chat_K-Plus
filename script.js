// ======================
// 티비 스포캠 JavaScript (수정 완료본)
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
    current_time: "현재 시간", uptime_value: "가동 시간",
    live: "LIVE", health: "HEALTH", perf: "PERF"
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
    current_time: "Current Time", uptime_value: "Uptime",
    live: "LIVE", health: "HEALTH", perf: "PERF"
  }
};

// 상태 관리
let isLogsPaused = false;
let currentLang = 'ko';

// 1. 언어 설정
function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  
  document.querySelectorAll('[data-lang-key]').forEach(el => {
    const key = el.getAttribute('data-lang-key');
    if (translations[lang] && translations[lang][key]) {
      // HTML 태그가 포함된 경우 innerHTML 사용, 아니면 textContent
      if (translations[lang][key].includes('<') || el.hasAttribute('data-html-allowed')) {
        el.innerHTML = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
  
  localStorage.setItem('selectedLanguage', lang);
  const sel = document.getElementById('langSelect');
  if (sel) sel.value = lang;
}

// 2. 모바일 헤더 및 메뉴 기능
function initMobileFeatures() {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMobile = document.getElementById('navMobile');
  let lastScroll = 0;
  let isHidden = false;

  // 스크롤에 따른 헤더 숨김/표시
  window.addEventListener('scroll', () => {
    const current = window.pageYOffset;
    
    if (current > 50) {
      header.classList.add('scrolled');
      if (current > 200 && current > lastScroll && !navMobile.classList.contains('active')) {
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

  // 모바일 메뉴 토글
  if (mobileToggle && navMobile) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMobile.classList.toggle('active');
      
      // 메뉴 열릴 때 헤더는 보이게
      if (navMobile.classList.contains('active')) {
        header.classList.remove('hidden');
      }
    });

    // 모바일 메뉴 링크 클릭 시 닫기
    navMobile.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMobile.classList.remove('active');
      });
    });
  }
}

// 3. 서비스 의존성 탭 기능
function initServiceDepsTabs() {
  const tabs = document.querySelectorAll('.view-controls .view-btn');
  const serviceMap = document.getElementById('serviceMap');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 활성 탭 전환
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // 뷰 모드 변경 (시각적 피드백)
      const viewMode = tab.getAttribute('data-view');
      if (serviceMap) {
        serviceMap.setAttribute('data-view', viewMode);
        
        // 애니메이션 효과
        serviceMap.style.opacity = '0.5';
        setTimeout(() => {
          serviceMap.style.opacity = '1';
        }, 200);
      }
    });
  });
}

// 4. 실시간 시계
function updateClock() {
  const now = new Date();
  const timeString = now.toISOString().slice(11, 19) + ' UTC';
  const currentTimeEl = document.getElementById('currentTime');
  if (currentTimeEl) {
    currentTimeEl.textContent = timeString;
  }
}

// 5. 대시보드 메트릭 업데이트
function updateMetrics() {
  // CPU (20-60% 사이 랜덤)
  const cpu = Math.floor(20 + Math.random() * 40);
  const cpuEl = document.getElementById('cpuValue');
  const cpuBar = document.getElementById('cpuBar');
  if (cpuEl) cpuEl.textContent = cpu + '%';
  if (cpuBar) cpuBar.style.width = cpu + '%';
  
  // Memory (40-80% 사이 랜덤)
  const memory = Math.floor(40 + Math.random() * 40);
  const memEl = document.getElementById('memoryValue');
  const memBar = document.getElementById('memoryBar');
  if (memEl) memEl.textContent = memory + '%';
  if (memBar) memBar.style.width = memory + '%';
  
  // Network (0.5-2.0 GB/s)
  const network = (0.5 + Math.random() * 1.5).toFixed(1);
  const netEl = document.getElementById('networkValue');
  const netBar = document.getElementById('networkBar');
  if (netEl) netEl.textContent = network + ' GB/s';
  if (netBar) netBar.style.width = (network / 2 * 100) + '%';
  
  // Disk (100-400 MB/s)
  const disk = Math.floor(100 + Math.random() * 300);
  const diskEl = document.getElementById('diskValue');
  const diskBar = document.getElementById('diskBar');
  if (diskEl) diskEl.textContent = disk + ' MB/s';
  if (diskBar) diskBar.style.width = (disk / 500 * 100) + '%';
  
  // Request/sec (2000-3500)
  const reqs = Math.floor(2000 + Math.random() * 1500);
  const reqEl = document.getElementById('reqPerSec');
  if (reqEl) reqEl.textContent = reqs.toLocaleString();
  
  // Latency (20-80ms)
  const latency = Math.floor(20 + Math.random() * 60);
  const latEl = document.getElementById('latencyValue');
  if (latEl) latEl.textContent = latency + 'ms';
  
  // Uptime (99.9-99.99%)
  const uptime = (99.9 + Math.random() * 0.09).toFixed(2);
  const upEl = document.getElementById('uptimeValue');
  if (upEl) upEl.textContent = uptime + '%';
  
  // Maintenance progress (천천히 증가)
  const progressEl = document.getElementById('maintenanceProgress');
  const progressPercentEl = document.getElementById('maintenancePercent');
  if (progressEl && progressPercentEl) {
    let currentProgress = parseInt(progressEl.style.width) || 73;
    if (currentProgress < 100 && Math.random() > 0.7) {
      currentProgress += 1;
      progressEl.style.width = currentProgress + '%';
      progressPercentEl.textContent = currentProgress + '%';
    }
  }
}

// 6. 로그 스트림 기능
const logServices = ['API', 'DB', 'CDN', 'AUTH', 'CACHE', 'WORKER'];
const logMessages = [
  'Health check passed',
  'Request processed successfully',
  'Cache invalidated',
  'Database query optimized',
  'User authentication successful',
  'Load balancer redistributed traffic',
  'SSL certificate renewed',
  'Backup completed',
  'Memory garbage collection executed'
];

function addRandomLog() {
  if (isLogsPaused) return;
  
  const logContent = document.getElementById('logContent');
  if (!logContent) return;
  
  const now = new Date();
  const time = now.toISOString().slice(11, 19);
  const service = logServices[Math.floor(Math.random() * logServices.length)];
  const message = logMessages[Math.floor(Math.random() * logMessages.length)];
  
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.innerHTML = `
    <span class="log-time">${time}</span>
    <span class="log-service">${service}</span>
    <span class="log-message">${message}</span>
  `;
  
  logContent.insertBefore(logEntry, logContent.firstChild);
  
  // 최대 50개 로그 유지
  while (logContent.children.length > 50) {
    logContent.removeChild(logContent.lastChild);
  }
}

function initLogStream() {
  const pauseBtn = document.getElementById('pauseLogs');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isLogsPaused = !isLogsPaused;
      pauseBtn.textContent = isLogsPaused ? 'RESUME' : 'PAUSE';
      pauseBtn.style.background = isLogsPaused ? 'var(--hud-warn)' : 'rgba(255,255,255,0.1)';
    });
  }
}

// 7. 스크롤 애니메이션
function initScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // 카드에 애니메이션 적용
  document.querySelectorAll('.video-card, .metric-card, .service-node, .alert-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(el);
  });
}

// 8. HUD 초기화
function initHud() {
  updateMetrics();
  setInterval(() => {
    updateMetrics();
    addRandomLog();
  }, 2000);
  
  initLogStream();
}

// 9. 전체 초기화
document.addEventListener('DOMContentLoaded', () => {
  console.log('TV SpotCam initialized');
  
  // 언어 설정
  const savedLang = localStorage.getItem('selectedLanguage') || 'ko';
  setLanguage(savedLang);
  
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
  }
  
  // 모바일 기능 초기화
  initMobileFeatures();
  
  // 서비스 탭 초기화
  initServiceDepsTabs();
  
  // 로더 제거 및 초기화
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      initScrollEffects();
      updateClock();
      setInterval(updateClock, 1000);
      initHud();
    }, 1200);
  } else {
    // 로더가 없는 경우 바로 초기화
    initScrollEffects();
    updateClock();
    setInterval(updateClock, 1000);
    initHud();
  }
  
  // 성능 측정
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perf = performance.getEntriesByType('navigation')[0];
        if (perf?.loadEventEnd && perf?.navigationStart) {
          console.log(`Page load time: ${Math.round(perf.loadEventEnd - perf.navigationStart)}ms`);
        }
      }, 0);
    });
  }
});
