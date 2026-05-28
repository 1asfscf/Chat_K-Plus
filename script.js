// ===== DOM 요소 =====
const spinner = document.getElementById('loadingSpinner');
const iframe = document.getElementById('artifactFrame');

// ===== 설정 =====
const artifactUuid = '4a535e5f-1277-4620-a181-e928925fabbe';
const assetId = '2142200256325787';
const sandboxUrl = `https://2142200256325787.a.metaaiusercontent.com/html?artifact_uuid=${artifactUuid}&ext=1780072526&hash=Q5fpDAGyymSTIyd23CAh42EOTmHV`;

// ===== iframe 로드 =====
function loadArtifact() {
  iframe.src = sandboxUrl;
  
  iframe.onload = () => {
    // 로딩 스피너 숨기고 iframe 표시
    spinner.style.display = 'none';
    iframe.style.opacity = '1';
  };
  
  iframe.onerror = () => {
    spinner.innerHTML = '<div class="text-white">아티팩트를 불러올 수 없습니다</div>';
  };
}

// ===== 성능 측정 =====
let renderTime = null;
requestAnimationFrame(() => {
  renderTime = performance.now();
  console.log('[Meta AI] 렌더링 시간:', renderTime);
});

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
  loadArtifact();
});
