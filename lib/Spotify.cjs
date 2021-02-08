const axios = require('axios');
const querystring = require('querystring');

class Spotify {
  static async getInstance() {
    const base64EncodedClientIdAndSecret = Spotify.getBase64EncodedClientIdAndSecret()
    const requestBody = querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
    })

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      requestBody,
      {
        headers: {
          Authorization: `Basic ${base64EncodedClientIdAndSecret}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
      }
    )
    const accessToken = response.data.access_token

    const [workDeviceId, mobileDeviceId] = await Spotify.getDeviceIds(accessToken)

    return new Spotify(accessToken, workDeviceId, mobileDeviceId)
  }

  static getBase64EncodedClientIdAndSecret () {
    return Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
  }

  static async getDeviceIds (accessToken) {
    const {data: {devices}} = await axios.get(
      'https://api.spotify.com/v1/me/player/devices',
      {
        headers: {Authorization: `Bearer ${accessToken}`},
      }
    )

    const workDevice = devices.find(device => device.name === process.env.WORK_DEVICE_NAME)
    const mobileDevice = devices.find(device => device.type === 'Smartphone')

    const workDeviceId = workDevice ? workDevice.id : null
    const mobileDeviceId = mobileDevice ? mobileDevice.id : null

    return [workDeviceId, mobileDeviceId]
  }

  constructor (spotifyAccessToken, workDeviceId, mobileDeviceId) {
    this.axios = axios.create({
      baseURL: 'https://api.spotify.com/v1/me/player/',
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`
      }
    })

    this.workDeviceId = workDeviceId
    this.mobileDeviceId = mobileDeviceId

    if (!workDeviceId) throw new Error(`Missing work device ID: ${this.workDeviceId}`)
  }

  async play (uri) {
    try {
      await this.axios.put(
        'play',
        {
          context_uri: uri
        },
        {
          params: {
           device_id: this.workDeviceId
          }
        },
      )
    }
    catch (error) {
      if (error.response.status === 403 && error.response.data.error.message === 'Player command failed: Restriction violated') {
        console.warn('Spotify is already playing.')
      } else {
        throw error
      }
    }
  }
  
  async pause () {
    try {
      await this.axios.put(
        'pause',
        {},
        {
          params: {
            device_id: this.workDeviceId
          }
        },
      )
    }
    catch (error) {
      if (error.response.status === 403 && error.response.data.error.message === 'Player command failed: Restriction violated') {
        console.warn('Spotify is already paused.')
      } else {
        throw error
      }
    }
  }

  async setVolume (volumePercentage) {
    await this.axios.put(
      'volume',
      {},
      {
        params: {
         device_id: this.workDeviceId,
         volume_percent: volumePercentage
        }
      },
    )
  }

  async transferPlaybackToMobileDevice () {
    if (!this.mobileDeviceId) console.warn("Can't transfer playback to mobile device, no 'Smartphone' device found.")

    await this.axios.put(
      'https://api.spotify.com/v1/me/player',
      {
        device_ids: [this.mobileDeviceId]
      }
    ) 
  }

  async transferPlaybackToWorkDevice () {
    if (!this.workDeviceId) console.warn("Can't transfer playback to work device, no 'Computer' device found.")

    await this.axios.put(
      'https://api.spotify.com/v1/me/player',
      {
        device_ids: [this.workDeviceId],
        play: true
      }
    ) 
  }
}

module.exports = Spotify
