import webpush from 'web-push'
import { data } from 'data'
import { NextApiRequest, NextApiResponse } from 'next'

const triggerPushMsg = function (
  subscription: webpush.PushSubscription,
  dataToSend: string
) {
  console.log('triggerPushMsg')
  return webpush.sendNotification(subscription, dataToSend).catch((err) => {
    if (err.statusCode === 404 || err.statusCode === 410) {
      console.log('Subscription has expired or is no longer valid: ', err)
      // @ts-ignore
      delete data[subscription.endpoint]
    } else {
      throw err
    }
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pushData = JSON.stringify(req.body)
    console.log(data)
    const promises: Promise<any>[] = []
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
