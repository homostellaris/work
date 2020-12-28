class Break {
  constructor (spotify) {
    this.spotify = spotify
  }

  async start () {
    await this.spotify.transferPlaybackToMobileDevice()
  }
  
  async stop () {
    await this.spotify.transferPlaybackToWorkDevice()
  }
}

export default Break
