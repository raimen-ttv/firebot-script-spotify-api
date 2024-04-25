"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
// import { AvailableModelsVariable } from "../types";
// import { loadModel, getCurrentModel, getAvailableModels } from "../vtube-remote"
// import * as spotify from "../../spotifyHelper";
import { logger } from "../../logger";
import { integration } from "../../integration-definition";

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
                <p>asdf1234${integration.getCurrentlyPlaying(). }</p>
                <button id="single-button" type="button" class="btn btn-default" uib-dropdown-toggle>
                </button>
                <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
                    <li role="menuitem" ng-click="setRequestType('skip')"><a href>Skip</a></li>
                    <li role="menuitem" ng-click="setRequestType('play')"><a href>Play</a></li>
                    <li role="menuitem" ng-click="setRequestType('pause')"><a href>Pause</a></li>
                </ul>
            </div>
        </div>
    </eos-container>
    `,
    // <eos-container header="Model" ng-if="effect.loadMode === 'model'">
    //       <ui-select ng-model="selected" on-select="selectModel($select.selected.modelID, $select.selected.modelName)">
    //         <ui-select-match placeholder="Select a Model...">{{$select.selected.modelName}}</ui-select-match>
    //         <ui-select-choices repeat="model in modelCollections | filter: {modelName: $select.search}">
    //             <div ng-bind-html="model.modelName | highlight: $select.search"></div>
    //         </ui-select-choices>
    //       </ui-select>
    //       <p>
    //         <button style="margin-top:3px" class="btn btn-link" ng-click="reloadAvailableModels()">Refresh Model Collection</button>
    //         <span class="muted">(Make sure VTube Studio is running and Connected)</span>
    //       </p>
    //   </eos-container>


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

    // $scope.getAvailableModels = () => {
    //     $q.when(backendCommunicator.fireEventAsync("vtube-get-available-models")).then(
    //         (modelCollections: AvailableModelsVariable) => {
    //             $scope.modelCollections = modelCollections.availableModels ?? [];
    //             $scope.selected = $scope.modelCollections.find((model: { modelName: string; }) =>
    //                 model.modelName === $scope.effect.modelName
    //             );
    //         });
    // };
    // $scope.getAvailableModels();

    // $scope.reloadAvailableModels = () => {
    //     $q.when(backendCommunicator.fireEventAsync("vtube-get-available-models")).then(
    //         (modelCollections: AvailableModelsVariable) => {
    //             $scope.modelCollections = modelCollections.availableModels ?? [];
    //         });
    // };
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
  /**
  * When the effect is triggered by something
  */
  onTriggerEvent: async event => {
    logger.info("sending request: " + event.effect.requestType);
    switch (event.effect.requestType) {
      case "skip":
        // await spotify.skip();
        break;
      case "play":
        // await spotify.play();
        break;
      case "pause":
        // await spotify.pause();
        break;

    }
    // if (event.effect.loadMode === "random") {
      // const currentModel = await getCurrentModel();
      // const loadedModels = await getAvailableModels();
      // const otherModels = loadedModels.availableModels.filter((m: { modelID: string; }) => m.modelID !== currentModel.modelID)
      // const randomModel = otherModels[Math.floor(otherModels.length * Math.random())]
      // event.effect.modelID = randomModel.modelID;
    // }

    // await loadModel(
    //     event.effect.modelID
    // );
    return true;
  }
};