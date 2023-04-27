<template>
  <div class="logo-container">
    <div class="logo">
      <div class="logo-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="56px" height="56px" viewBox="0 0 24 24">
          <path fill="orange"
            d="M16 20q-1.25 0-2.125-.875T13 17q0-1.25.875-2.125T16 14q.275 0 .525.038T17 14.2V7q0-.425.288-.713T18 6h3q.425 0 .713.288T22 7q0 .425-.288.713T21 8h-2v9q0 1.25-.875 2.125T16 20ZM4 8q-.425 0-.713-.288T3 7q0-.425.288-.713T4 6h10q.425 0 .713.288T15 7q0 .425-.288.713T14 8H4Zm0 4q-.425 0-.713-.288T3 11q0-.425.288-.713T4 10h10q.425 0 .713.288T15 11q0 .425-.288.713T14 12H4Zm0 4q-.425 0-.713-.288T3 15q0-.425.288-.713T4 14h6q.425 0 .713.288T11 15q0 .425-.288.713T10 16H4Z">
          </path>
        </svg>
      </div>
      <div class="logo-text">Better Playlists</div>
    </div>
    <Transition>
      <div class="login-status" v-if="store.username">
        <div class="spotify-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="#1db954"
              d="M17.9 10.9C14.7 9 9.35 8.8 6.3 9.75c-.5.15-1-.15-1.15-.6c-.15-.5.15-1 .6-1.15c3.55-1.05 9.4-.85 13.1 1.35c.45.25.6.85.35 1.3c-.25.35-.85.5-1.3.25m-.1 2.8c-.25.35-.7.5-1.05.25c-2.7-1.65-6.8-2.15-9.95-1.15c-.4.1-.85-.1-.95-.5c-.1-.4.1-.85.5-.95c3.65-1.1 8.15-.55 11.25 1.35c.3.15.45.65.2 1m-1.2 2.75c-.2.3-.55.4-.85.2c-2.35-1.45-5.3-1.75-8.8-.95c-.35.1-.65-.15-.75-.45c-.1-.35.15-.65.45-.75c3.8-.85 7.1-.5 9.7 1.1c.35.15.4.55.25.85M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z" />
          </svg>
        </div>
        <div class="username">
          {{ store.username }}
        </div>
      </div>
    </Transition>
  </div>
</template>


<script setup lang="ts">
import { ref } from "vue";
import { store } from "../data/store";

const username = ref(store.username)
</script>

<style scoped>
[astro-icon] {
  color: orange;
  fill: orange;
}

.logo-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  margin: auto;
}

.logo-icon {
  display: flex;
  align-items: center;
}

.logo-text {
  font-family: "Barlow Condensed", sans-serif;
  font-size: 40px;
  color: #000;
  font-weight: bold;
  text-transform: uppercase;
}

.login-status {
  display: flex;
  align-items: center;
  width: auto;
  height: 32px;
}

.spotify-logo {
  display: flex;
  align-items: center;
}

.username {
  font-size: 16px;
  color: #999;
  margin-left: 5px;
}

@media (min-width: 768px) {
  .logo-text {
    font-size: 48px;
  }
}
</style>
