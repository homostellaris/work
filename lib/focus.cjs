const doNotDisturb = require('./doNotDisturb.cjs')
const rescuetime = require('./rescuetime.cjs')

class Focus {
  constructor (spotify, rescuetime) {
    this.spotify = spotify
    this.rescuetime = rescuetime
  }

  async start (args) {
    // TODO: Update GitHub status
    // TODO: Update Slack status
    await Promise.all([
      doNotDisturb.start(),
      this.spotify.play(),
      rescuetime.start()
    ])
  }
  
  async stop () {
    // TODO: Open web page with work day info and the day's quote?
    // TODO: Open the notification center
    await Promise.all([
      doNotDisturb.stop(),
      this.spotify.pause(),
      rescuetime.stop()
    ])
  }

  async pause () {
    await this.spotify.setVolume(50)
  }

  async resume () {
    await this.spotify.setVolume(80)
  }
}

module.exports = Focus