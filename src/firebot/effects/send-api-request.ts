
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
// import { AvailableModelsVariable } from "../types";
// import { loadModel, getCurrentModel, getAvailableModels } from "../vtube-remote"
// import * as spotify from "../../spotifyHelper";
import { logger } from "../../logger";
import { integration } from "../../integration-definition";

const spotify = integration;

const spotifyOptions = [ "getProfile", "getCurrentlyPlaying", "skip", "play", "pause", "queueTrack", "getPlaylists", "getPlaylistTracks", "seekToPosition", "setVolume", "shufflePlayback", "repeatPlayback", "addToQueue", "removeFromQueue", "playTrack", "playPlaylist", "playAlbum", "playArtist" ] 
/**
* The Trigger Hotkey Effect
*/
export const spotifyRequestEffect: Firebot.EffectType<{
  requestType: string;  
}> = {
  /**
  * The definition of the Effect
  */
  definition: {
    id: "spotify:api-request",
    name: "Spotify API Request",
    description: "Do a Spotify API Request",
    icon: "fa-brands fa-spotify",
    categories: ["common"],
  },
  /**
  * The HTML template for the Options view (ie options when effect is added to something such as a button.
  * You can alternatively supply a url to a html file via optionTemplateUrl
  */
  optionsTemplate: `
      <eos-container header="Request Type" pad-top="true">
          <div  style="margin-bottom: 15px;">
            <div class="btn-group" uib-dropdown>
                <button id="single-button" type="button" class="btn btn-default" uib-dropdown-toggle>
                </button>
                <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
                    ${spotifyOptions.map(option => `<li role="menuitem" ng-click="setRequestType('${option}')"><a href>${option}</a></li>`).join("")}
                </ul>
            </div>
        </div>
    </eos-container>
    `,

  /**
  * The controller for the front end Options
  * Port over from effectHelperService.js
  */
  optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
    $scope.modelCollections = [];
    if ($scope.effect.loadMode == null) {
      $scope.effect.loadMode = "model";
    }

    $scope.selectModel = (modelID: string, modelName: string) => {
      // $scope.effect.modelName = modelName;
      // $scope.effect.modelID = modelID;sd

    };

    $scope.setRequestType = (requestType: string) => {
      $scope.effect.requestType = requestType;
    };
  },

  /**
  * When the effect is triggered by something
  * Used to validate fields in the option template.
  */
  optionsValidator: effect => {
    const errors: string[] = [];
    // if (effect.loadMode !== "random") {
    //     if (effect.modelID == null) {
    //         errors.push("Please select a model.");
    //     }
    // }
    return errors;
  },
  onTriggerEvent: async event => {
    logger.info("sending request: " + event.effect.requestType);
    try {
      let response = await spotify.put(event.effect.requestType, {});
      logger.info("response: " + JSON.stringify(response));
    }
    catch (e) {
      logger.error("Error: " + e);
    }
    // switch (event.effect.requestType) {
    //   case "skip":
    //     await spotify.skip();
    //     break;
    //   case "play":
    //     await spotify.play();
    //     break;
    //   case "pause":
    //     await spotify["pause"]();
    //     break;
    //   default:
    //     logger.error("Unhandled request type: " + event.effect.requestType);
    //     break;
    // }
    return true;
  }
};

