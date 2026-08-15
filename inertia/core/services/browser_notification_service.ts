import { toast } from 'vue3-toastify'

export class BrowserNotificationService {
  static requestNotificationPermission() {
    return new Promise((resolve) => {
      if ('Notification' in window) {
        // Check if the current context allows for requesting permission
        if (Notification.permission === 'default' && document.visibilityState === 'visible') {
          document.addEventListener(
            'click',
            () => {
              Notification.requestPermission().then(resolve)
            },
            { once: true }
          )
        } else {
          resolve(Notification.permission)
        }
      } else {
        resolve('denied')
      }
    })
  }

  static createNotification(title, { body }) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, { body })
      notification.onclick = function () {
        window.focus()
      }
    }
  }

  static createNotificationToast(title, { body, type }) {
    toast(`<b>${title}</b> <br /> ${body}`, {
      type,
      dangerouslyHTMLString: true,
      autoClose: false,
      style: {
        width: '400px',
      },
      position: toast.POSITION.BOTTOM_RIGHT,
      theme: 'auto',
    })
  }

  static setupVisibilityChangeListener(title, options) {
    if (!document.hasFocus()) {
      BrowserNotificationService.createNotification(title, options)
      return
    }
    BrowserNotificationService.createNotificationToast(title, options)
  }

  static notify(title, options) {
    BrowserNotificationService.requestNotificationPermission().then((permission) => {
      if (permission === 'granted') {
        BrowserNotificationService.setupVisibilityChangeListener(title, options)
      }
    })
  }
}
