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

type Settings = { 
  "auth": Auth
};

type Auth = { 
  "access_token": string,
  "token_type": string,
  "expires_in": number,
  "state": string
};

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
interface Credentials {
  accessToken?: string | undefined;
  clientId?: string | undefined;
  clientSecret?: string | undefined;
  redirectUri?: string | undefined;
  refreshToken?: string | undefined;
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
  private baseURI = "https://api.spotify.com/v1";
  private player = `${this.baseURI}/me/player`;

  connected: boolean;
  definition: IntegrationDefinition;
  private accessToken: string | null;
  private userData: SpotifyUser;

  constructor() {
    super();
    this.connected = false;
    this.definition = genDef()
  }

  init() {

  }

  private headers(requestType?: string) {
    if (requestType == 'PUT') {
      return {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    }
    return { headers: { Authorization: `Bearer ${this.accessToken}` } };
  }

  async connect(integrationData: any) {
    const { auth } = integrationData;
    // logger.debug(`integrationData: ${JSON.stringify(integrationData)}`)

    if (auth.access_token == null) {
      this.disconnect();
      return;
    }

    this.accessToken = auth['access_token'];

    // this.generateHeaders();
    await this.getProfile();
    
    if (this.userData == null) {
      this.disconnect();
      return;
    }

    logger.info(`Connected to Spotify as ${this.userData.display_name}`);
    logger.info(`Access token: ${this.accessToken}`);

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
      logger.debug(`Auth: ${JSON.stringify(auth)}`);
      this.accessToken = auth['access_token'];
      logger.debug(`Access token: ${this.accessToken} Headers: ${JSON.stringify(this.headers())}`);
      const response = await fetch(`${this.baseURI}/me`, this.headers());
      const data = await response.json();

      logger.info(`Linked successfully to ${this.definition.id} as ${JSON.stringify(data)}`);
    } catch (e) {
      logger.error(`Error linking ${this.definition.id}: ${e}`);
    }
  }
  unlink() {
    this.emit("unlinked", this.definition.id);
    this.accessToken = null;
  }

  async getProfile() {
    const response = await fetch(`${this.baseURI}/me`, this.headers());
    this.userData = await response.json();
  }

  async getCurrentlyPlaying() {
    const response = await fetch(`${this.player}/currently-playing`, this.headers());
    let data = await response.json();
    return data;
  }

  async skip() {
    await fetch(`${this.player}/next`, this.headers());
  }

  async play() {
    logger.info("spotify.play() called");
    try {
      const response = await fetch(`${this.player}/play`, this.headers("PUT"));
      logger.info(`spotify.play() response: ${JSON.stringify(await response.json())}`);
    }
    catch (e) {
      logger.error(`Error in spotify.play(): ${e}`);
    }
    return;
  }

  async put(url: string, body: any) {
    logger.info(`calling spotify ${url} with body: ${JSON.stringify(body)}`);
    try {
      const response = await fetch(`${this.player}/${url}`, this.headers("PUT"));
      logger.info(`spotify ${url} response: ${JSON.stringify(await response.json())}`);
    }
    catch (e) {
      logger.error(`Error while calling ${url}: ${e}`);
    }
    return;
  }

  async pause() {
    await fetch(`${this.player}/pause`, this.headers());
  }

  async queueTrack(trackId: string) {
    await fetch(`${this.player}/queue?uri=${trackId}`, this.headers());
  }

  async getPlaylists() {
    const response = await fetch(`https://api.spotify.com/v1/me/playlists`, this.headers());
    let data = await response.json();
    return data;
  }

  async getPlaylistTracks(playlistId: string) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, this.headers());
    let data = await response.json();
    return data;
  }
  async seekToPosition(positionMs: number) {
    await fetch(`${this.player}/seek?position_ms=${positionMs}`, this.headers());
  }

  async setVolume(volumePercent: number) {
    await fetch(`${this.player}/volume?volume_percent=${volumePercent}`, this.headers());
  }

  async shufflePlayback(state: boolean) {
    await fetch(`${this.player}/shuffle?state=${state}`, this.headers());
  }

  async repeatPlayback(state: "off" | "track" | "context") {
    await fetch(`${this.player}/repeat?state=${state}`, this.headers());
  }

  async addToQueue(trackUri: string) {
    await fetch(`${this.player}/queue?uri=${trackUri}`, this.headers());
  }

  async removeFromQueue(trackUri: string) {
    await fetch(`${this.player}/queue?uri=${trackUri}`, {
      ...this.headers(),
      method: 'DELETE',
    });
  }

  async playTrack(trackUri: string) {
    await fetch(`${this.player}/play?uris=${trackUri}`, this.headers());
  }

  async playPlaylist(playlistUri: string) {
    await fetch(`${this.player}/play?context_uri=${playlistUri}`, this.headers());
  }

  async playAlbum(albumUri: string) {
    await fetch(`${this.player}/play?context_uri=${albumUri}`, this.headers());
  }

  async playArtist(artistUri: string) {
    await fetch(`${this.player}/play?context_uri=${artistUri}`, this.headers());
  }

}

export const integration = new SpotifyIntegration();
