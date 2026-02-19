const chatFab = document.getElementById('chatFab');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const chatFabInput = document.getElementById('chatFabInput');
const chatFabSend = document.getElementById('chatFabSend');

let chatSessionId = localStorage.getItem('chatSessionId');
if (!chatSessionId) {
    chatSessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatSessionId', chatSessionId);
}

// モード管理（AI / 行員）
let chatMode = 'ai';
let staffPollInterval = null;
let lastSeenMessageId = 0;

const fabModeBtns = document.querySelectorAll('.fab-mode-btn');
fabModeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
        fabModeBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        chatMode = this.getAttribute('data-mode');
        chatFabInput.placeholder = chatMode === 'staff' ? '行員に質問する…' : 'なにか聞きたいことはありますか？';
    });
});

let isOpen = false;

function sendFromFab() {
    const text = chatFabInput.value.trim();
    if (!text) return;

    chatFabInput.value = '';

    if (!isOpen) {
        isOpen = true;
        chatWindow.style.display = 'flex';
    }

    chatInput.value = text;
    sendMessage();
}

chatFabSend.addEventListener('click', sendFromFab);
chatFabInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendFromFab();
    }
});

chatClose.addEventListener('click', function () {
    isOpen = false;
    chatWindow.style.display = 'none';
});

function appendMessage(role, text) {
    const div = document.createElement('div');
    const classMap = { user: 'chat-msg-user', ai: 'chat-msg-ai', staff: 'chat-msg-staff' };
    div.className = 'chat-msg ' + (classMap[role] || 'chat-msg-ai');
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

function saveMessage(sender, content) {
    return fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: chatSessionId, sender: sender, content: content })
    }).then(r => r.json());
}

// 行員返信ポーリング
function startStaffPolling() {
    if (staffPollInterval) return;
    staffPollInterval = setInterval(function () {
        fetch('/api/messages/' + chatSessionId)
            .then(r => r.json())
            .then(function (messages) {
                messages.filter(m => m.id > lastSeenMessageId).forEach(function (m) {
                    lastSeenMessageId = Math.max(lastSeenMessageId, m.id);
                    if (m.sender === 'STAFF') {
                        const waiting = chatMessages.querySelector('.chat-waiting');
                        if (waiting) waiting.remove();
                        appendMessage('staff', '【行員より】' + m.content);
                    }
                });
            });
    }, 3000);
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    appendMessage('user', text);
    saveMessage('USER', text).then(saved => {
        if (saved.id) lastSeenMessageId = Math.max(lastSeenMessageId, saved.id);
    });

    chatSend.disabled = true;
    chatInput.disabled = true;

    if (chatMode === 'staff') {
        // 行員モード: 待機メッセージを表示してポーリング開始
        const waitDiv = appendMessage('ai', '行員に送信しました。しばらくお待ちください…');
        waitDiv.classList.add('chat-waiting', 'chat-loading');
        startStaffPolling();
        chatSend.disabled = false;
        chatInput.disabled = false;
        chatInput.focus();
    } else {
        // AIモード: OpenRouter に投げる
        const loadingDiv = appendMessage('ai', '考え中…');
        loadingDiv.classList.add('chat-loading');

        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        })
            .then(res => res.json())
            .then(data => {
                loadingDiv.remove();
                const reply = data.reply || ('エラー: ' + (data.error || '不明なエラー'));
                appendMessage('ai', reply);
                saveMessage('AI', reply);
            })
            .catch(() => {
                loadingDiv.remove();
                appendMessage('ai', '通信エラーが発生しました');
            })
            .finally(() => {
                chatSend.disabled = false;
                chatInput.disabled = false;
                chatInput.focus();
            });
    }
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// テキスト選択時のポップアップボタン
const selectionAskBtn = document.getElementById('selectionAskBtn');

document.addEventListener('mouseup', function (e) {
    if (e.target === selectionAskBtn) return;

    setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText.length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            selectionAskBtn.style.display = 'block';
            const btnWidth = selectionAskBtn.offsetWidth;

            let top = rect.top - 40;
            let left = rect.left + rect.width / 2 - btnWidth / 2;

            if (top < 4) top = rect.bottom + 8;
            if (left < 4) left = 4;
            if (left + btnWidth > window.innerWidth - 4) left = window.innerWidth - btnWidth - 4;

            selectionAskBtn.style.top = top + 'px';
            selectionAskBtn.style.left = left + 'px';
        } else {
            selectionAskBtn.style.display = 'none';
        }
    }, 10);
});

document.addEventListener('mousedown', function (e) {
    if (e.target !== selectionAskBtn) {
        selectionAskBtn.style.display = 'none';
    }
});

selectionAskBtn.addEventListener('mousedown', function (e) {
    e.preventDefault();
});

selectionAskBtn.addEventListener('click', function () {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) return;

    selectionAskBtn.style.display = 'none';
    window.getSelection().removeAllRanges();

    if (!isOpen) {
        isOpen = true;
        chatWindow.style.display = 'flex';
    }

    chatInput.value = '「' + selectedText + '」について教えてください';
    sendMessage();
});