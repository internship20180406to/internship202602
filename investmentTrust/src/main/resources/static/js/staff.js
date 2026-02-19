let currentSessionId = null;
let messagesPollInterval = null;
let lastSeenMessageId = 0;

const sessionList = document.getElementById('sessionList');
const sessionCount = document.getElementById('sessionCount');
const staffChatEmpty = document.getElementById('staffChatEmpty');
const staffChatActive = document.getElementById('staffChatActive');
const staffChatHeader = document.getElementById('staffChatHeader');
const staffChatMessages = document.getElementById('staffChatMessages');
const staffInput = document.getElementById('staffInput');
const staffSend = document.getElementById('staffSend');

// セッション一覧の読み込み
function loadSessions() {
    fetch('/api/messages/sessions')
        .then(r => r.json())
        .then(sessions => {
            sessionCount.textContent = sessions.length;
            sessionList.innerHTML = sessions.map(s => {
                const shortId = s.sessionId.slice(-8);
                const time = s.lastTime ? new Date(s.lastTime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) : '';
                const isActive = s.sessionId === currentSessionId ? ' active' : '';
                return `<div class="session-item${isActive}" onclick="selectSession('${s.sessionId}')">
                    <div class="session-id">客 #${shortId}</div>
                    <div class="session-last-msg">${escapeHtml(s.lastMessage)}</div>
                    <div class="session-time">${time}</div>
                </div>`;
            }).join('');
        })
        .catch(() => {});
}

// セッション選択
function selectSession(sessionId) {
    currentSessionId = sessionId;
    lastSeenMessageId = 0;

    staffChatEmpty.style.display = 'none';
    staffChatActive.style.display = 'flex';
    staffChatHeader.textContent = '客 #' + sessionId.slice(-8) + ' との会話';

    loadMessages(true);

    if (messagesPollInterval) clearInterval(messagesPollInterval);
    messagesPollInterval = setInterval(() => loadMessages(false), 3000);

    loadSessions();
}

// メッセージ読み込み
function loadMessages(scrollToBottom) {
    if (!currentSessionId) return;
    fetch('/api/messages/' + currentSessionId)
        .then(r => r.json())
        .then(messages => {
            const newMessages = messages.filter(m => m.id > lastSeenMessageId);
            newMessages.forEach(m => {
                lastSeenMessageId = Math.max(lastSeenMessageId, m.id);
                appendStaffMessage(m.sender, m.content);
            });
            if (scrollToBottom || newMessages.length > 0) {
                staffChatMessages.scrollTop = staffChatMessages.scrollHeight;
            }
        })
        .catch(() => {});
}

function appendStaffMessage(sender, text) {
    const div = document.createElement('div');
    const labelMap = { USER: '客', AI: 'AI', STAFF: '行員（自分）' };
    const classMap = { USER: 'chat-msg-user', AI: 'chat-msg-ai', STAFF: 'chat-msg-staff' };
    div.className = 'chat-msg ' + (classMap[sender] || 'chat-msg-ai');
    div.textContent = text;
    staffChatMessages.appendChild(div);
}

// 行員から返信送信
function sendStaffReply() {
    const text = staffInput.value.trim();
    if (!text || !currentSessionId) return;

    staffInput.value = '';
    staffSend.disabled = true;

    fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSessionId, sender: 'STAFF', content: text })
    })
        .then(r => r.json())
        .then(msg => {
            lastSeenMessageId = Math.max(lastSeenMessageId, msg.id);
            appendStaffMessage('STAFF', msg.content);
            staffChatMessages.scrollTop = staffChatMessages.scrollHeight;
        })
        .finally(() => {
            staffSend.disabled = false;
            staffInput.focus();
        });
}

function escapeHtml(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

staffSend.addEventListener('click', sendStaffReply);
staffInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendStaffReply();
    }
});

// 初期ロード＆5秒ごとにセッション更新
loadSessions();
setInterval(loadSessions, 5000);