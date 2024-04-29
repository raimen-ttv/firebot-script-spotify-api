
type Auth = { 
  "access_token": string,
  "token_type": string,
  "expires_in": number,
  "state": string,
  "refresh_token": string
};

type Settings = { 
  "auth": Auth
};

type SpotifyUser = {
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
};


interface Credentials {
  accessToken?: string | undefined;
  clientId?: string | undefined;
  clientSecret?: string | undefined;
  redirectUri?: string | undefined;
  refreshToken?: string | undefined;
}
