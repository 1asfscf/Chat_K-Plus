// script.js - 티비 스포캠 JavaScript 파일 (분리형)

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM이 완전히 로드되었습니다. JS 실행 시작...');
    
    // 1. Loader 기능
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            initHud();
            initScrollEffects();
            initSearchModal();
            initVideoCards();
        }, 1000);
    }

    // 2. 헤더 스크롤 효과
    function initScrollEffects() {
        const header = document.getElementById('header');
        if (!header) return;
        
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            lastScroll = currentScroll;
        });
    }

    // 3. 실시간 시계
    function updateClock() {
        const now = new Date();
        const timeString = now.toISOString().substr(11, 8) + ' UTC';
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 4. HUD 대시보드 기능
    const logData = [
        "Initiating maintenance protocol v2.4...",
        "Detaching load balancer [LB-PRD]...",
        "Flushing Redis cache clusters...",
        "Stopping worker processes on node-worker-b...",
        "Optimizing database tables [shard_01]...",
        "Re-indexing Elasticsearch data...",
        "Warning: High latency on worker-b interface...",
        "Backup snapshot created: snap_20231027.db",
        "System entering read-only mode..."
    ];

    function initHud() {
        console.log('HUD 대시보드 초기화');
        updateMetrics();
        renderLogs();
        
        // 실시간 데이터 업데이트 시뮬레이션
        setInterval(() => {
            updateMetrics();
            addRandomLog();
        }, 2000);
    }

    function updateMetrics() {
        const cpu = Math.floor(Math.random() * 30) + 20; // 20-50%
        const mem = Math.floor(Math.random() * 20) + 60; // 60-80%
        const net = (Math.random() * 5).toFixed(1); // 0-5GB

        const cpuVal = document.getElementById('cpuVal');
        const cpuBar = document.getElementById('cpuBar');
        const memVal = document.getElementById('memVal');
        const memBar = document.getElementById('memBar');
        const netVal = document.getElementById('netVal');
        const corePercent = document.getElementById('corePercent');

        if (cpuVal && cpuBar) {
            cpuVal.textContent = cpu.toString().padStart(2, '0');
            cpuBar.style.width = cpu + '%';
        }

        if (memVal && memBar) {
            memVal.textContent = mem.toString().padStart(2, '0');
            memBar.style.width = mem + '%';
        }

        if (netVal) {
            netVal.textContent = net;
        }

        // 코어 애니메이션
        if (corePercent) {
            const coreVal = 75 + Math.floor(Math.random() * 5);
            corePercent.textContent = coreVal + '%';
        }
    }

    function renderLogs() {
        const container = document.getElementById('hudLogs');
        if (!container) return;
        
        logData.forEach(msg => createLogLine(container, msg));
    }

    function addRandomLog() {
        const container = document.getElementById('hudLogs');
        if (!container) return;
        
        const msgs = [
            "Heartbeat received from master-01.",
            "Syncing user sessions...",
            "Garbage collection started.",
            "Packet loss detected on eth0.",
            "Health check: OK",
            "Rotating logs..."
        ];
        const msg = msgs[Math.floor(Math.random() * msgs.length)];
        createLogLine(container, msg);
    }

    function createLogLine(container, msg) {
        const line = document.createElement('div');
        line.className = 'log-line';
        const time = new Date().toISOString().split('T')[1].substring(0, 8);
        const type = Math.random() > 0.8 ? 'log-warn' : (Math.random() > 0.8 ? 'log-info' : '');
        
        line.innerHTML = `<span class="log-time">[${time}]</span> <span class="${type}">${msg}</span>`;
        container.appendChild(line);
        container.scrollTop = container.scrollHeight;
    }

    // 5. 검색 모달 기능
    function initSearchModal() {
        const searchModal = document.getElementById('searchModal');
        const searchTrigger = document.getElementById('searchTrigger');
        const closeSearch = document.getElementById('closeSearch');
        const searchModalInput = document.getElementById('searchModalInput');

        if (!searchModal || !searchTrigger) {
            console.warn('검색 모달 요소를 찾을 수 없습니다.');
            return;
        }

        // 검색 모달 토글
        searchTrigger.addEventListener('click', () => {
            searchModal.classList.add('active');
            setTimeout(() => {
                if (searchModalInput) searchModalInput.focus();
            }, 400);
        });

        // 모달 닫기
        if (closeSearch) {
            closeSearch.addEventListener('click', closeSearchModal);
        }

        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                closeSearchModal();
            }
        });

        // 배경 클릭으로 닫기
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                closeSearchModal();
            }
        });

        function closeSearchModal() {
            searchModal.classList.remove('active');
            if (searchModalInput) {
                searchModalInput.value = '';
            }
        }

        // 검색 기능
        if (searchModalInput) {
            searchModalInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length > 0) {
                    performSearch(query);
                }
            });

            // 엔터 키로 검색
            searchModalInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    performSearch(searchModalInput.value);
                }
            });
        }

        function performSearch(query) {
            console.log('검색 실행:', query);
            // 실제 검색 로직 구현
        }
    }

    // 6. 비디오 카드 인터랙션
    function initVideoCards() {
        const videoCards = document.querySelectorAll('.video-card');
        
        videoCards.forEach(card => {
            card.addEventListener('click', function() {
                const title = this.querySelector('.card-title');
                if (title) {
                    console.log('비디오 재생:', title.textContent);
                    // 실제 구현시 비디오 재생 로직 추가
                }
            });
            
            // 호버 효과
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // 7. 반응형 처리
    function initResponsive() {
        function handleResize() {
            const header = document.getElementById('header');
            const navDesktop = document.querySelector('.nav-desktop');
            
            if (window.innerWidth <= 768) {
                if (navDesktop) {
                    navDesktop.style.display = 'none';
                }
            } else {
                if (navDesktop) {
                    navDesktop.style.display = 'flex';
                }
            }
        }
        
        window.addEventListener('resize', handleResize);
        handleResize(); // 초기 실행
    }

    // 8. 푸터 뉴스레터 구독
    function initNewsletter() {
        const subscribeForms = document.querySelectorAll('.subscribe-form');
        
        subscribeForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const input = this.querySelector('.subscribe-input');
                if (input && input.value) {
                    alert('뉴스레터 구독이 완료되었습니다!');
                    input.value = '';
                }
            });
        });
    }

    // 9. 소셜 공유 기능
    function initSocialShare() {
        const socialIcons = document.querySelectorAll('.social-icon');
        
        socialIcons.forEach(icon => {
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.getAttribute('title') || '소셜미디어';
                console.log(`${platform}로 공유하기`);
                // 실제 구현시 공유 API 연동
            });
        });
    }

    // 10. 모든 기능 초기화
    initResponsive();
    initNewsletter();
    initSocialShare();
    
    // 스무스 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// 11. 에러 핸들링
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// 12. 성능 모니터링
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('페이지 로드 시간:', perfData.loadEventEnd - perfData.navigationStart + 'ms');
        }, 0);
    });
}
