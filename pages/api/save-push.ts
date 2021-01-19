import webpush from 'web-push'
import { data } from 'data'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('saved push subscription: ', req.body)
  webpush.setVapidDetails(
    'mailto:jordanwfrankfurt@gmail.com',
    process.env.VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string
  )
  if (!req.body?.pushSubscription) {
    res.status(500).send(false)
  }
  const { endpoint } = req.body.pushSubscription
  // @ts-ignore
  data[endpoint] = req.body.pushSubscription
  res.status(200).send(true)
}
