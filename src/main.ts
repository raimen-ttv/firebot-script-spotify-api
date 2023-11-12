import {
  Firebot,
  RunRequest,
  ScriptReturnObject
} from "@crowbartools/firebot-custom-scripts-types";

import { initLogger } from "./logger";
import { EffectTriggerResponse, Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { Control } from 'magic-home';
import { Discovery } from 'magic-home';
import { Logger } from "@crowbartools/firebot-custom-scripts-types/types/modules/logger";

import {SpotifyApi, AuthorizationCodeWithPKCEStrategy} from '@spotify/web-api-ts-sdk';

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

    const implicitGrantStrategy = new AuthorizationCodeWithPKCEStrategy(
      "74f8735962614cf8b5ba72709d2eac5f",
      "localhost:3000",
      ['playlist-modify-public', 'playlist-modify-private, user-read-playback-state, user-modify-playback-state']
    );
    const spotify = new SpotifyApi(implicitGrantStrategy)

    const profile = await spotify.currentUser.profile();
    logger.debug(JSON.stringify(profile));

  },
};

export default script;
