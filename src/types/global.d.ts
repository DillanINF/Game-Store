// Global type definitions
declare global {
  interface Window {
    FB: {
      init: (params: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        version?: string;
      }) => void;
      login: (
        callback: (response: {
          authResponse?: {
            accessToken: string;
            userID: string;
            expiresIn: number;
            signedRequest: string;
            graphDomain: string;
          };
          status: string;
        }) => void,
        options?: {
          scope?: string;
          auth_type?: string;
          return_scopes?: boolean;
          enable_profile_selector?: boolean;
          profile_selector_ids?: string;
        }
      ) => void;
      api: (
        path: string,
        method: string | { fields: string },
        callback: (response: any) => void
      ) => void;
      getLoginStatus: (
        callback: (response: {
          status: string;
          authResponse?: {
            accessToken: string;
            userID: string;
            expiresIn: number;
            signedRequest: string;
            graphDomain: string;
          };
        }) => void
      ) => void;
      logout: (callback: () => void) => void;
    };
    fbAsyncInit: () => void;
  }
}

export {}; 