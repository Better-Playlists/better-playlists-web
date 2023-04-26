import { settings } from "../data/settings";
import { store } from "../data/store";

const client_id = settings.client_id;
const redirect_uri = settings.redirect_uri;

export function useSpotify() {
  const exchangeToken = async (code: string) => {
    store.isPending = true;
    const code_verifier = localStorage.getItem("code_verifier");

    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams({
        client_id,
        grant_type: "authorization_code",
        code,
        redirect_uri,
        code_verifier,
      }),
    })
      .then(addThrowErrorToFetch)
      .then(async (data) => {
        processTokenResponse(data);

        // clear search query params in the url
        window.history.replaceState({}, document.title, "/");
      })
      .catch(handleError);
  };

  const getUserData = async () => {
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + store.access_token,
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw await response.json();
        }
      })
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.log(error);
        if (error.error.status === 401) {
          refreshToken();
        }
      });
  };

  const processTokenResponse = async (data) => {
    store.access_token = data.access_token;
    store.refresh_token = data.refresh_token;

    const t = new Date();
    store.expires_at = t.setSeconds(t.getSeconds() + data.expires_in).toString();

    localStorage.setItem("access_token", store.access_token);
    localStorage.setItem("refresh_token", store.refresh_token);
    localStorage.setItem("expires_at", store.expires_at);

    // load data of logged in user
    getUserData();

    const playlistUrl = localStorage.getItem("playlistUrl");
    if (playlistUrl) {
      const result = await makeBetterPlaylist(playlistUrl, store.access_token);
    }
  };

  const refreshToken = () => {
    const refresh_token = store.refresh_token;
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams({
        client_id,
        grant_type: "refresh_token",
        refresh_token,
      }),
    })
      .then(addThrowErrorToFetch)
      .then(processTokenResponse)
      .catch(handleError);
  };

  const addThrowErrorToFetch = async (response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw { response, error: await response.json() };
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const generateRandomString = (length) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const generateCodeChallenge = async (codeVerifier) => {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const generateUrlWithSearchParams = (url, params) => {
    const urlObject = new URL(url);
    urlObject.search = new URLSearchParams(params).toString();

    return urlObject.toString();
  };

  const redirectToSpotifyAuthorizeEndpoint = () => {
    const codeVerifier = generateRandomString(64);

    generateCodeChallenge(codeVerifier).then((code_challenge) => {
      window.localStorage.setItem("code_verifier", codeVerifier);

      // Redirect to example:
      // GET https://accounts.spotify.com/authorize?response_type=code&client_id=77e602fc63fa4b96acff255ed33428d3&redirect_uri=http%3A%2F%2Flocalhost&scope=user-follow-modify&state=e21392da45dbf4&code_challenge=KADwyz1X~HIdcAG20lnXitK6k51xBP4pEMEZHmCneHD1JhrcHjE1P3yU_NjhBz4TdhV6acGo16PCd10xLwMJJ4uCutQZHw&code_challenge_method=S256

      window.location = generateUrlWithSearchParams("https://accounts.spotify.com/authorize", {
        response_type: "code",
        client_id,
        scope: "user-read-private playlist-read-private playlist-modify-public",
        code_challenge_method: "S256",
        code_challenge,
        redirect_uri,
      }) as any;

      // If the user accepts spotify will come back to your application with the code in the response query string
      // Example: http://127.0.0.1:8080/?code=NApCCg..BkWtQ&state=profile%2Factivity
    });
  };

  const makeBetterPlaylist = async (playlistUrl, access_token) => {
    const data = { playlist_url: playlistUrl, access_token: access_token };

    try {
      const response = await fetch(
        "https://us-east4-better-spotify-playlists.cloudfunctions.net/functions-better-playlists",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.sorted_playlist) {
        store.sorted_playlist = result.sorted_playlist;
        localStorage.removeItem("playlistUrl");
      }

      store.isPending = false;
      return result;
    } catch (error) {
      console.error("Error: ", error);
      store.isPending = false;
    }
  };

  const restoreFromLocalStorage = () => {
    // Restore tokens from localStorage
    store.access_token = localStorage.getItem("access_token") || null;
    store.refresh_token = localStorage.getItem("refresh_token") || null;
    store.expires_at = localStorage.getItem("expires_at") || null;
  };

  restoreFromLocalStorage();

  return {
    exchangeToken,
    getUserData,
    makeBetterPlaylist,
    redirectToSpotifyAuthorizeEndpoint,
    restoreFromLocalStorage,
  };
}
