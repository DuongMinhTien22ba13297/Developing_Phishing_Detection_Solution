# 🔗 Link Collector - Chrome Extension

A Chrome extension that automatically collects all links from websites you visit and saves them to a text file.

## Features

- ✅ **Automatic Link Detection** - Collects links automatically when you open or switch tabs
- ✅ **Single File Collection** - All links are saved to one continuous text file
- ✅ **Easy Export** - Download your collected links with one click
- ✅ **Live Statistics** - View the number of collected links and last update time
- ✅ **Clear Function** - Reset your collection anytime

## Installation

1. Clone or download this repository
2. Open Google Chrome
3. Navigate to `chrome://extensions/`
4. Enable **Developer mode** (toggle in top right)
5. Click **Load unpacked**
6. Select the extension folder (containing `manifest.json`)
7. The extension is now installed!

## How to Use

1. **Browse normally** - The extension works automatically in the background
2. **Switch tabs** - Links are collected each time you open or switch to a tab
3. **View stats** - Click the extension icon to see collection statistics
4. **Download links** - Click "Download Links" to save all collected links as a text file
5. **Clear links** - Use "Clear All Links" to start fresh

## File Structure

```
.
├── manifest.json      # Extension configuration
├── background.js      # Background service worker (tab event handling)
├── content.js         # Content script (link extraction)
├── popup.html         # Extension popup UI
├── popup.js           # Popup logic
├── icon16.png         # Extension icon (16x16)
├── icon48.png         # Extension icon (48x48)
├── icon128.png        # Extension icon (128x128)
└── README.md          # This file
```

## How It Works

1. **Tab Events**: The background script listens for tab activation and updates
2. **Link Extraction**: When a tab loads, the content script extracts all `<a>` tags
3. **Storage**: Links are stored in Chrome's local storage
4. **Download**: Clicking "Download Links" generates a text file with all collected links

## Permissions

- `tabs` - To detect tab switching
- `scripting` - To inject content scripts
- `downloads` - To save the text file
- `storage` - To store collected links
- `activeTab` - To access the current tab
- `<all_urls>` - To work on all websites

## Notes

- The extension automatically filters out `javascript:`, `mailto:`, and `tel:` links
- Chrome internal pages (`chrome://`) are excluded for security reasons
- Links are saved with timestamps in the filename

## Version

1.0.0

## License

MIT
