const urlInput = document.getElementById('urlInput');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

chrome.storage.local.get(['targetUrl', 'isRunning'], (data) => {
  if (data.targetUrl) urlInput.value = data.targetUrl;
  updateUI(data.isRunning);
});

startBtn.addEventListener('click', () => {
  const targetUrl = urlInput.value.trim();
  if (!targetUrl) return alert('URL을 입력해주세요.');

  chrome.storage.local.set({ targetUrl, isRunning: true }, () => {
    updateUI(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[0].id, { url: targetUrl });
    });
  });
});

stopBtn.addEventListener('click', () => {
  chrome.storage.local.set({ isRunning: false }, () => {
    updateUI(false);
  });
});

const updateUI = (isRunning) => {
  startBtn.disabled = isRunning;
  stopBtn.disabled = !isRunning;
  urlInput.disabled = isRunning;
};