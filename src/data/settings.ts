export const settings = {
  site: "https://betterplaylists.netlify.app",
  name: "Better Playlists",
  title: "Better Playlists",
  description: "Better Playlists for Spotify",

  // Spotify
  client_id: "c27befa8e0684df2987e7357fb835337",
  // redirect_uri must match the uri exactly in Spotify dashboard
  redirect_uri: import.meta.env.DEV ? "https://localhost:3000" : "https://betterplaylists.netlify.app",
};
