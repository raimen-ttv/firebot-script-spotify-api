import {
  Firebot,
  RunRequest,
  ScriptReturnObject
} from "@crowbartools/firebot-custom-scripts-types";

import { initLogger } from "./logger";
import { EffectTriggerResponse, Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { Logger } from "@crowbartools/firebot-custom-scripts-types/types/modules/logger";
import SpotifyWebApi from 'spotify-web-api-node'

// import {SpotifyApi, AuthorizationCodeWithPKCEStrategy} from '@spotify/web-api-ts-sdk';

type Params = {
  credential: string 
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Spotify for Firebot",
      description: "Connect to Spotify API directly from Firebot!",
      author: "Raimen",
      version: "1.0",
      firebotVersion: "5",
    };
  },

  getDefaultParameters: () => {
    return {
      credential: {
        type: "string",
        default: "",
        description: "Credential key"
      }
    };
  },

  run: async ({parameters, modules}) => {
    const { logger, effectManager, replaceVariableManager } = modules;
    initLogger(logger);



    var scopes = ['playlist-modify-public', 'playlist-modify-private, user-read-playback-state, user-modify-playback-state'],
    redirectUri = 'http://localhost:3000',
    clientId = '74f8735962614cf8b5ba72709d2eac5f',
    state = 'login',
    showDialog = true,
    responseType = 'token';

    // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
    var spotifyApi = new SpotifyWebApi({
      redirectUri: redirectUri,
      clientId: clientId
    });

    // Create the authorization URL
    var authorizeURL = spotifyApi.createAuthorizeURL(
      scopes,
      state,
      showDialog
    );

    // https://accounts.spotify.com/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=token&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice&show_dialog=true
    logger.info(authorizeURL);


    // const implicitGrantStrategy = new AuthorizationCodeWithPKCEStrategy(
    //   "74f8735962614cf8b5ba72709d2eac5f",
    //   "localhost:3000",
    //   ['playlist-modify-public', 'playlist-modify-private, user-read-playback-state, user-modify-playback-state']
    // );
    // const spotify = new SpotifyApi(implicitGrantStrategy)

    // const profile = await spotify.currentUser.profile();
    // logger.debug(JSON.stringify(profile));

  },
};

export default script;
