import type { StateStorage } from 'zustand/middleware'

export const chromeLocalStateStorage: StateStorage = {
  async getItem(name) {
    const data = await chrome.storage.local.get(name)
    return data[name]
  },
  async setItem(name, value) {
    await chrome.storage.local.set({ [name]: value })
  },
  async removeItem(name) {
    await chrome.storage.local.remove(name)
  },
}
