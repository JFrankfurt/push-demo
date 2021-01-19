export function timeAgo(time: number, now: number): string {
  const diff = now - time

  const sec = diff
  if (sec <= 60) {
    return `${sec}s`
  }

  const min = Math.floor(diff / 60)
  if (min <= 60) {
    return `${min}min`
  }

  const hrs = diff / 3600
  if (hrs <= 24) {
    return `${hrs.toFixed(1)}hr`
  }

  const days = Math.floor(diff / 86400)
  if (days <= 7) {
    return `${days.toFixed(1)}days`
  }

  const weeks = Math.floor(diff / 604800)
  if (weeks <= 4.3) {
    return `${weeks.toFixed(2)}wks`
  }

  const mnths = Math.floor(diff / 2600640)
  if (mnths <= 12) {
    return `${mnths.toFixed(2)}mnths`
  }

  const yrs = Math.floor(diff / 31207680)
  return `${yrs.toFixed(2)}yrs`
}
