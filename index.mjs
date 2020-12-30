import Break from './lib/Break.mjs'
import day from './lib/day.mjs'
import Focus from './lib/Focus.cjs'
import rescuetime from './lib/rescuetime.cjs'
import Spotify from './lib/Spotify.cjs'

// process.on('unhandledRejection', error => {
//   console.log('Unhandled rejection:', error.message);
// });

const [_, __, command, subcommand, ...args] = process.argv

if (command === 'day') {
  if (subcommand === 'start') {
    day.start()
  } else if (subcommand === 'stop') {
    day.stop()
  }
}
else if (command === 'focus') {
  const focus = new Focus(await Spotify.getInstance(), rescuetime)

  if (subcommand === 'start') {
    await focus.start(...args)
  } else if (subcommand === 'stop') {
    await focus.stop()
  } else if (subcommand === 'pause') {
    await focus.pause()
  } else if (subcommand === 'resume') {
    await focus.resume()
  }
}
else if (command === 'break') {
  const $break = new Break(await Spotify.getInstance())
  if (subcommand === 'start') {
    await $break.start()
  } else if (subcommand === 'stop') {
    await $break.stop()
  }
}
else {
  throw new Error(`Unknown command '${command}'`)
}
