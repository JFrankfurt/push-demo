import { css } from '@emotion/core'
import Layout from 'components/Layout'
import { useEffect, useState } from 'react'
import { theme } from 'styles/theme'

const rootCss = css`
  background-color: ${theme.palette.bone};
  border: 6px double white;
  margin: 0 auto;
  max-width: 800px;
  padding: 1em;
  position: relative;
  @media screen and (min-width: ${theme.width.tablet}) {
    margin: 1em auto;
    width: 80%;
  }
`

const sectionCss = css`
  display: flex;
  flex-direction: column;
  margin: 1em 0;
`

const titleCss = css`
  font-family: monospace;
`

function urlBase64ToUint8Array(base64String: string) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  var rawData = window.atob(base64)
  var outputArray = new Uint8Array(rawData.length)

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const Index = () => {
  const [permission, setPermission] = useState('')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setPermission(Notification.permission)
  }, [])

  function acceptPush() {
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (
        result
      ) {
        resolve(result)
      })
      if (permissionResult) {
        permissionResult.then(resolve, reject)
      }
    }).then((permissionResult) => setPermission(permissionResult as string))
  }

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log(registration)
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_KEY as string
        ),
      })

      await fetch('/api/save-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pushSubscription }),
      })
      return pushSubscription
    } catch (e) {
      console.error(e)
    }
  }

  async function sendPush() {
    fetch('/api/send-push', {
      method: 'POST',
      body: JSON.stringify({ username, message }),
    })
  }

  async function cleanup() {
    const registration = await navigator.serviceWorker.register('/sw.js')
    const success = await registration.unregister()
    console.log('removing service worker registration:  ', success)
  }

  return (
    <Layout>
      <main css={rootCss}>
        <div css={titleCss}>check the console to see what's happening 👾</div>
        <section css={sectionCss}>
          <div>notification permission state: {permission}</div>
          <button onClick={acceptPush} disabled={permission === 'granted'}>
            step #1 - give permission
          </button>
        </section>
        <section css={sectionCss}>
          <button onClick={subscribeToPush}>
            Step #2 - subscribe to push service
          </button>
        </section>
        <section css={sectionCss}>
          <input
            placeholder="username"
            type="text"
            value={username}
            onChange={({ target: { value } }) => setUsername(value)}
          />
          <textarea
            placeholder="message"
            value={message}
            onChange={({ target: { value } }) => setMessage(value)}
          />
          <button onClick={sendPush}> step #3 - send push! 🎉</button>
        </section>
        <section css={sectionCss}>
          <button onClick={cleanup}>
            clean up sw registration (goto step #2)
          </button>
        </section>
      </main>
    </Layout>
  )
}

export default Index
