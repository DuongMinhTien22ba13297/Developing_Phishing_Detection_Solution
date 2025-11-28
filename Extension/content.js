// Content script that runs on web pages
// Extracts all links from the current page

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getLinks') {
    const links = extractAllLinks();
    sendResponse({ links: links });
  }
  return true;
});

// Function to extract all links from the page
function extractAllLinks() {
  const links = [];
  const anchorElements = document.querySelectorAll('a[href]');
  
  anchorElements.forEach((anchor) => {
    const href = anchor.href;
    
    // Filter out javascript:, mailto:, tel: and empty links
    if (href && 
        !href.startsWith('javascript:') && 
        !href.startsWith('mailto:') && 
        !href.startsWith('tel:') &&
        href.trim() !== '') {
      links.push(href);
    }
  });
  
  return links;
}

// Auto-extract links when content script loads
(function() {
  // Wait a bit for dynamic content to load
  setTimeout(() => {
    const links = extractAllLinks();
    if (links.length > 0) {
      // Send links to background script
      chrome.runtime.sendMessage({
        action: 'linksExtracted',
        links: links
      });
    }
  }, 1000);
})();
