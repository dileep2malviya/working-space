import { useEffect, useState } from "react"

export const useCountDown = (targetTime) => {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (!targetTime) return

    let interval

    const update = () => {
      const remaining = Math.max(
        0,
        Math.ceil((targetTime - Date.now()) / 1000)
      )

      setTimeLeft(remaining)

      if (remaining === 0 && interval) {
        clearInterval(interval)
      }
    }

    update()

    interval = setInterval(update, 1000)

    return () => clearInterval(interval)
  }, [targetTime])

  return timeLeft
};