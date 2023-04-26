import { reactive } from "vue";

export const store = reactive({
  username: "",
  isLoggedIn: false,
  isPending: false,
  access_token: "",
  refresh_token: "",
  expires_at: "",
  sorted_playlist: "",
});
