import { defineConfig } from "astro/config";
import { settings } from "./src/data/settings";
import sitemap from "@astrojs/sitemap";
import basicSsl from "@vitejs/plugin-basic-ssl";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: settings.site,
  integrations: [sitemap(), vue()],
  vite: {
    ssr: {
      external: ["svgo"],
    },
    plugins: [basicSsl()],
  },
});
