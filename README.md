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
The steps below are taken from [the Spotify docs about the Authorization Code flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow).

The scripts needs a refresh token with the following scopes:
- user-read-playback-state
- user-modify-playback-state

1. Go to the following URL in your browser: https://accounts.spotify.com/authorize?client_id=$SPOTIFY_CLIENT_ID&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=user-read-playback-state%20user-modify-playback-state&state=34fFs29kd09
1. After you've granted the app permissions and been redirected you'll need to copy the authorization code from the query param in the redirected URL.
1. You'll then need to exchange the authorization code for access and refresh tokens with a command like this:
```
curl -H "Authorization: Basic $BASE64_ENCODED_CLIENT_ID_AND_SECRET" -d grant_type=authorization_code -d code="$AUTHORIZATION_CODE_COPIED_FROM_CALLBACK_URL" -d redirect_uri='https%3A%2F%2Fexample.com%2Fcallback' https://accounts.spotify.com/api/token
```

⚠️ Don't forget to use the `-n` flag when base64 encoding the client credentials: `echo -n 'client_id:client_secret' | base64`

## Get a RescueTime API key
Create a new API key on [the RescueTime key management page](https://www.rescuetime.com/anapi/manage).

## Add the command to your path
Install the command globally with a package manager or run `npm link` from the root of the repo.

# Using with PomoDoneApp
This script works great with PomoDoneApp because it provides hooks to call AppleScripts which can in turn be used to call this script. It also provides an Android app that can show a notification with the remaining break timer that you set on your laptop so you can walk away from your desk with your phone knowing how much time is left on your break and also get another notification when it is up.

## Gotchas
AppleScripts runs in a very stripped down environment with almost nothing on the PATH.
```
do shell script "eval `/usr/libexec/path_helper -s`; source ~/.zshrc; source ~/.zshenv; work focus start;"
```
Using the path_helper sets up the path closer to what it would in a regular shell.