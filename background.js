// Initialize the blocked URLs in Chrome storage
chrome.runtime.onInstalled.addListener(() => {
  const defaultBlockedUrls = [
    { link: "twitter.com", blocked: true },
    { link: "facebook.com", blocked: true },
    { link: "instagram.com", blocked: true },
    { link: "linkedin.com", blocked: true },
    { link: "web.whatsapp.com", blocked: true },
    { link: "reddit.com", blocked: true },
    { link: "pinterest.com", blocked: true },
    { link: "discord.com", blocked: true },
    { link: "x.com", blocked: true },
  ];
  chrome.storage.sync.set({ blockedUrls: defaultBlockedUrls });
});

// Listen for updates from popup UI and update storage
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateBlockedUrls") {
    chrome.storage.sync.set({ blockedUrls: request.blockedUrls }, () => {
      sendResponse({ status: "success" });
    });
    return true; // Keep the message channel open for sendResponse
  }
});
