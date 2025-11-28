// Chrome Extension Background Service Worker
// Handles tab events and manages collected links

let collectedLinks = [];

// Listen for tab activation (switching between tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
    extractLinksFromTab(tab.id);
  }
});

// Listen for tab updates (page load, navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
    extractLinksFromTab(tabId);
  }
});

// Function to extract links from a specific tab
async function extractLinksFromTab(tabId) {
  try {
    // Inject content script if not already injected
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
    
    // Request links from the content script
    chrome.tabs.sendMessage(tabId, { action: 'getLinks' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Error:', chrome.runtime.lastError.message);
        return;
      }
      
      if (response && response.links) {
        // Load existing links from storage first (fixes service worker restart issue)
        chrome.storage.local.get(['links'], (data) => {
          const existingLinks = data.links || [];
          
          // Merge new links with existing ones
          const mergedLinks = existingLinks.concat(response.links);
          
          // Update in-memory cache
          collectedLinks = mergedLinks;
          
          // Store in chrome storage for popup access and persistence
          chrome.storage.local.set({ 
            links: mergedLinks,
            linkCount: mergedLinks.length,
            lastUpdate: new Date().toISOString()
          });
        });
      }
    });
  } catch (error) {
    console.error('Error extracting links:', error);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'downloadLinks') {
    downloadLinksFile();
    sendResponse({ success: true });
  } else if (request.action === 'getStats') {
    chrome.storage.local.get(['linkCount', 'lastUpdate'], (data) => {
      sendResponse({ 
        linkCount: data.linkCount || 0,
        lastUpdate: data.lastUpdate || 'Never'
      });
    });
    return true; // Keep channel open for async response
  } else if (request.action === 'clearLinks') {
    // Clear in-memory cache and storage
    collectedLinks = [];
    chrome.storage.local.set({ 
      links: [],
      linkCount: 0,
      lastUpdate: new Date().toISOString()
    }, () => {
      sendResponse({ success: true });
    });
    return true; // Keep channel open for async response
  }
});

// Function to download collected links as text file
function downloadLinksFile() {
  chrome.storage.local.get(['links'], (data) => {
    const links = data.links || [];
    
    if (links.length === 0) {
      console.log('No links to download');
      return;
    }
    
    // Create text content with all links
    const textContent = links.join('\n');
    
    // Create blob and download
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `collected_links_${timestamp}.txt`;
    
    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download error:', chrome.runtime.lastError);
      } else {
        console.log('Links downloaded successfully');
      }
    });
  });
}

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 
    links: [],
    linkCount: 0,
    lastUpdate: 'Never'
  });
  console.log('Link Collector extension installed');
});
