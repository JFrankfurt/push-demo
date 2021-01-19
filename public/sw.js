self.addEventListener('install', function (event) {
  console.log('Hello world from the Service Worker 🤙')
})

self.addEventListener('push', function (event) {
  const data = JSON.parse(event.data.json())
  console.log('received push event', event, data)
  const title = `message from ${data.username}`
  const options = {
    body: data.message,
    icon: '/favicon.png',
    image: '/image.png',
    sound: '/audio.mp3',
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

  const promiseChain = self.registration.showNotification(title, options)
  event.waitUntil(promiseChain)
})
