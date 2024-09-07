document.addEventListener("DOMContentLoaded", () => {
    const checkboxesContainer = document.getElementById("checkboxes");
  
    // Load the current blocked URLs from storage
    chrome.storage.sync.get("blockedUrls", ({ blockedUrls }) => {
      blockedUrls.forEach((url) => {
        createCheckbox(url);
      });
    });
  
    // Add event listener for adding custom URL
    document.getElementById("addUrl").addEventListener("click", () => {
      const customUrlInput = document.getElementById("customUrl");
      const customUrl = normalizeUrl(customUrlInput.value.trim());
  
      if (isValidUrl(customUrl)) {
        // Get the current blocked URLs from checkboxes
        const currentUrls = Array.from(document.querySelectorAll("input[type='checkbox']"))
          .map(checkbox => checkbox.dataset.url);
  
        if (isUniqueUrl(customUrl, currentUrls)) {
          const newUrl = { link: customUrl, blocked: true, isCustom: true }; // Mark as custom
          createCheckbox(newUrl);
          customUrlInput.value = ""; // Clear input
        } else {
          alert("This URL is already in the blocked list."); // Show an error message for duplicates
        }
      } else {
        alert("Please enter a valid URL."); // Show an error message for invalid URLs
      }
    });
  
    // Save the updated blocked URLs
    document.getElementById("save").addEventListener("click", () => {
      const updatedBlockedUrls = [];
      document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        updatedBlockedUrls.push({
          link: checkbox.dataset.url,
          blocked: checkbox.checked,
          isCustom: checkbox.dataset.isCustom === "true", // Preserve custom status
        });
      });
  
      // Send the updated list to the background script
      chrome.runtime.sendMessage(
        { action: "updateBlockedUrls", blockedUrls: updatedBlockedUrls },
        (response) => {
          if (response.status === "success") {
            window.close(); // Close the popup after saving
          }
        }
      );
    });
  });
  
  // Function to create a checkbox for each URL
  function createCheckbox(url) {
    const container = document.createElement("div");
    container.className = "checkbox-container";
  
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = url.blocked;
    checkbox.dataset.url = url.link;
    checkbox.dataset.isCustom = url.isCustom || false; // Mark if custom
  
    const label = document.createElement("label");
    label.textContent = url.link;
  
    container.appendChild(checkbox);
    container.appendChild(label);
  
    // Add a "Remove" button only for custom URLs
    if (url.isCustom) {
      const removeBtn = document.createElement("span");
      removeBtn.textContent = "Remove";
      removeBtn.className = "remove-btn";
      removeBtn.addEventListener("click", () => {
        container.remove(); // Remove from the DOM
      });
      container.appendChild(removeBtn);
    }
  
    document.getElementById("checkboxes").appendChild(container);
  }
  
  // Function to validate the URL
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // Function to normalize the URL
  function normalizeUrl(url) {
    if (!/^https?:\/\//i.test(url)) {
      url = "http://" + url; // Add default protocol if missing
    }
    return url.toLowerCase(); // Normalize to lowercase
  }
  
  // Function to check for duplicates
  function isUniqueUrl(url, existingUrls) {
    return !existingUrls.some(existingUrl => normalizeUrl(existingUrl) === url);
  }
  