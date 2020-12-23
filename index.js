const axios = require('axios');
const { exec } = require("child_process");
const doNotDisturb = require('@sindresorhus/do-not-disturb');
const Spotify = require('./lib/spotify')

process.on('unhandledRejection', error => {
  console.log('Unhandled rejection:', error.message);
});

const subcommand = process.argv[2]

let spotify;

Spotify.getInstance()
  .then(spotifyInstance => {
    spotify = spotifyInstance

    if (subcommand === 'start') {
      startFocusing()
        .then(() => console.log('Started focusing.'))
    } else if (subcommand === 'stop') {
      stopFocusing()
        .then(() => console.log('Stopped focusing.'))
    } else if (subcommand === 'init') {
      init()
    } else {
      throw new Error(`Unknown subcommand '${subcommand}'`)
    }
  })

function init () {
  // See https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
  // TODO: Consider using a library to create a HTTP server to do all this programmatically.

  console.log("After granting the app permissions and being redirected, copy the code query param in the URL.")

  // TODO: Consider using state.
  const spotifyOauthUrl = `https://accounts.spotify.com/authorize?client_id=1ac730094cc745c98fba1fe32f23ed19&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=user-read-playback-state%20user-modify-playback-state%20user-read-currently-playing`
  exec(`open '${spotifyOauthUrl}'`)

  console.log('Now exchange the authorization code for access and refresh tokens: curl -H "Authorization: Basic <base64 encoded client_id:client_secret>" -d grant_type=authorization_code -d code=MQCbtKe...44KN -d redirect_uri=https%3A%2F%2Fexample.com%2Fcallback https://accounts.spotify.com/api/token')
  console.log("Don't forget to use the -n flag when base64 encoding the client credentials: echo -n 'client_id:client_secret' | base64")
}

async function startFocusing () {
  // TODO: Update GitHub status
  // TODO: Update Slack status
  await Promise.all([
    startDoNotDisturbMacOS(),
    spotify.play(),
    startRescueTimeFocusTime()
  ])
}

async function stopFocusing () {
  await Promise.all([
    stopDoNotDisturbMacOS(),
    spotify.pause(),
    stopRescueTimeFocusTime()
  ])
}

async function startRescueTimeFocusTime (duration = 50) {
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

async function stopRescueTimeFocusTime () {
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

async function startDoNotDisturbMacOS () {
  await doNotDisturb.enable()
}

async function stopDoNotDisturbMacOS () {
  await doNotDisturb.disable()
}
