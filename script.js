/* ========================================
   Chat K plus v2.5.3 - V10 Full Codebase
   Studio Ferrari - 2026.06.05 Layout Fix
   ======================================== */

@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

:root {
    /* Light Theme */
    --bg-primary-light: #FFFFFF;
    --bg-secondary-light: #F8F9FA;
    --bg-tertiary-light: #F1F3F5;
    --bg-glass-light: rgba(255, 255, 0.75);
    --text-primary-light: #1F2937;
    --text-secondary-light: #6B7280;
    --text-tertiary-light: #9CA3AF;
    --border-light: rgba(0, 0, 0, 0.08);
    --primary-light: #8B5CF6;
    --primary-hover-light: #7C3AED;
    --primary-bg-light: rgba(139, 92, 246, 0.1);
    --shadow-light: 0 4px 24px rgba(139, 92, 246, 0.12);
    --shadow-light-lg: 0 10px 40px rgba(0, 0, 0, 0.1);
    
    /* Dark Theme */
    --bg-primary-dark: #0B1220;
    --bg-secondary-dark: #111827;
    --bg-tertiary-dark: #1F2937;
    --bg-glass-dark: rgba(17, 24, 39, 0.75);
    --text-primary-dark: #F9FAFB;
    --text-secondary-dark: #9CA3AF;
    --text-tertiary-dark: #6B7280;
    --border-dark: rgba(255, 255, 255, 0.08);
    --primary-dark: #A78BFA;
    --primary-hover-dark: #8B5CF6;
    --primary-bg-dark: rgba(167, 139, 250, 0.15);
    --shadow-dark: 0 4px 24px rgba(167, 139, 250, 0.16);
    --shadow-dark-lg: 0 10px 40px rgba(0, 0, 0, 0.4);
    
    /* Common */
    --danger: #F59E0B;
    --danger-bg: rgba(245, 158, 11, 0.1);
    --success: #10B981;
    --error: #EF4444;
    --radius-xs: 6px;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-full: 9999px;
    --transition-fast: 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
    --transition: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-tap-highlight-color: transparent;
}

html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    background: var(--bg-primary-dark);
    color: var(--text-primary-dark);
    overflow: hidden;
    overscroll-behavior: none;
    transition: background 0.3s var(--transition);
}

body.light-mode {
    background: var(--bg-primary-light);
    color: var(--text-primary-light);
}

body.modal-open {
    overflow: hidden;
}

/* ===== APP WRAPPER ===== */
#app-wrapper {
    width: 100%;
    height: 100vh;
    height: 100dvh;
    max-width: 840px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}

/* ===== SCREEN CONTROL - 핵심 수정 ===== */
#home-screen,
#chat-screen {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

#home-screen.hidden,
#chat-screen.hidden {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
    z-index: -1 !important;
}

/* ===== HOME SCREEN ===== */
#home-screen {
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: var(--bg-primary-dark);
    z-index: 10;
}

body.light-mode #home-screen {
    background: var(--bg-primary-light);
}

.home-content {
    width: 100%;
    max-width: 600px;
    text-align: center;
}

.home-title {
    font-size: 48px;
    font-weight: 800;
    letter-spacing: -0.04em;
    margin-bottom: 12px;
    background: linear-gradient(135deg, var(--primary-dark), #EC4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

body.light-mode .home-title {
    background: linear-gradient(135deg, var(--primary-light), #EC4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.home-subtitle {
    font-size: 16px;
    color: var(--text-secondary-dark);
    margin-bottom: 40px;
}

body.light-mode .home-subtitle {
    color: var(--text-secondary-light);
}

/* ===== HEADER BAR ===== */
#chat-header-bar {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 16px 20px 12px;
    background: linear-gradient(180deg, 
        var(--bg-primary-dark) 0%, 
        rgba(11, 18, 32, 0.85) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-dark);
    transition: all 0.3s var(--transition);
}

body.light-mode #chat-header-bar {
    background: linear-gradient(180deg, 
        var(--bg-primary-light) 0%, 
        rgba(255, 255, 255, 0.85) 100%);
    border-bottom-color: var(--border-light);
}

.header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
}

#chat-title {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.2;
}

#theme-toggle,
#theme-toggle-chat {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1.5px solid var(--border-dark);
    background: var(--bg-secondary-dark);
    color: var(--text-primary-dark);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: all 0.2s var(--transition);
    flex-shrink: 0;
}

body.light-mode #theme-toggle,
body.light-mode #theme-toggle-chat {
    border-color: var(--border-light);
    background: var(--bg-secondary-light);
    color: var(--text-primary-light);
}

#theme-toggle:hover,
#theme-toggle-chat:hover {
    transform: scale(1.05) rotate(15deg);
    border-color: var(--primary-dark);
}

body.light-mode #theme-toggle:hover,
body.light-mode #theme-toggle-chat:hover {
    border-color: var(--primary-light);
}

#theme-toggle:active,
#theme-toggle-chat:active {
    transform: scale(0.95);
}

#back-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1.5px solid var(--border-dark);
    background: var(--bg-secondary-dark);
    color: var(--text-primary-dark);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.2s var(--transition);
    flex-shrink: 0;
}

body.light-mode #back-btn {
    border-color: var(--border-light);
    background: var(--bg-secondary-light);
    color: var(--text-primary-light);
}

#back-btn:hover {
    background: var(--bg-tertiary-dark);
}

body.light-mode #back-btn:hover {
    background: var(--bg-tertiary-light);
}

/* ===== SEARCH INPUT ===== */
.search-container {
    position: relative;
    width: 100%;
}

#search-input {
    width: 100%;
    height: 52px;
    padding: 0 20px;
    padding-right: 54px;
    background: var(--bg-secondary-dark);
    border: 1.5px solid var(--border-dark);
    border-radius: 26px;
    color: var(--text-primary-dark);
    font-size: 16px;
    font-weight: 400;
    outline: none;
    transition: all 0.2s var(--transition);
}

body.light-mode #search-input {
    background: var(--bg-secondary-light);
    border-color: var(--border-light);
    color: var(--text-primary-light);
}

#search-input::placeholder {
    color: var(--text-tertiary-dark);
    font-weight: 400;
}

body.light-mode #search-input::placeholder {
    color: var(--text-tertiary-light);
}

#search-input:focus {
    border-color: var(--primary-dark);
    box-shadow: 0 0 0 4px var(--primary-bg-dark);
}

body.light-mode #search-input:focus {
    border-color: var(--primary-light);
    box-shadow: 0 0 0 4px var(--primary-bg-light);
}

#search-btn {
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: var(--bg-tertiary-dark);
    color: var(--text-tertiary-dark);
    cursor: not-allowed;
    opacity: 0.5;
    font-size: 18px;
    font-weight: 600;
    transition: all 0.2s var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
}

body.light-mode #search-btn {
    background: var(--bg-tertiary-light);
    color: var(--text-tertiary-light);
}

#search-btn.active {
    background: var(--primary-dark);
    color: white;
    cursor: pointer;
    opacity: 1;
}

body.light-mode #search-btn.active {
    background: var(--primary-light);
}

#search-btn.active:hover {
    background: var(--primary-hover-dark);
    transform: translateY(-50%) scale(1.05);
}

body.light-mode #search-btn.active:hover {
    background: var(--primary-hover-light);
}

#search-btn.active:active {
    transform: translateY(-50%) scale(0.92);
}

/* ===== EXAMPLE QUESTIONS ===== */
#example-questions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 32px;
}

.question-tag {
    padding: 10px 18px;
    background: var(--bg-secondary-dark);
    border: 1.5px solid var(--border-dark);
    border-radius: var(--radius-full);
    color: var(--text-primary-dark);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s var(--transition-fast);
}

body.light-mode .question-tag {
    background: var(--bg-secondary-light);
    border-color: var(--border-light);
    color: var(--text-primary-light);
}

.question-tag:hover {
    border-color: var(--primary-dark);
    background: var(--primary-bg-dark);
    transform: translateY(-2px);
}

body.light-mode .question-tag:hover {
    border-color: var(--primary-light);
    background: var(--primary-bg-light);
}

.question-tag:active {
    transform: scale(0.97);
}

/* ===== WARNING BANNER ===== */
.warning-banner {
    margin: 0 20px 16px;
    padding: 12px 16px;
    background: var(--danger-bg);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--text-secondary-dark);
    animation: slideDown 0.3s var(--transition);
    flex-shrink: 0;
}

body.light-mode .warning-banner {
    color: var(--text-secondary-light);
    background: rgba(245, 158, 11, 0.08);
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.warning-banner-icon {
    font-size: 16px;
    flex-shrink: 0;
}

/* ===== CHAT SCREEN ===== */
#chat-screen {
    background: var(--bg-primary-dark);
    z-index: 20;
}

body.light-mode #chat-screen {
    background: var(--bg-primary-light);
}

/* ===== CHAT CONTAINER ===== */
#chat-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    scroll-behavior: smooth;
}

#chat-container::-webkit-scrollbar {
    width: 6px;
}

#chat-container::-webkit-scrollbar-track {
    background: transparent;
}

#chat-container::-webkit-scrollbar-thumb {
    background: var(--border-dark);
    border-radius: 3px;
}

body.light-mode #chat-container::-webkit-scrollbar-thumb {
    background: var(--border-light);
}

/* Welcome State */
.chat-welcome {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 20px;
    opacity: 0.4;
}

.chat-welcome-icon {
    font-size: 64px;
    margin-bottom: 16px;
}

.chat-welcome-text {
    font-size: 15px;
    color: var(--text-secondary-dark);
}

body.light-mode .chat-welcome-text {
    color: var(--text-secondary-light);
}

/* ===== MESSAGES ===== */
.message {
    display: flex;
    flex-direction: column;
    gap: 6px;
    animation: messageIn 0.3s var(--transition);
}

@keyframes messageIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message.user {
    align-items: flex-end;
}

.message-bubble {
    max-width: 85%;
    padding: 14px 18px;
    border-radius: 20px;
    font-size: 15px;
    line-height: 1.6;
    word-wrap: break-word;
    white-space: pre-wrap;
}

.message.user .message-bubble {
    background: var(--primary-dark);
    color: white;
    border-bottom-right-radius: 6px;
}

body.light-mode .message.user .message-bubble {
    background: var(--primary-light);
}

.message.ai .message-bubble {
    background: var(--bg-secondary-dark);
    color: var(--text-primary-dark);
    border-bottom-left-radius: 6px;
}

body.light-mode .message.ai .message-bubble {
    background: var(--bg-secondary-light);
    color: var(--text-primary-light);
}

/* Thinking Animation */
.thinking-msg {
    background: linear-gradient(90deg, 
        var(--text-tertiary-dark) 0%, 
        var(--primary-dark) 50%, 
        var(--text-tertiary-dark) 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: thinkingShimmer 1.5s ease-in-out infinite;
    font-weight: 600;
}

body.light-mode .thinking-msg {
    background: linear-gradient(90deg, 
        var(--text-tertiary-light) 0%, 
        var(--primary-light) 50%, 
        var(--text-tertiary-light) 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

@keyframes thinkingShimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.thinking-msg::after {
    content: '...';
    animation: thinkingDots 1.4s infinite;
}

@keyframes thinkingDots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60%, 100% { content: '...'; }
}

/* ===== CHAT INPUT AREA ===== */
#chat-input-area {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 20px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
    background: var(--bg-glass-dark);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid var(--border-dark);
    z-index: 90;
    flex-shrink: 0;
}

body.light-mode #chat-input-area {
    background: var(--bg-glass-light);
    border-top-color: var(--border-light);
}

.input-wrapper {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    gap: 10px;
    align-items: flex-end;
}

#chat-input {
    flex: 1;
    min-height: 48px;
    max-height: 120px;
    padding: 12px 18px;
    background: var(--bg-tertiary-dark);
    border: 1.5px solid var(--border-dark);
    border-radius: var(--radius-xl);
    color: var(--text-primary-dark);
    font-size: 15px;
    resize: none;
    outline: none;
    transition: all 0.2s var(--transition);
}

body.light-mode #chat-input {
    background: var(--bg-tertiary-light);
    border-color: var(--border-light);
    color: var(--text-primary-light);
}

#chat-input:focus {
    border-color: var(--primary-dark);
    box-shadow: 0 0 0 4px var(--primary-bg-dark);
}

body.light-mode #chat-input:focus {
    border-color: var(--primary-light);
    box-shadow: 0 0 0 4px var(--primary-bg-light);
}

#send-btn,
#timetable-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: var(--bg-tertiary-dark);
    color: var(--text-tertiary-dark);
    cursor: pointer;
    font-size: 20px;
    transition: all 0.2s var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

body.light-mode #send-btn,
body.light-mode #timetable-btn {
    background: var(--bg-tertiary-light);
    color: var(--text-tertiary-light);
}

#send-btn {
    cursor: not-allowed;
    opacity: 0.5;
}

#send-btn.active {
    background: var(--primary-dark);
    color: white;
    cursor: pointer;
    opacity: 1;
}

body.light-mode #send-btn.active {
    background: var(--primary-light);
}

#send-btn.active:hover,
#timetable-btn:hover {
    background: var(--primary-hover-dark);
    transform: scale(1.05);
}

body.light-mode #send-btn.active:hover,
body.light-mode #timetable-btn:hover {
    background: var(--primary-hover-light);
}

#send-btn.active:active,
#timetable-btn:active {
    transform: scale(0.92);
}

/* ===== MODAL SYSTEM ===== */
.modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: none;
    align-items: flex-end;
    justify-content: center;
}

.modal[data-state="visible"],
.modal[data-state="active"] {
    display: flex;
}

.modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    animation: fadeIn 0.3s var(--transition);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal-content {
    position: relative;
    width: 100%;
    max-width: 840px;
    max-height: 92vh;
    background: var(--bg-primary-dark);
    border-radius: 28px 28px 0 0;
    box-shadow: 0 -10px 60px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    animation: slideUpModal 0.4s var(--transition);
    overflow: hidden;
}

body.light-mode .modal-content {
    background: var(--bg-primary-light);
    box-shadow: 0 -10px 60px rgba(0, 0, 0, 0.15);
}

@keyframes slideUpModal {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-handle {
    width: 48px;
    height: 5px;
    background: var(--border-dark);
    border-radius: 3px;
    margin: 12px auto 8px;
    flex-shrink: 0;
}

body.light-mode .modal-handle {
    background: var(--border-light);
}

.modal-header {
    padding: 8px 24px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
}

.modal-title {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
}

.modal-close {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: var(--bg-secondary-dark);
    color: var(--text-secondary-dark);
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s var(--transition);
}

body.light-mode .modal-close {
    background: var(--bg-secondary-light);
    color: var(--text-secondary-light);
}

.modal-close:hover {
    background: var(--error);
    color: white;
    transform: rotate(90deg);
}

.modal-body {
    padding: 0 24px 24px;
    overflow-y: auto;
    flex: 1 1 auto;
    min-height: 0;
}

.modal-body::-webkit-scrollbar {
    width: 6px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: var(--border-dark);
    border-radius: 3px;
}

body.light-mode .modal-body::-webkit-scrollbar-thumb {
    background: var(--border-light);
}

.modal-actions {
    padding: 16px 24px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
    display: flex;
    gap: 12px;
    border-top: 1px solid var(--border-dark);
    background: var(--bg-primary-dark);
    flex-shrink: 0;
}

body.light-mode .modal-actions {
    border-top-color: var(--border-light);
    background: var(--bg-primary-light);
}

.btn {
    flex: 1;
    height: 54px;
    border-radius: 14px;
    border: none;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-secondary {
    background: var(--bg-secondary-dark);
    color: var(--text-primary-dark);
}

body.light-mode .btn-secondary {
    background: var(--bg-secondary-light);
    color: var(--text-primary-light);
}

.btn-secondary:hover {
    background: var(--bg-tertiary-dark);
}

body.light-mode .btn-secondary:hover {
    background: var(--bg-tertiary-light);
}

.btn-primary {
    background: var(--primary-dark);
    color: white;
}

body.light-mode .btn-primary {
    background: var(--primary-light);
}

.btn-primary:hover {
    background: var(--primary-hover-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(167, 139, 250, 0.4);
}

body.light-mode .btn-primary:hover {
    background: var(--primary-hover-light);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

.btn:active {
    transform: scale(0.97);
}

/* ===== TIMETABLE MODAL STEPS ===== */
#modal-step1[data-state="hidden"],
#modal-step2[data-state="hidden"],
#modal-loading[data-state="hidden"] {
    display: none !important;
}

#modal-step1[data-state="active"],
#modal-step2[data-state="active"],
#modal-loading[data-state="active"] {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.timetable-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
}

.school-option {
    padding: 16px;
    background: var(--bg-secondary-dark);
    border: 2px solid var(--border-dark);
    border-radius: var(--radius-md);
    color: var(--text-primary-dark);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s var(--transition);
    text-align: center;
}

body.light-mode .school-option {
    background: var(--bg-secondary-light);
    border-color: var(--border-light);
    color: var(--text-primary-light);
}

.school-option:hover {
    border-color: var(--primary-dark);
    background: var(--primary-bg-dark);
}

body.light-mode .school-option:hover {
    border-color: var(--primary-light);
    background: var(--primary-bg-light);
}

.school-option.selected {
    border-color: var(--primary-dark);
    background: var(--primary-bg-dark);
    color: var(--primary-dark);
}

body.light-mode .school-option.selected {
    border-color: var(--primary-light);
    background: var(--primary-bg-light);
    color: var(--primary-light);
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 700;
    color: var(--text-secondary-dark);
    letter-spacing: -0.01em;
}

body.light-mode .form-label {
    color: var(--text-secondary-light);
}

.form-input,
.form-select {
    width: 100%;
    height: 54px;
    padding: 0 18px;
    background: var(--bg-secondary-dark);
    border: 1.5px solid var(--border-dark);
    border-radius: var(--radius-md);
    color: var(--text-primary-dark);
    font-size: 16px;
    outline: none;
    transition: all 0.2s var(--transition);
}

body.light-mode .form-input,
body.light-mode .form-select {
    background: var(--bg-secondary-light);
    border-color: var(--border-light);
    color: var(--text-primary-light);
}

.form-input:focus,
.form-select:focus {
    border-color: var(--primary-dark);
    box-shadow: 0 0 0 4px var(--primary-bg-dark);
}

body.light-mode .form-input:focus,
body.light-mode .form-select:focus {
    border-color: var(--primary-light);
    box-shadow: 0 0 0 4px var(--primary-bg-light);
}

/* Timetable Table */
.timetable-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border: 1.5px solid var(--border-dark);
    border-radius: var(--radius-md);
    overflow: hidden;
}

body.light-mode .timetable-table {
    border-color: var(--border-light);
}

.timetable-table th,
.timetable-table td {
    padding: 14px 10px;
    text-align: center;
    border-bottom: 1px solid var(--border-dark);
    border-right: 1px solid var(--border-dark);
}

body.light-mode .timetable-table th,
body.light-mode .timetable-table td {
    border-color: var(--border-light);
}

.timetable-table th {
    background: var(--bg-tertiary-dark);
    font-weight: 700;
    font-size: 13px;
    color: var(--text-secondary-dark);
}

body.light-mode .timetable-table th {
    background: var(--bg-tertiary-light);
    color: var(--text-secondary-light);
}

.timetable-table tr:last-child td {
    border-bottom: none;
}

.timetable-table th:last-child,
.timetable-table td:last-child {
    border-right: none;
}

.timetable-table input {
    width: 100%;
    border: none;
    background: transparent;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary-dark);
    outline: none;
    padding: 4px;
}

body.light-mode .timetable-table input {
    color: var(--text-primary-light);
}

.timetable-table input:focus {
    background: var(--primary-bg-dark);
    border-radius: var(--radius-xs);
}

body.light-mode .timetable-table input:focus {
    background: var(--primary-bg-light);
}

/* Loading State */
#modal-loading {
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 60px 24px;
}

.loading-spinner {
    width: 56px;
    height: 56px;
    border: 5px solid var(--border-dark);
    border-top-color: var(--primary-dark);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

body.light-mode .loading-spinner {
    border-color: var(--border-light);
    border-top-color: var(--primary-light);
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-secondary-dark);
}

body.light-mode .loading-text {
    color: var(--text-secondary-light);
}

/* ===== EXTERNAL LINK WARNING MODAL ===== */
#external-link-warning .modal-content {
    max-width: 440px;
    border-radius: 24px;
}

#external-link-warning .modal-handle {
    display: none;
}

#external-link-warning .modal-header {
    padding: 32px 24px 0;
    justify-content: center;
    text-align: center;
}

#external-link-warning .modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
}

#external-link-warning .modal-body {
    text-align: center;
    padding: 24px 24px 32px;
}

#warning-icon {
    font-size: 64px;
    margin-bottom: 20px;
    animation: bounce 0.6s var(--transition);
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

#warning-site-name {
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 10px;
    word-break: break-word;
}

#warning-desc {
    font-size: 14px;
    color: var(--text-secondary-dark);
    line-height: 1.5;
    margin-bottom: 20px;
}

body.light-mode #warning-desc {
    color: var(--text-secondary-light);
}

#warning-url {
    font-size: 13px;
    color: var(--text-tertiary-dark);
    word-break: break-all;
    padding: 14px;
    background: var(--bg-secondary-dark);
    border-radius: var(--radius-md);
    font-family: 'SF Mono', 'Monaco', monospace;
}

body.light-mode #warning-url {
    color: var(--text-tertiary-light);
    background: var(--bg-secondary-light);
}

#external-link-warning .modal-actions {
    padding: 0 24px 24px;
    border-top: none;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
    #chat-header-bar {
        padding: 14px 16px 10px;
    }
    
    #chat-title {
        font-size: 22px;
    }
    
    #chat-container {
        padding: 0 16px 16px;
        gap: 16px;
    }
    
    .message-bubble {
        max-width: 88%;
        font-size: 15px;
    }
    
    .modal-content {
        border-radius: 24px 24px 0 0;
    }
    
    .modal-header {
        padding: 8px 20px 14px;
    }
    
    .modal-title {
        font-size: 20px;
    }
    
    .modal-body {
        padding: 0 20px 20px;
    }
    
    .modal-actions {
        padding: 14px 20px;
        padding-bottom: calc(14px + env(safe-area-inset-bottom));
    }
    
    .btn {
        height: 52px;
        font-size: 15px;
    }
    
    #theme-toggle,
    #theme-toggle-chat {
        width: 44px;
        height: 44px;
    }
}

/* ===== SAFE AREA ===== */
@supports (padding: max(0px)) {
    #app-wrapper {
        padding-left: max(0px, env(safe-area-inset-left));
        padding-right: max(0px, env(safe-area-inset-right));
    }
    
    #chat-header-bar {
        padding-top: max(16px, env(safe-area-inset-top));
    }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* ===== HOTFIX: 중복 렌더링 방지 ===== */
#app-wrapper > #theme-toggle {
    display: none !important;
}
