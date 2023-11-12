import {
  Firebot,
  RunRequest,
  ScriptReturnObject
} from "@crowbartools/firebot-custom-scripts-types";
import { EffectTriggerResponse, Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { Control } from 'magic-home';
import { Discovery } from 'magic-home';
import { Logger } from "@crowbartools/firebot-custom-scripts-types/types/modules/logger";
import { LocalStorage } from "node-localstorage";

var SpotifyWebApi = require('spotify-web-api-node');

const localStorage = new LocalStorage("./magicHome")

type Params = {
  credential: string 
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Hype guy controller",
      description: "for magic home",
      author: "Raimen",
      version: "1.5",
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

  run: async (): Promise<ScriptReturnObject> => {

    // credentials are optional
    var spotifyApi = new SpotifyWebApi({
      clientId: '74f8735962614cf8b5ba72709d2eac5f',
      clientSecret: '2bcb657eda324ec18ffa03f37d8cb95f',
      redirectUri: 'localhost:6969'
    });

    let thing: ScriptReturnObject = {
      success: true,
      // success: false,
      errorMessage: "Failed to run the script!", // If 'success' is false, this message is shown in a Firebot popup.
      effects: []
    }
    return thing
  },
};


export default script;
