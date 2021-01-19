import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { resolve } from 'path'
import webpush from 'web-push'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const DIR = `/tmp/push-data`
  const DATA_PATH = resolve(`${DIR}/data.json`)
  if (!existsSync(DIR)) {
    mkdirSync(DIR)
    writeFileSync(DATA_PATH, JSON.stringify({}), 'utf8')
    console.log('created new data file: ', DATA_PATH)
  }
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
