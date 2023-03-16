// background.ts
let timerActive = false
let remainingTime = 25 * 60
let initialTime = 25 * 60

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup') {
    port.onMessage.addListener((message) => {
      if (message.type === 'getTimerState') {
        port.postMessage({
          type: 'updateTimerState',
          timerActive,
          remainingTime,
        })
      }
    })
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getTimerState') {
    sendResponse({ timerActive, remainingTime })
  } else if (message.type === 'toggleTimer') {
    console.log('toggleTimer called')
    timerActive = !timerActive

    if (timerActive) {
      chrome.alarms.create('timer', { periodInMinutes: 1 / 60 })
    } else {
      chrome.alarms.clear('timer')
    }
  }
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'timer') {
    remainingTime -= 1
    if (remainingTime <= 0) {
      timerActive = false
      remainingTime = initialTime
      chrome.alarms.clear('timer')
    }
  }
})
