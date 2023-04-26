import { reactive } from "vue";

export const store = reactive({
  isLoggedIn: false,
  isPending: false,
  access_token: "",
  refresh_token: "",
  expires_at: "",
  sorted_playlist: "",
});
