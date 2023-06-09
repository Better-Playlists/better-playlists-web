<template>
  <form class="url__form fade-in">
    <div class="input-container">
      <div class="inner-input">
        <input type="text" v-model="playlistUrl" class="input-spotify-url" placeholder="Spotify Playlist URL"
          required />
      </div>
      <div class="inner-btn">
        <button class="btn" type="button" @click="onButtonClick()" :disabled="store.isPending">
          <span>Make it Better!</span>
        </button>
      </div>
    </div>
  </form>

  <div class="status-message">
    <Transition>
      <div v-if="isError" class="error-text">URL Invalid or Missing.</div>
    </Transition>

    <Transition>
      <div v-if="store.sorted_playlist" class="success-text">
        All done! Your <a :href="store.sorted_playlist">playlist</a> is now better!
      </div>
    </Transition>

    <Transition>
      <div v-if="store.isPending" class="lds-dual-ring"></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { store } from "../data/store";
import { useSpotify } from '../services/spotify';

const spotify = useSpotify();

const playlistUrl = ref("");
const isError = ref(false);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const code = urlParams.get('code');

if (code) {
  // we have received the code from spotify and will exchange it for a access_token
  spotify.exchangeToken(code);
} else if (store.access_token && store.refresh_token && store.expires_at) {
  // we are already authorized and reload our tokens from localStorage
  store.isLoggedIn = true;
  spotify.getUserData();
} else {
  // user is logged out
  store.isLoggedIn = false;
}

const onButtonClick = async () => {
  store.isPending = true;
  store.sorted_playlist = "";
  const isUrlValid = playlistUrl.value.startsWith("https://open.spotify.com/playlist/");
  if (playlistUrl.value.length > 0 && isUrlValid) {
    localStorage.setItem('playlistUrl', playlistUrl.value);
    isError.value = false;
  } else {
    isError.value = true;
    store.isPending = false;
    return false;
  }

  if (!store.isLoggedIn) {
    spotify.redirectToSpotifyAuthorizeEndpoint();
  } else {
    const response = await spotify.makeBetterPlaylist(playlistUrl.value, store.access_token);
  }
}

watch(store, () => {
  if (store.access_token && store.refresh_token && store.expires_at) {
    store.isLoggedIn = true;
  } else {
    store.isLoggedIn = false;
  }
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  text-decoration: none;
  background-color: var(--theme-primary);
  color: hsl(0, 11.2%, 58%);
  border: 2px solid transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  border-radius: 2rem;
  white-space: nowrap;
  box-shadow: 0 0 25px #ccc;
  font-family: 'Barlow Condensed', sans-serif;
  text-transform: uppercase;
  cursor: pointer;
}

.url__form {
  margin: 2rem 0;
  width: 100%;
  display: flex;
  max-width: 800px;
}

input[type='text'],
input[type='email'],
input[type='date'],
input[type='tel'] {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 2px solid #ccc;
  color: #000000;
  border-radius: 2rem;
  outline-style: none;
}

input:focus {
  border: 2px solid #b3b3b3;
}

.url__form :global(.btn) {
  margin-left: 0;
}

.error-text {
  color: red;
  font-size: 14px;
}

.success-text {
  color: #999;
  position: relative;
  top: 0px;
}

a {
  text-decoration: none;
  border-bottom: 4px solid #a08888;
  padding-bottom: 5px;
}

.input-container {
  width: 100%;
}

.inner-input,
.inner-btn {
  float: left;
  width: 100%;
  margin-bottom: 15px;
}

.status-message {
  position: relative;
  top: -10px;
  height: 48px;
  width: 100%;
}

.lds-dual-ring {
  display: inline-block;
  width: 28px;
  height: 28px;
  position: absolute;
  top: 10px;
  left: 48%;
}

.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 6px solid #999;
  border-color: #999 transparent #999 transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}

.btn[disabled] {
  cursor: wait;
}

@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (min-width: 768px) {
  div.inner-input {
    width: 80%;
  }

  div.inner-btn {
    width: 20%;
  }

  .btn {
    margin-left: 1rem;
  }

  .lds-dual-ring {
    left: 48.5%;
  }
}
</style>
