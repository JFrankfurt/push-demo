self.addEventListener('install', function (event) {
  console.log('Hello world from the Service Worker 🤙')
})

self.addEventListener('push', function (event) {
  const eventData = event.data.json()
  const data = typeof eventData === 'string' ? JSON.parse(eventData) : eventData
  const { message, username } = data

  const title = `message from ${username}`
  const options = {
    body: message,
    lang: 'en',
    icon: '/image192.png',
    image: '/image.png',
    sound: '/audio.mp3',
    timestamp: Date.parse('01 Jan 2021 00:00:00'),
    vibrate: [
      500,
      110,
      500,
      110,
      450,
      110,
      200,
      110,
      170,
      40,
      450,
      110,
      200,
      110,
      170,
      40,
      500,
    ],
  }

  if ('actions' in Notification.prototype) {
    options.actions = [
      {
        action: 'coffee-action',
        title: 'Coffee',
        icon: '/action1.png',
      },
      {
        action: 'doughnut-action',
        title: 'Doughnut',
        icon: '/action2.png',
      },
    ]
  }
  new Notification(title, options)
  // const promiseChain = self.registration.showNotification(notification)
  // event.waitUntil(promiseChain)
})
