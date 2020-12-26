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

    return new Spotify(accessToken)
  }

  static getBase64EncodedClientIdAndSecret () {
    return Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
  }

  constructor (spotifyAccessToken) {
    this.axios = axios.create({
      baseURL: 'https://api.spotify.com/v1/me/player/',
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`
      }
    })
  }

  async play () {
    await this.axios.put(
      'play',
      {},
      {
        params: {
         device_id: '822b2fde0ec79cab8720b948867f7a1e61a06b92'
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
          device_id: '822b2fde0ec79cab8720b948867f7a1e61a06b92'
        }
      },
    )
  }
  
  async getDeviceId () {
    // TODO: Extract to a spotify class
    // await axios.get()
  }
}

module.exports = Spotify
