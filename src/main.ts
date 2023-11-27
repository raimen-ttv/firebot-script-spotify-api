import {
  Firebot,
  RunRequest,
  ScriptReturnObject
} from "@crowbartools/firebot-custom-scripts-types";

import { initLogger } from "./logger";
import { EffectTriggerResponse, Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { Logger } from "@crowbartools/firebot-custom-scripts-types/types/modules/logger";
import SpotifyWebApi = require("spotify-web-api-node")
import * as express from "express";
import { Request, Response } from "express";
import { initSpotify } from "./spotifyHelper";
import { spotifyRequestEffect } from "./firebot/effects/send-api-request";
// import * as path from "path";
// import open from "open";

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
      website: "https://twitch.tv/raimen"
    };
  },

  getDefaultParameters: () => {
    return {
      credential: {
        type: "string",
        default: "asdf",
        description: "Credential key",
        secondaryDescription: "You must authenticate with Spotify to get this key. Open this url to get started: https://bit.ly/3Rjaz2d"
      }
    };
  },

  run: async ({parameters, modules}) => {
    const { logger, effectManager, replaceVariableManager } = modules;
    initLogger(logger);
    await initSpotify();
    logger.info("post spotify init");

    const app = express();
    const port = 3000;

    // app.get('/', (req, res) => {
    //   logger.info("got request: " + JSON.stringify(req.query));
    //   const customContent = String(req.query.code)
    //   res.render('index', { customContent });
    // })
    
    
    // Endpoint for Spotify redirect
    app.get('/', (req: Request, res: Response) => {
        const { code, error } = req.query;
    
        // Handle the query parameters as needed
        if (typeof error === 'string') {
            // Handle error scenario (e.g., show error message to the user)
            res.send(`Authentication failed: ${error}`);
        } else if (typeof code === 'string') {
            res.send(`You have successfully authenticated with Spotify! Your code: ${code}`);
        } else {
            // Handle unexpected case
            res.send('Invalid response from Spotify');
        }
    });
    
    app.listen(port, () => {
      logger.info(`Spotify integration listening at http://localhost:${port}`);
    });

    // open(authorizeURL);


    // const implicitGrantStrategy = new AuthorizationCodeWithPKCEStrategy(
    //   "74f8735962614cf8b5ba72709d2eac5f",
    //   "localhost:3000",
    //   ['playlist-modify-public', 'playlist-modify-private, user-read-playback-state, user-modify-playback-state']
    // );
    // const spotify = new SpotifyApi(implicitGrantStrategy)

    // const profile = await spotify.currentUser.profile();
    // logger.debug(JSON.stringify(profile));
    effectManager.registerEffect(spotifyRequestEffect)
  },
};

export default script;
