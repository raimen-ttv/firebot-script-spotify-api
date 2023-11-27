import SpotifyWebApi = require("spotify-web-api-node")
import { logger } from "./logger";

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
const scopes = ['playlist-modify-public', 'playlist-modify-private, user-read-playback-state, user-modify-playback-state'],
redirectUri = 'http://localhost:3000',
clientId = '74f8735962614cf8b5ba72709d2eac5f',
state = 'login',
showDialog = true

export let spotifyApi: SpotifyWebApi;

// Create the authorization URL
export let authorizeURL: string;

export async function initSpotify(code:string) {
  logger.info("Initializing Spotify API");
  spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId
  });
  authorizeURL = spotifyApi.createAuthorizeURL(
    scopes,
    state,
    showDialog
  );
  await setAccessToken(code);
  logger.info("Spotify API initialized");
}

export async function setAccessToken(code: string) {
  spotifyApi.setAccessToken(code)
  spotifyApi.authorizationCodeGrant(code).then(
    function(data) {
      logger.debug('The token expires in ' + data.body['expires_in']);
      logger.debug('The access token is ' + data.body['access_token']);
      logger.debug('The refresh token is ' + data.body['refresh_token']);

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
    },
    function(err) {
      logger.error('Something went wrong!', err);
    }
  );
}

export async function pause() {
  spotifyApi.pause();
}

export async function play() {
  spotifyApi.play();
}

export async function skip() {
  spotifyApi.skipToNext();
}

export async function previous() {
  spotifyApi.skipToPrevious();
}

export async function getCurrentModel() {
  return spotifyApi.getMyCurrentPlayingTrack();
}

export async function getAvailableDevices(){
  return spotifyApi.getMyDevices();
}
