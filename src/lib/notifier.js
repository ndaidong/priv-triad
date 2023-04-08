// notifier.js

const DISPLAY_TIME = 3000

let timer = null
let $notifier = null

export const notify = (message, timeout = DISPLAY_TIME) => {
  if (timer) {
    clearTimeout(timer)
  }
  if (!$notifier) {
    $notifier = document.createElement('NOTIFIER')
    document.body.appendChild($notifier)
  }
  $notifier.innerHTML = message
  timer = setTimeout(() => {
    document.body.removeChild($notifier)
    $notifier = null
  }, timeout)
  return {
    timer,
    element: $notifier,
  }
}
