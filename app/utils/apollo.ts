import { HttpLink } from "@apollo/client";
import { getItemAsync } from "expo-secure-store";

export const httpLink = new HttpLink({
  uri: "https://35e885c5c655.ngrok.app/graphql",
  fetch: async (input, init) => {
    const token = await getItemAsync("token");

    return await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        ...(token && { Cookie: `ethglobal_access_token=${token}` }),
      },
    });
  },
  credentials: "include",
});
