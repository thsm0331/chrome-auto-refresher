let isRunning = false;
let targetUrl = "";

chrome.storage.local.get(['targetUrl', 'isRunning'], (data) => {
  if (data.targetUrl) targetUrl = data.targetUrl;
  if (data.isRunning !== undefined) isRunning = data.isRunning;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.targetUrl) targetUrl = changes.targetUrl.newValue;
  if (changes.isRunning) isRunning = changes.isRunning.newValue;
});

chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (!isRunning || details.type !== "main_frame") return;
    
    if (details.url.startsWith(targetUrl)) {
      if (details.statusCode >= 400) {
        setTimeout(() => {
          if (isRunning) chrome.tabs.reload(details.tabId);
        }, 2000);
      }
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    if (!isRunning || details.type !== "main_frame") return;
    
    if (details.url.startsWith(targetUrl)) {
      setTimeout(() => {
        if (isRunning) chrome.tabs.reload(details.tabId);
      }, 2000);
    }
  },
  { urls: ["<all_urls>"] }
);