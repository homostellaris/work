const open = require('open')
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
    // await open('chrome-extension://eeeningnfkaonkonalpcicgemnnijjhn/unreads.html', {app: 'google chrome'}) TODO: Find out why this won't work
    // TODO: Open Seshy URL
    await open ('https://i.pinimg.com/originals/16/44/2c/16442cdc90e6ab2acf1b72c6e1a81823.jpg')
  }

  async pause () {
    await this.spotify.setVolume(50)
  }

  async resume () {
    await this.spotify.setVolume(80)
  }
}

module.exports = Focus