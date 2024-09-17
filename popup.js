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
      const currentUrls = Array.from(
        document.querySelectorAll("input[type='checkbox']")
      ).map((checkbox) => checkbox.dataset.url);

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

  //! Himanshu Addd down
  // Check if checkbox is initially checked, and add 'checked' class to container
  if (checkbox.checked) {
    container.classList.add("checked");
  }

  // Add event listener to update background color based on checked state
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      container.classList.add("checked");
    } else {
      container.classList.remove("checked");
    }
  });

  //! Himanshu Addd upp

  document.getElementById("checkboxes").appendChild(container);
}

//!>>>>>>>>
const style = document.createElement("style");
style.textContent = `


   input[type="checkbox"] {
    background-image: -webkit-linear-gradient(hsla(0,0%,0%,.1), hsla(0,0%,100%,.1)),
                      -webkit-linear-gradient(left, #f66 50%, #55ff89 50%);
    background-size: 100% 100%, 200% 100%;
    background-position: 0 0, 15px 0;
    border-radius: 25px;
    box-shadow: inset 0 1px 4px hsla(0,0%,0%,.5),
                inset 0 0 10px hsla(0,0%,0%,.5),
                0 0 0 1px hsla(0,0%,0%,.1),
                0 -1px 2px 2px hsla(0,0%,0%,.25),
                0 2px 2px 2px hsla(0,0%,100%,.75);
    cursor: pointer;
    height: 21px;
    padding-right: 25px;
        width: 57px;
    -webkit-appearance: none;
    -webkit-transition: .25s;
}
 input[type="checkbox"]:after {
    background-color: #eee;
    background-image: -webkit-linear-gradient(hsla(0,0%,100%,.1), hsla(0,0%,0%,.1));
    border-radius: 25px;
    box-shadow: inset 0 1px 1px 1px hsla(0,0%,100%,1),
                inset 0 -1px 1px 1px hsla(0,0%,0%,.25),
                0 1px 3px 1px hsla(0,0%,0%,.5),
                0 0 2px hsla(0,0%,0%,.25);
    content: '';
    display: block;
    height: 22px;
    width: 32px;
}
 input[type="checkbox"]:checked {
    background-position: 0 0, 35px 0;
    padding-left: 25px;
    padding-right: 0;
}

.checkbox-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
    border: 2px solid whitesmoke;
    padding: 5px;
    border-radius: 15px;
    margin-bottom: 10px;
    font-weight: 700;
  }
  .checkbox-container.checked {
    //     color: black;
    // background-color: #1bff00eb;
    // font-weight: 700;
  }


   
    .add-url-container {
        margin: 10px;
    padding: 5px;
    display: flex;
    gap: 14px;
}
  .remove-btn {
    margin-left: 10px;
    color: red;
    cursor: pointer;
  }


   #customUrl{
                font-size: 16px;
                border-radius: 6px;
                line-height: 1.5;
                padding: 4px 10px;
                transition: box-shadow 100ms ease-in, border 100ms ease-in, background-color 100ms ease-in;
                border: 2px solid #dee1e2;
                color: rgb(14, 14, 16);
                background: #dee1e2;
                display: block;
                height: 36px;
}  
                 #customUrl:hover {
                    border-color: #ccc;
                }
                #customUrl:focus{
                    border-color: #9147ff;
                    background: #fff;
                }
  
  #addUrl {
  align-items: center;
  appearance: none;
  background-image: radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%);
  border: 0;
  border-radius: 6px;
  box-shadow: rgba(45, 35, 66, .4) 0 2px 4px,rgba(45, 35, 66, .3) 0 7px 13px -3px,rgba(58, 65, 111, .5) 0 -3px 0 inset;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-family: "JetBrains Mono",monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition: box-shadow .15s,transform .15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow,transform;
  font-size: 18px;
}

#addUrl:focus {
  box-shadow: #3c4fe0 0 0 0 1.5px inset, rgba(45, 35, 66, .4) 0 2px 4px, rgba(45, 35, 66, .3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset;
}

#addUrl:hover {
  box-shadow: rgba(45, 35, 66, .4) 0 4px 8px, rgba(45, 35, 66, .3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset;
  transform: translateY(-2px);
}

#addUrl:active {
  box-shadow: #3c4fe0 0 3px 7px inset;
  transform: translateY(2px);
}


::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
}

::-webkit-scrollbar
{
	width: 10px;
	background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
	background-color: #000000;
	border: 2px solid #555555;
}


`;
document.head.appendChild(style);
//!<<<<<<<<<<<<

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
    url = "https://" + url; // Add default protocol if missing
  }
  return url.toLowerCase();
}

// Function to check for duplicates
function isUniqueUrl(url, existingUrls) {
  return !existingUrls.some((existingUrl) => normalizeUrl(existingUrl) === url);
}
