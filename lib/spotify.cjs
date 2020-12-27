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

    const workDeviceId = devices.find(device => device.type === 'Computer').id
    // const mobileDeviceId = devices.find(device => device.type === 'Smartphone') TODO: Find out how to workaround the mobile sometimes not returning.
    const mobileDeviceId = '85666e7034817e3de74f5ae2bfc9e6796d9c1d31'

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

  async play () {
    await this.axios.put(
      'play',
      {},
      {
        params: {
         device_id: this.workDeviceId
        }
      },
    )
  }
  
  async pause () {
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
    await this.axios.put(
      'https://api.spotify.com/v1/me/player',
      {
        device_ids: [this.mobileDeviceId]
      }
    ) 
  }

  async transferPlaybackToWorkDevice () {
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
