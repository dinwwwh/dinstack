import { useEffect } from 'react'
import { create } from 'zustand'

const useNotificationStore = create<{
  permission: typeof window.Notification.permission
}>(() => ({
  permission: window.Notification.permission,
}))

export function useNotificationPermission() {
  const store = useNotificationStore()

  // WAY1 for async
  useEffect(() => {
    navigator.permissions.query({ name: 'notifications' }).then(function (notificationPerm) {
      notificationPerm.onchange = function () {
        useNotificationStore.setState({
          permission: notificationPerm.state === 'prompt' ? 'default' : notificationPerm.state,
        })
      }
    })
  }, [])

  // WAY2 for async
  useEffect(() => {
    const id = window.setInterval(() => {
      useNotificationStore.setState({
        permission: window.Notification.permission,
      })
    }, 500)

    return () => {
      window.clearInterval(id)
    }
  }, [])

  const requestPermission = async () => {
    const permission = await window.Notification.requestPermission()
    useNotificationStore.setState({
      permission,
    })

    return permission
  }

  return { permission: store.permission, requestPermission }
}
