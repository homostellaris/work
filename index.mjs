import $break from './lib/break.mjs' // The dollar sign is used to make explicit this is a variable rather than the 'break' keyword which is invalid as a variable name.
import day from './lib/day.mjs'
import Focus from './lib/focus.cjs'
import rescuetime from './lib/rescuetime.cjs'
import Spotify from './lib/spotify.cjs'

// process.on('unhandledRejection', error => {
//   console.log('Unhandled rejection:', error.message);
// });

const [_, __, command, subcommand] = process.argv

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
    await focus.start()
  } else if (subcommand === 'stop') {
    await focus.stop()
  }
}
else if (command === 'break') {
  if (subcommand === 'start') {
    $break.start()
  } else if (subcommand === 'stop') {
    $break.stop()
  }
}
else {
  throw new Error(`Unknown subcommand '${command}'`)
}
