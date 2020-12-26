const axios = require('axios')

async function start (duration = 50) {
  await axios.post(
    'https://www.rescuetime.com/anapi/start_focustime',
    {},
    {
      params: {
        key: process.env.RESCUE_TIME_API_KEY,
        duration
      }
    }
  )
}

async function stop () {
  await axios.post(
    'https://www.rescuetime.com/anapi/end_focustime',
    {},
    {
      params: {
        key: process.env.RESCUE_TIME_API_KEY,
      }
    }
  )
}

module.exports = {
  start,
  stop
}