chrome.storage.local.get(['targetUrl', 'isRunning'], (data) => {
  if (!data.isRunning || !data.targetUrl) return;

  if (window.location.href.startsWith(data.targetUrl)) {
    checkPage();
  }
});

const checkPage = () => {
  const pageText = document.body.innerText;
  
  const isQueueOrError = pageText.includes("접속 대기") ||
                         pageText.includes("잠시 후 다시 시도") ||
                         pageText.includes("대기열") ||
                         pageText.trim() === "";

  if (isQueueOrError) {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } else {
    chrome.storage.local.set({ isRunning: false }, () => {
      notifySuccess();
    });
  }
};

const notifySuccess = () => {
  if (Notification.permission === "granted") {
    new Notification("접속 성공", { body: "목표 페이지 접속에 성공했습니다!" });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("접속 성공", { body: "목표 페이지 접속에 성공했습니다!" });
      }
    });
  }
  setTimeout(() => alert("페이지 접속에 성공했습니다!"), 500);
};