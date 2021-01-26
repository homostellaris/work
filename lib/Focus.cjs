const open = require('open')
const doNotDisturb = require('./doNotDisturb.cjs')
const rescuetime = require('./rescuetime.cjs')

class Focus {
  constructor (spotify, rescuetime) {
    this.spotify = spotify
    this.rescuetime = rescuetime
  }

  async start (playlistArgs = []) {
    const uri = playlistArgs.length ? Focus.getUri(...playlistArgs) : null

    await Promise.all([
      doNotDisturb.start(),
      await delay(() => this.spotify.play(uri), 5000),
      rescuetime.start()
    ])
  }
  
  async stop () {
    await Promise.all([
      doNotDisturb.stop(),
      this.spotify.pause(),
      rescuetime.stop()
    ])

    await open('https://i.pinimg.com/originals/16/44/2c/16442cdc90e6ab2acf1b72c6e1a81823.jpg')
  }

  async pause () {
    await this.spotify.setVolume(50)
  }

  async resume () {
    await this.spotify.setVolume(80)
  }

  static getUri(option, value) {
    if (option === '--playlist') {
      if (value === 'chill') {
        return 'spotify:playlist:0CFuMybe6s77w6QQrJjW7d'
      }
      if (value === 'reality') {
        return 'spotify:playlist:4RXCQ40IrIqSgizKptytsx'
      }
    }

    throw new Error(`Arguments not recognised: ${option} ${value}`)
  }
}

async function delay (functionThatReturnsAPromise, ms = 5000) {
  return new Promise(resolve => setTimeout(async () => {
    await functionThatReturnsAPromise()
    resolve()
  }, ms))
}

module.exports = Focus