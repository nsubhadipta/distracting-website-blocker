// Get the current URL and check if it's in the blocked list
chrome.storage.sync.get("blockedUrls", ({ blockedUrls }) => {
    const currentUrl = window.location.origin;
  
    blockedUrls.forEach((element) => {
      if (element.blocked && currentUrl.includes(element.link)) {
        document.body.innerHTML =
          '<div><img src="https://i.ibb.co/r0RScrj/banner.jpg" style="margin: 0px auto; height: 100vh; display: flex;"></div>';
      }
    });
  });
  