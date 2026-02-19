const chatFab = document.getElementById('chatFab');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

const chatFabInput = document.getElementById('chatFabInput');
const chatFabSend = document.getElementById('chatFabSend');

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
    e.preventDefault(); // クリック時に選択が解除されないようにする
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