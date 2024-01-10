import { chromeLocalStateStorage } from '@extension/lib/zustand'
import { config } from '@web/lib/config'

config.stores.auth.getStorage = () => chromeLocalStateStorage
