import webpush from 'web-push'
import { NextApiRequest, NextApiResponse } from 'next'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const DATA_PATH = resolve('data.json')

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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
    const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'))
    data[endpoint] = req.body.pushSubscription
    writeFileSync(DATA_PATH, JSON.stringify(data), 'utf8')
    res.status(200).send(true)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}
