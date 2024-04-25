"use strict";
import { EventEmitter } from "events";

import { initLogger, logger } from "./logger";
import { FirebotParameterCategories, FirebotParams } from "@crowbartools/firebot-custom-scripts-types/types/modules/firebot-parameters";

// import IntegrationDefinition from "@crowbartools/firebot-custom-scripts-types/types/modules/integration-definition";
export type IntegrationDefinition<Params extends FirebotParams = FirebotParams> = {
    id: string;
    name: string;
    description: string;
    connectionToggle?: boolean;
    configurable?: boolean;
    settingCategories: FirebotParameterCategories<Params>;
  } & (
    | {
      linkType: "id";
      idDetails: {
        steps: string;
      };
    }
    | {
      linkType: "auth";
      authProviderDetails: {
        id: string;
        name: string;
        redirectUriHost?: string;
        client: {
          id: string;
          secret: string;
        };
        auth: {
          type?: string
          tokenHost: string;
          tokenPath: string;
          authorizePath: string;
          authorizeHost?: string;
        };
        autoRefreshToken?: boolean;
        scopes: string;
      };
    }
    | { linkType: "other" | "none" }
  );

interface client {
  id: string;
  secret: string;
};

interface SpotifyUser {
  display_name: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  type: string;
  uri: string;
}

export let secret: client = {
  id: "74f8735962614cf8b5ba72709d2eac5f",
  secret: "",
}

export function genDef(): IntegrationDefinition {
  return {
    id: "Spotify",
    name: "Spotify",
    description: "Get current song information, control playback, add to queue, and access playlist information.",
    connectionToggle: true,
    linkType: "auth",
    settingCategories: {
    },
    authProviderDetails: {
      id: "Spotify",
      name: "Spotify",
      redirectUriHost: "localhost",
      client: secret,
      auth: {
        type: 'token',
        tokenHost: "https://accounts.spotify.com",
        tokenPath: '/api/token',
        authorizePath: '/authorize?'
      },
      autoRefreshToken: true,
      scopes: `user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read`
    }
  }
}

class SpotifyIntegration extends EventEmitter {

  connected: boolean;
  definition: IntegrationDefinition;
  private accessToken: string | null;
  private userData: SpotifyUser;
  private headers: { headers: { Authorization: string; }; };

  constructor() {
    super();
    this.connected = false;
    this.definition = genDef()
  }
  init() {

  }
  connect(integrationData: { settings: any; }) {
    const { settings } = integrationData;

    if (settings == null) {
      this.emit("disconnected", this.definition.id);
      return;
    }

    this.emit("connected", this.definition.id);
    this.connected = true;
  }
  disconnect() {
    this.connected = false;

    this.emit("disconnected", this.definition.id);
  }
  async link(linkData: { auth: any; }) {
    try {
      const { auth } = linkData;
      logger.info(`Linking ${this.definition.id}`);
      this.accessToken = auth['accessToken'];
      this.headers = { headers: { Authorization: `Bearer  + ${this.accessToken}` } };

      const response = await fetch('https://api.spotify.com/v1/me', this.headers);
      const data = await response.json();

      logger.info(`Linked successfully to ${this.definition.id} as ${this.userData.display_name}`);
    } catch (e) {
      logger.error(`Error linking ${this.definition.id}: ${e}`);
    }
  }
  unlink() {
    this.emit("unlinked", this.definition.id);
  }

  async getProfile() {
    const response = await fetch('https://api.spotify.com/v1/me', this.headers);
    this.userData = await response.json();
  }

  async getCurrentlyPlaying() {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', this.headers);
    let data = await response.json();
    return data;
  }
}

export const integration = new SpotifyIntegration();
