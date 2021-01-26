import open from 'open'

const workDayHours = 9

function start () {
  const startTime = new Date();
  const endTime = new Date(new Date(startTime).setHours(startTime.getHours() + workDayHours));

  const startTimeMessage = `You've started your work day at ${startTime.toTimeString()}.`
  const startTimeAdvice = "Remember to eat the frog first 🐸"

  const endTimeMessage = `You should aim to finish at ${endTime.toTimeString()}.`
  const endTimeAdvice = "Remember that finishing on time isn't just good for you it's good for others who depend on you too 🏡"

  console.info(startTimeMessage, startTimeAdvice)
  console.info(endTimeMessage, endTimeAdvice)

  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  open(`https://www.rescuetime.com/browse/highlights/for/the/day/of/${yesterday.toISOString().split('T')[0]}`)
  open(`https://www.rescuetime.com/browse/goals/by/day`)
}

function stop () {
  console.info(`You finished at ${new Date().toTimeString()}.`)
  open('https://www.rescuetime.com/browse/highlights')
}

export default {start, stop}