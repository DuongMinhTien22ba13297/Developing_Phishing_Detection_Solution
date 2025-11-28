// Popup script for Link Collector extension

document.addEventListener('DOMContentLoaded', function() {
  // Load and display stats and links
  updateStats();
  loadLinks();
  
  // Download button
  document.getElementById('downloadBtn').addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: 'downloadLinks' }, (response) => {
      if (response && response.success) {
        showStatus('Links downloaded successfully!', 'success');
      } else {
        showStatus('Error downloading links', 'error');
      }
    });
  });
  
  // Refresh button
  document.getElementById('refreshBtn').addEventListener('click', function() {
    updateStats();
    loadLinks();
    showStatus('Stats refreshed!', 'success');
  });
  
  // Clear button
  document.getElementById('clearBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all collected links?')) {
      chrome.runtime.sendMessage({ action: 'clearLinks' }, (response) => {
        if (response && response.success) {
          updateStats();
          loadLinks();
          showStatus('All links cleared!', 'success');
        } else {
          showStatus('Error clearing links', 'error');
        }
      });
    }
  });
});

// Function to update statistics display
function updateStats() {
  chrome.runtime.sendMessage({ action: 'getStats' }, (response) => {
    if (response) {
      document.getElementById('linkCount').textContent = response.linkCount || 0;
      
      // Format last update time
      if (response.lastUpdate && response.lastUpdate !== 'Never') {
        const date = new Date(response.lastUpdate);
        const timeStr = date.toLocaleTimeString();
        document.getElementById('lastUpdate').textContent = timeStr;
      } else {
        document.getElementById('lastUpdate').textContent = 'Never';
      }
    }
  });
}

// Function to load and display all links
function loadLinks() {
  chrome.storage.local.get(['links'], (data) => {
    const links = data.links || [];
    const container = document.getElementById('linksContainer');
    
    // Clear container
    container.innerHTML = '';
    
    if (links.length === 0) {
      container.innerHTML = '<div class="no-links">No links collected yet. Visit some websites to start collecting!</div>';
      return;
    }
    
    // Display all links
    links.forEach((link, index) => {
      const linkItem = document.createElement('div');
      linkItem.className = 'link-item';
      
      const linkElement = document.createElement('a');
      linkElement.href = link;
      linkElement.textContent = link;
      linkElement.target = '_blank';
      linkElement.title = link;
      
      linkItem.appendChild(linkElement);
      container.appendChild(linkItem);
    });
  });
}

// Function to show status messages
function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = 'status ' + type;
  
  // Hide after 3 seconds
  setTimeout(() => {
    statusDiv.className = 'status';
  }, 3000);
}
