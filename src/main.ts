import {
  Firebot,
  RunRequest,
  ScriptReturnObject
} from "@crowbartools/firebot-custom-scripts-types";

import { initLogger } from "./logger";
import { EffectTriggerResponse, Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { Logger } from "@crowbartools/firebot-custom-scripts-types/types/modules/logger";
// import * as express from "express";
// import { Request, Response } from "express";
import { genDef, integration } from "./integration-definition";
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
      version: "0.1",
      firebotVersion: "5",
      website: "https://twitch.tv/raimen"
    };
  },

  getDefaultParameters: () => {
    return {
      credential: {
        type: "string",
        default: "",
        description: "Credential key",
        secondaryDescription: "If you do not want to use the default spotify app, you can get your own from Spotify Developer Dashboard."
      }
    };
  },

  run: async ({parameters, modules}) => {
    const { logger, effectManager, replaceVariableManager } = modules;

    initLogger(logger);
    modules.integrationManager.registerIntegration({integration, definition:integration.definition});
    let response = modules.integrationManager.getIntegrationById("Spotify");
    logger.debug(JSON.stringify(response));

    effectManager.registerEffect(spotifyRequestEffect)
  },
};

export default script;
