import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { resolve } from 'path'
import webpush from 'web-push'

const DIR = `/tmp/push-data`
let DATA_PATH = resolve(`${DIR}/data.json`)

const triggerPushMsg = function (
  subscription: webpush.PushSubscription,
  dataToSend: string
) {
  console.log('triggerPushMsg')
  return webpush.sendNotification(subscription, dataToSend).catch((err) => {
    if (err.statusCode === 404 || err.statusCode === 410) {
      console.log('Subscription has expired or is no longer valid: ', err)

      const data: Record<string, webpush.PushSubscription> = JSON.parse(
        readFileSync(DATA_PATH, 'utf8')
      )
      delete data[subscription.endpoint]
      writeFileSync(DATA_PATH, JSON.stringify(data), 'utf8')
    } else {
      throw err
    }
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!existsSync(DIR)) {
    mkdirSync(DIR)
    writeFileSync(DATA_PATH, JSON.stringify({}), 'utf8')
    DATA_PATH = resolve(`${DIR}/data.json`)
  }
  try {
    const pushData = JSON.stringify(req.body)

    const promises: Promise<any>[] = []
    const data: Record<string, webpush.PushSubscription> = JSON.parse(
      readFileSync(DATA_PATH, 'utf8')
    )
    console.log('handling push send request: ', data)
    Object.values(data).forEach((subsciption: webpush.PushSubscription) => {
      promises.push(triggerPushMsg(subsciption, pushData))
      console.log('sending push notif: ', pushData)
    })
    await Promise.all(promises)
    res.status(200).send(true)
  } catch (e) {
    console.log('error sending push: ', e)
    res.status(500).send(false)
  }
}
