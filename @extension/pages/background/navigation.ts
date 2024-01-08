const OPEN_SIDE_PANEL_ID = 'OPEN_SIDE_PANEL_ID'

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: OPEN_SIDE_PANEL_ID,
    title: 'Open sidebar',
    contexts: ['action'],
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab) return

  if (info.menuItemId === OPEN_SIDE_PANEL_ID) {
    chrome.sidePanel.open({ windowId: tab.windowId })
  }
})
