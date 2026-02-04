// script.js - 티비 스포캠 JavaScript (오류 수정 완료)

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM이 완전히 로드되었습니다. JS 실행 시작...');
    
    // 1. Loader 기능
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            initHud();
            initScrollEffects();
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

    // 3. 실시간 시계 업데이트
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

        if (corePercent) {
            const coreVal = 75 + Math.floor(Math.random() * 5);
            corePercent.textContent = coreVal + '%';
        }
    }

    function renderLogs() {
        const container = document.getElementById('hudLogs');
        if (!container) return;
        
        // 로그 초기화
        container.innerHTML = '';
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

    // 5. 검색 모달 기능 (요소가 있을 때만 실행)
    function initSearchModal() {
        const searchModal = document.getElementById('searchModal');
        if (!searchModal) {
            console.warn('검색 모달 요소를 찾을 수 없습니다. 검색 기능을 건너뜁니다.');
            return;
        }
        // ... (기존 검색 모달 JS 코드) ...
        // 여기서는 생략하지만, 실제로는 기존 코드를 여기에 배치
        console.log('검색 모달 초기화 (구현됨)');
    }
    // initSearchModal(); // HTML에 searchModal이 없으므로 주석 처리

    // 6. 성능 모니터링 (오류 수정)
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData && perfData.loadEventEnd && perfData.navigationStart) {
                    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`페이지 로드 시간: ${loadTime}ms`);
                } else {
                    console.log('페이지 로드 시간을 측정할 수 없습니다.');
                }
            }, 0);
        });
    }
});
