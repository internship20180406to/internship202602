const chatFab = document.getElementById('chatFab');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

let isOpen = false;

chatFab.addEventListener('click', function () {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    if (isOpen) chatInput.focus();
});

chatClose.addEventListener('click', function () {
    isOpen = false;
    chatWindow.style.display = 'none';
});

function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (role === 'user' ? 'chat-msg-user' : 'chat-msg-ai');
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    appendMessage('user', text);

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-msg chat-msg-ai chat-loading';
    loadingDiv.textContent = '考え中…';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatSend.disabled = true;
    chatInput.disabled = true;

    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
    })
        .then(res => res.json())
        .then(data => {
            loadingDiv.remove();
            appendMessage('ai', data.reply || ('エラー: ' + (data.error || '不明なエラー')));
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

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});