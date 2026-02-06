// ======================
// 티비 스포캠 JavaScript (원본 구조 유지)
// ======================

const translations = {
  ko: {
    // 기존 인덱스 페이지 번역
    nav_home: "홈", nav_live: "라이브", nav_vod: "VOD", nav_community: "커뮤니티", nav_event: "이벤트",
    search_placeholder: "검색어를 입력하세요...", login: "로그인",
    hero_title: "모든 경기를<br>완벽하게 담다", hero_desc: "티비 스포캠은 팬을 위해 탄생했습니다.",
    watch_now: "지금 시청하기", learn_more: "더 알아보기",
    latest_updates: "최신 업데이트", view_all: "전체 보기 →",
    views: "조회수", hours_ago: "시간 전", live_viewers: "실시간 시청자", now: "지금", yesterday: "어제", days_ago: "일 전",
    card1_title: "손흥민 시즌 20호 골 모음", card2_title: "2023 KBO Korean Series Game 5",
    card3_title: "르브론 제임스 분석", card4_title: "감독 인터뷰",
    infra_title: "인프라 모니터링", cluster_label: "클러스터:", region_label: "지역:", status_label: "상태:",
    maintenance_status: "점검 모드", uptime_label: "가동 시간", api_label: "API", db_label: "DB", cdn_label: "CDN",
    req_per_sec: "요청/초", latency_label: "지연 시간", maintenance_in_progress: "시스템 점검 진행 중",
    system_metrics: "시스템 메트릭", updated_just_now: "방금 업데이트됨", cpu_util: "CPU 사용률", memory_usage: "메모리 사용량",
    network_io: "네트워크 I/O", disk_io: "디스크 I/O", service_deps: "서비스 의존성", healthy_status: "정상", degraded_status: "성능 저하",
    recent_alerts: "최근 알림", alert1_title: "worker-03 높은 CPU 부하", alert1_time: "2분 전",
    alert2_title: "데이터베이스 연결 풀 80% 사용", alert2_time: "15분 전", alert3_title: "예정된 점검 시작됨", alert3_time: "1시간 전",
    live_logs: "실시간 로그", pause_btn: "일시정지", log1_msg: "상태 확인 완료", log2_msg: "사용자 세션 생성됨", log3_msg: "쿼리 최적화 완료",
    footer_desc: "스포츠의 모든 순간을 당신의 눈앞에 선명하게 전합니다.",
    quick_links: "바로가기", terms: "이용약관", privacy: "개인정보처리방침", youth: "청소년보호정책", winners: "이벤트 당첨자 발표",
    support: "고객센터", support_hours: "평일 09:00 - 18:00", lunch_break: "(점심시간 12:00 - 13:00, 주말/공휴일 휴무)",
    newsletter: "뉴스레터 구독", newsletter_desc: "최신 소식과 이벤트 정보를 가장 먼저 받아보세요.", email_placeholder: "이메일 주소 입력", subscribe_btn: "구독",
    copyright: "© 2023 TV SpotCam Inc. All Rights Reserved.", business_info: "사업자정보", partnership: "제휴문의", guide: "이용가이드",
    current_time: "현재 시간", uptime_value: "가동 시간",
    live: "실시간", health: "상태", perf: "성능",

    // ✅ 커뮤니티 페이지 번역 추가
    community_badge: "Fan Community",
    community_title: "스포츠 팬들의<br>커뮤니티",
    community_desc: "같은 팀을 응원하는 팬들과 함께 이야기 나눠보세요. 실시간 경기 토론부터 일상 이야기까지, 당신의 스포츠 라이프를 공유하세요.",
    stat_posts: "전체 글",
    stat_comments: "댓글",
    stat_online: "온라인",
    filter_all: "전체",
    filter_soccer: "축구",
    filter_baseball: "야구",
    filter_basketball: "농구",
    filter_free: "자유",  // ✅ 영어로 번역해도 "자유" 그대로 (사용자 요청)
    write_title: "새 글 작성",
    cat_soccer: "축구 토론",
    cat_baseball: "야구 토론",
    cat_basketball: "농구 토론",
    cat_free: "자유 주제",
    placeholder_title: "제목을 입력하세요",
    placeholder_content: "내용을 입력하세요. 스포츠 팬들과 나누고 싶은 이야기를 자유롭게 적어주세요.",
    btn_cancel: "취소",
    btn_submit: "등록하기",
    login_title: "로그인이 필요합니다",
    login_desc: "글을 작성하고 다른 팬들과 소통하려면 로그인해주세요",
    btn_login: "로그인하기",

    // ✅ 게시글 관련 번역 추가
    post_likes: "좋아요",
    post_comments: "댓글",
    post_views: "조회수",
    post_author: "작성자",
    post_date: "날짜",
    post_category: "카테고리",
    post_empty: "아직 게시글이 없습니다. 첫 글을 작성해보세요!",
    post_empty_en: "No posts yet. Be the first to write!",
    post_login_required: "로그인이 필요합니다.",
    post_login_required_en: "Please login.",
    post_enter_title_content: "제목과 내용을 모두 입력해주세요.",
    post_enter_title_content_en: "Please enter both title and content.",
    post_submitted: "글이 등록되었습니다!",
    post_submitted_en: "Post submitted!"
  },
  en: {
    // 기존 인덱스 페이지 번역
    nav_home: "Home", nav_live: "Live", nav_vod: "VOD", nav_community: "Community", nav_event: "Events",
    search_placeholder: "Enter search term...", login: "Login",
    hero_title: "Capture Every Match<br>Perfectly", hero_desc: "Born for fans.",
    watch_now: "Watch Now", learn_more: "Learn More",
    latest_updates: "Latest Updates", view_all: "View All →",
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
    live: "LIVE", health: "HEALTH", perf: "PERF",

    // ✅ 커뮤니티 페이지 번역 추가
    community_badge: "Fan Community",
    community_title: "Sports Fan<br>Community",
    community_desc: "Share your thoughts with fans who support the same team. From live game discussions to daily stories, share your sports life.",
    stat_posts: "Posts",
    stat_comments: "Comments",
    stat_online: "Online",
    filter_all: "All",
    filter_soccer: "Soccer",
    filter_baseball: "Baseball",
    filter_basketball: "Basketball",
    filter_free: "General",  // ✅ "FREE" → "General"으로 변경
    write_title: "Write Post",
    cat_soccer: "Soccer Talk",
    cat_baseball: "Baseball Talk",
    cat_basketball: "Basketball Talk",
    cat_free: "General Topic",
    placeholder_title: "Enter title",
    placeholder_content: "Enter content. Feel free to share your stories with sports fans.",
    btn_cancel: "Cancel",
    btn_submit: "Submit",
    login_title: "Login Required",
    login_desc: "Please login to write posts and communicate with other fans",
    btn_login: "Login",

    // ✅ 게시글 관련 번역 추가
    post_likes: "Likes",
    post_comments: "Comments",
    post_views: "Views",
    post_author: "Author",
    post_date: "Date",
    post_category: "Category",
    post_empty: "No posts yet. Be the first to write!",
    post_empty_en: "No posts yet. Be the first to write!",
    post_login_required: "Please login.",
    post_login_required_en: "Please login.",
    post_enter_title_content: "Please enter both title and content.",
    post_enter_title_content_en: "Please enter both title and content.",
    post_submitted: "Post submitted!",
    post_submitted_en: "Post submitted!"
  }
};

// 상태 관리
let isLogsPaused = false;
let currentLang = 'ko';

// 1. 언어 설정 - 원본 유지
function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  
  const elements = document.querySelectorAll('[data-lang-key]');
  elements.forEach(el => {
    const key = el.getAttribute('data-lang-key');
    
    if (translations[lang] && translations[lang][key]) {
      const translatedText = translations[lang][key];
      
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        el.setAttribute('placeholder', translatedText);
      } else if (el.tagName === 'BUTTON' && el.children.length === 0) {
        el.textContent = translatedText;
      } else {
        if (el.innerHTML !== translatedText) {
          el.innerHTML = translatedText;
        }
      }
    } else {
      console.warn(`Missing translation for key: ${key} in language: ${lang}`);
    }
  });
  
  localStorage.setItem('selectedLanguage', lang);
  const sel = document.getElementById('langSelect');
  if (sel) sel.value = lang;
}

// 2. 모바일 헤더 및 메뉴 기능 - 원본 유지
function initMobileFeatures() {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMobile = document.getElementById('navMobile');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.pageYOffset;
    
    if (current > 50) {
      header.classList.add('scrolled');
      if (current > 200 && current > lastScroll && navMobile && !navMobile.classList.contains('active')) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
    } else {
      header.classList.remove('scrolled', 'hidden');
    }
    lastScroll = current;
  });

  if (mobileToggle && navMobile) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMobile.classList.toggle('active');
      
      if (navMobile.classList.contains('active')) {
        header.classList.remove('hidden');
      }
    });

    navMobile.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMobile.classList.remove('active');
      });
    });
  }
}

// 3. 서비스 의존성 탭 기능 - 원본 유지
function initServiceDepsTabs() {
  const tabs = document.querySelectorAll('.view-controls .view-btn');
  const serviceMap = document.getElementById('serviceMap');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const viewMode = tab.getAttribute('data-view');
      if (serviceMap) {
        serviceMap.setAttribute('data-view', viewMode);
        serviceMap.style.opacity = '0.5';
        setTimeout(() => {
          serviceMap.style.opacity = '1';
        }, 200);
      }
    });
  });
}

// 4. 실시간 시계 - 원본 유지
function updateClock() {
  const now = new Date();
  const timeString = now.toISOString().slice(11, 19) + ' UTC';
  const currentTimeEl = document.getElementById('currentTime');
  if (currentTimeEl) {
    currentTimeEl.textContent = timeString;
  }
}

// 5. 대시보드 메트릭 업데이트 - 원본 유지
function updateMetrics() {
  const cpu = Math.floor(20 + Math.random() * 40);
  const cpuEl = document.getElementById('cpuValue');
  const cpuBar = document.getElementById('cpuBar');
  if (cpuEl) cpuEl.textContent = cpu + '%';
  if (cpuBar) cpuBar.style.width = cpu + '%';
  
  const memory = Math.floor(40 + Math.random() * 40);
  const memEl = document.getElementById('memoryValue');
  const memBar = document.getElementById('memoryBar');
  if (memEl) memEl.textContent = memory + '%';
  if (memBar) memBar.style.width = memory + '%';
  
  const network = (0.5 + Math.random() * 1.5).toFixed(1);
  const netEl = document.getElementById('networkValue');
  const netBar = document.getElementById('networkBar');
  if (netEl) netEl.textContent = network + ' GB/s';
  if (netBar) netBar.style.width = (network / 2 * 100) + '%';
  
  const disk = Math.floor(100 + Math.random() * 300);
  const diskEl = document.getElementById('diskValue');
  const diskBar = document.getElementById('diskBar');
  if (diskEl) diskEl.textContent = disk + ' MB/s';
  if (diskBar) diskBar.style.width = (disk / 500 * 100) + '%';
  
  const reqs = Math.floor(2000 + Math.random() * 1500);
  const reqEl = document.getElementById('reqPerSec');
  if (reqEl) reqEl.textContent = reqs.toLocaleString();
  
  const latency = Math.floor(20 + Math.random() * 60);
  const latEl = document.getElementById('latencyValue');
  if (latEl) latEl.textContent = latency + 'ms';
  
  const uptime = (99.9 + Math.random() * 0.09).toFixed(2);
  const upEl = document.getElementById('uptimeValue');
  if (upEl) upEl.textContent = uptime + '%';
  
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

// 6. 로그 스트림 기능 - 원본 유지
const logServices = ['API', 'DB', 'CDN', 'AUTH', 'CACHE', 'WORKER'];
const logMessages = {
  ko: ['상태 확인 완료', '요청 처리 완료', '캐시 무효화됨', '데이터베이스 쿼리 최적화됨', '사용자 인증 성공', '로드 밸런서 트래픽 재분배', 'SSL 인증서 갱신', '백업 완료', '메모리 가비지 컬렉션 실행'],
  en: ['Health check passed', 'Request processed successfully', 'Cache invalidated', 'Database query optimized', 'User authentication successful', 'Load balancer redistributed traffic', 'SSL certificate renewed', 'Backup completed', 'Memory garbage collection executed']
};

function addRandomLog() {
  if (isLogsPaused) return;
  
  const logContent = document.getElementById('logContent');
  if (!logContent) return;
  
  const now = new Date();
  const time = now.toISOString().slice(11, 19);
  const service = logServices[Math.floor(Math.random() * logServices.length)];
  const messages = logMessages[currentLang] || logMessages.ko;
  const message = messages[Math.floor(Math.random() * messages.length)];
  
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.innerHTML = `
    <span class="log-time">${time}</span>
    <span class="log-service">${service}</span>
    <span class="log-message">${message}</span>
  `;
  
  logContent.insertBefore(logEntry, logContent.firstChild);
  
  while (logContent.children.length > 50) {
    logContent.removeChild(logContent.lastChild);
  }
}

function initLogStream() {
  const pauseBtn = document.getElementById('pauseLogs');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isLogsPaused = !isLogsPaused;
      pauseBtn.textContent = isLogsPaused ? (currentLang === 'ko' ? '재개' : 'RESUME') : (currentLang === 'ko' ? '일시정지' : 'PAUSE');
      pauseBtn.style.background = isLogsPaused ? 'var(--hud-warn)' : 'rgba(255,255,255,0.1)';
    });
  }
}

// 7. 스크롤 애니메이션 - 원본 유지
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
  
  document.querySelectorAll('.video-card, .metric-card, .service-node, .alert-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(el);
  });
}

// 8. HUD 초기화 - 원본 유지
function initHud() {
  updateMetrics();
  setInterval(() => {
    updateMetrics();
    addRandomLog();
  }, 2000);
  
  initLogStream();
}

// 9. 전체 초기화 - 원본 유지
document.addEventListener('DOMContentLoaded', () => {
  console.log('TV SpotCam initializing...');
  
  const savedLang = localStorage.getItem('selectedLanguage') || 'ko';
  
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = savedLang;
    langSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
      isLogsPaused = false;
      if (document.getElementById('pauseLogs')) {
        document.getElementById('pauseLogs').textContent = e.target.value === 'ko' ? '일시정지' : 'PAUSE';
        document.getElementById('pauseLogs').style.background = 'rgba(255,255,255,0.1)';
      }
    });
  }
  
  initMobileFeatures();
  initServiceDepsTabs();
  
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setLanguage(savedLang);
      initScrollEffects();
      updateClock();
      setInterval(updateClock, 1000);
      initHud();
    }, 1200);
  } else {
    setLanguage(savedLang);
    initScrollEffects();
    updateClock();
    setInterval(updateClock, 1000);
    initHud();
  }
  
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

// ✅ 커뮤니티 페이지 전용 기능 (원본에 없던 부분)
let currentUser = null;
let posts = [];
let currentCategory = 'all';

function checkLoginStatus() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showLoggedInState();
  } else {
    showLoggedOutState();
  }
}

function showLoggedInState() {
  document.getElementById('loginBtn').style.display = 'none';
  document.getElementById('userProfile').style.display = 'flex';
  document.getElementById('username').textContent = currentUser.name;
  document.getElementById('writeSection').style.display = 'block';
  document.getElementById('loginPrompt').style.display = 'none';
}

function showLoggedOutState() {
  document.getElementById('loginBtn').style.display = 'block';
  document.getElementById('userProfile').style.display = 'none';
  document.getElementById('writeSection').style.display = 'none';
  document.getElementById('loginPrompt').style.display = 'block';
}

function showLoginModal() {
  const name = prompt(currentLang === 'ko' ? '닉네임을 입력하세요:' : 'Enter your nickname:');
  if (name && name.trim()) {
    currentUser = { name: name.trim(), id: Date.now() };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showLoggedInState();
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  showLoggedOutState();
}

const dummyPosts = [
  {
    id: 1,
    title: "손흥민 이번 시즌 진짜 미쳤다",
    content: "어제 경기 보신 분 계신가요? 골 결정력이 예전 같지 않아서 걱정했는데, 어제는 진짜 레전드였습니다. 토트넘 팬들 모여주세요!",
    author: "SpursFan",
    category: "soccer",
    date: "2023-11-15 14:30",
    likes: 42,
    comments: 15,
    views: 1205
  },
  {
    id: 2,
    title: "KBO FA시장 예상",
    content: "이번 FA 최대어는 누구라고 보시나요? 개인적으로는 에이스 투수가 가장 중요하다고 봅니다. 구단별 필요 포지션 분석해봤어요.",
    author: "야구박사",
    category: "baseball",
    date: "2023-11-15 12:15",
    likes: 28,
    comments: 32,
    views: 892
  },
  {
    id: 3,
    title: "NBA 중계 시간대 개선 필요",
    content: "미국 시간이라 새벽에만 볼 수 있는 게 너무 힘듭니다. 하이라이트라도 제때 올려주면 좋겠어요. 다른 분들은 어떻게 보고 계세요?",
    author: "농구매니아",
    category: "basketball",
    date: "2023-11-15 09:45",
    likes: 67,
    comments: 41,
    views: 2341
  },
  {
    id: 4,
    title: "이번 주말 같이 축구 볼 사람?",
    content: "강남 쪽 스포츠바에서 같이 볼 분 구합니다. 맨유 경기 예정이에요. 맥주 한잔 하면서 응원해요!",
    author: "맨유서포터",
    category: "free",
    date: "2023-11-14 18:20",
    likes: 12,
    comments: 8,
    views: 445
  },
  {
    id: 5,
    title: "우리 팀 유니폼 공동구매 합니다",
    content: "해외 직구로 유니폼 구매하실 분 10명 모집합니다. 배송비 나누면 개당 8만원 정도 예상됩니다. 댓글로 신청해주세요.",
    author: "구매대행",
    category: "free",
    date: "2023-11-14 11:00",
    likes: 35,
    comments: 23,
    views: 1567
  }
];

function loadPosts() {
  const savedPosts = localStorage.getItem('communityPosts');
  posts = savedPosts ? JSON.parse(savedPosts) : dummyPosts;
  if (!savedPosts) savePosts();
  updateStats();
  renderPosts();
}

function savePosts() {
  localStorage.setItem('communityPosts', JSON.stringify(posts));
}

function updateStats() {
  document.getElementById('totalPosts').textContent = posts.length.toLocaleString();
  const totalComments = posts.reduce((sum, p) => sum + p.comments, 0);
  document.getElementById('totalComments').textContent = totalComments.toLocaleString();
}

function renderPosts() {
  const list = document.getElementById('postList');
  const filtered = currentCategory === 'all' ? posts : posts.filter(p => p.category === currentCategory);
  
  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <p>${currentLang === 'ko' ? translations.ko.post_empty : translations.en.post_empty}</p>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.map(post => `
    <article class="post-card" onclick="viewPost(${post.id})">
      <div class="post-header">
        <div class="post-meta">
          <div class="author-avatar">${post.author.charAt(0)}</div>
          <div class="author-info">
            <span class="author-name">${escapeHtml(post.author)}</span>
            <span class="post-time">${post.date}</span>
          </div>
        </div>
        <span class="post-category">${getCategoryName(post.category)}</span>
      </div>
      <h3 class="post-title">${escapeHtml(post.title)}</h3>
      <p class="post-content">${escapeHtml(post.content)}</p>
      <div class="post-footer">
        <span class="post-action ${post.likedBy?.includes(currentUser?.id) ? 'liked' : ''}" onclick="event.stopPropagation(); likePost(${post.id})">
          👍 ${post.likes.toLocaleString()}
        </span>
        <span class="post-action">
          💬 ${post.comments.toLocaleString()}
        </span>
        <span class="post-action">
          👁️ ${post.views.toLocaleString()}
        </span>
      </div>
    </article>
  `).join('');
}

function getCategoryName(cat) {
  const names = {
    ko: { soccer: '축구', baseball: '야구', basketball: '농구', free: '자유' },
    en: { soccer: 'Soccer', baseball: 'Baseball', basketball: 'Basketball', free: 'General' }  // ✅ "Free" → "General"
  };
  return names[currentLang][cat] || cat;
}

function submitPost() {
  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();
  const category = document.getElementById('postCategory').value;

  if (!title || !content) {
    alert(currentLang === 'ko' ? translations.ko.post_enter_title_content : translations.en.post_enter_title_content);
    return;
  }

  const newPost = {
    id: Date.now(),
    title, content, author: currentUser.name, category,
    date: new Date().toLocaleString(currentLang === 'ko' ? 'ko-KR' : 'en-US'),
    likes: 0, comments: 0, views: 0, likedBy: []
  };

  posts.unshift(newPost);
  savePosts();
  updateStats();
  renderPosts();
  clearForm();
  alert(currentLang === 'ko' ? translations.ko.post_submitted : translations.en.post_submitted);
}

function clearForm() {
  document.getElementById('postTitle').value = '';
  document.getElementById('postContent').value = '';
}

function likePost(postId) {
  if (!currentUser) {
    alert(currentLang === 'ko' ? translations.ko.post_login_required : translations.en.post_login_required);
    return;
  }

  const post = posts.find(p => p.id === postId);
  if (!post) return;
  if (!post.likedBy) post.likedBy = [];
  
  const userIndex = post.likedBy.indexOf(currentUser.id);
  if (userIndex > -1) {
    post.likedBy.splice(userIndex, 1);
    post.likes--;
  } else {
    post.likedBy.push(currentUser.id);
    post.likes++;
  }

  savePosts();
  renderPosts();
}

function viewPost(postId) {
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.views++;
    savePosts();
    renderPosts();
    const authorLabel = currentLang === 'ko' ? translations.ko.post_author : translations.en.post_author;
    const viewsLabel = currentLang === 'ko' ? translations.ko.post_views : translations.en.post_views;
    alert(`[${post.title}]\n\n${post.content}\n\n${authorLabel}: ${post.author}\n${viewsLabel}: ${post.views}`);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const nav = document.getElementById('navMobile');
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
  });
}

// ... 위의 translations 객체와 나머지 코드는 동일 ...

// ✅ 커뮤니티 페이지 전용 기능 (원본에 없던 부분)
let currentUser = null;
let posts = [];
let currentCategory = 'all';

function checkLoginStatus() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showLoggedInState();
  } else {
    showLoggedOutState();
  }
}

function showLoggedInState() {
  // ✅ 요소가 존재하는지 확인 (null 체크)
  const loginBtn = document.getElementById('loginBtn');
  const userProfile = document.getElementById('userProfile');
  const username = document.getElementById('username');
  const writeSection = document.getElementById('writeSection');
  const loginPrompt = document.getElementById('loginPrompt');

  if (loginBtn) loginBtn.style.display = 'none';
  if (userProfile) userProfile.style.display = 'flex';
  if (username) username.textContent = currentUser.name;
  if (writeSection) writeSection.style.display = 'block';
  if (loginPrompt) loginPrompt.style.display = 'none';
}

function showLoggedOutState() {
  // ✅ 요소가 존재하는지 확인 (null 체크)
  const loginBtn = document.getElementById('loginBtn');
  const userProfile = document.getElementById('userProfile');
  const writeSection = document.getElementById('writeSection');
  const loginPrompt = document.getElementById('loginPrompt');

  if (loginBtn) loginBtn.style.display = 'block';
  if (userProfile) userProfile.style.display = 'none';
  if (writeSection) writeSection.style.display = 'none';
  if (loginPrompt) loginPrompt.style.display = 'block';
}

// ... 나머지 코드는 동일 ...

// ✅ DOMContentLoaded에 커뮤니티 기능 추가 (원본에 없던 부분)
document.addEventListener('DOMContentLoaded', () => {
  // ... (기존 script.js 기능은 이미 위에서 실행됨) ...

  // ✅ 커뮤니티 페이지에서만 실행되도록 조건 추가
  if (document.getElementById('postList')) {
    checkLoginStatus();
    loadPosts();

    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category;
        renderPosts();
      });
    });

    initMobileMenu();

    // 헤더 높이 계산 (커뮤니티 페이지용)
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    // 스크롤 애니메이션 (커뮤니티 페이지용)
    window.addEventListener('scroll', handleScroll);
  }
});

// ✅ 헤더 높이 계산 (커뮤니티 페이지용)
function updateHeaderHeight() {
  const header = document.getElementById('header');
  if (header) {
    const headerHeight = header.offsetHeight;
    document.documentElement.style.setProperty('--header-h', `${headerHeight}px`);
  }
}

// ✅ 스크롤 시 헤더 인/아웃 애니메이션 (커뮤니티 페이지용)
let lastScrollY = window.scrollY;
function handleScroll() {
  const header = document.getElementById('header');
  if (!header) return; // ✅ header가 없으면 종료
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }
  
  lastScrollY = currentScrollY;
}
