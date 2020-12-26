# Work
**Work** automates work-related tasks to save you time and help you focus.

`work day start`
- Gives helpful advice.
- Tells you when you should aim to finish your work day.

`work day end`
- Doesn't do anything helpful yet.

`work focus start`
- Plays Spotify on your laptop.
- Starts RescueTime FocusTime.

`work focus stop`
- Stops playing Spotify.
- Stops RescueTime FocusTime.

`work break start`
- Doesn't do anything helpful yet.

`work break stop`
- Doesn't do anything helpful yet.

# Getting started
You will need premium accounts for both Spotify and RescueTime. The script needs the following environment variables to run:
- `RESCUE_TIME_API_KEY`
- `SPOTIFY_REFRESH_TOKEN`
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`

## Get a Spotify client ID and secret
Go to [the Spotify developer dashboard](https://developer.spotify.com/dashboard/login) and create an app to get a client ID and secret.

## Get a Spotify refresh token
See [the Spotify docs about the Authorization Code flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow) to find out how to get a Spotify refresh token.

After you've granted the app permissions and been redirected you'll need to copy the authorization code from the query param in the redirected URL.

You'll then need to exchange the authorization code for access and refresh tokens with a command like this:
```
curl -H "Authorization: Basic <base64 encoded client_id:client_secret>" -d grant_type=authorization_code -d code=MQCbtKe...44KN -d redirect_uri=https%3A%2F%2Fexample.com%2Fcallback https://accounts.spotify.com/api/token')
```

Don't forget to use the `-n` flag when base64 encoding the client credentials: `echo -n 'client_id:client_secret' | base64`

## Get a RescueTime API key
Create a new API key on [the RescueTime key management page](https://www.rescuetime.com/anapi/manage).

## Add the command to your path
Install the command globally with a package manager or run `npm link` from the root of the repo.

# Using with PomoDoneApp
This script works great with PomoDoneApp because it provides hooks to call AppleScripts which can in turn be used to call this script. It also provides an Android app that can show a notification with the remaining break timer that you set on your laptop so you can walk away from your desk with your phone knowing how much time is left on your break and also get another notification when it is up.

One gotcha I hit using the AppleScripts was getting the path setup correctly.
```
do shell script "eval `/usr/libexec/path_helper -s`; source ~/.bash_profile; work focus start;"
```
This sets up the environment just as it would be for a regular interactive bash terminal and assumes that the required environment variables will be present if this is done (for example they may be exported in your `bash_profile`).