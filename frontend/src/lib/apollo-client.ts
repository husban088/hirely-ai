import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import Cookies from "js-cookie";

// NEXT_PUBLIC_* vars are baked in at BUILD time — after changing them on Vercel, redeploy.
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql"
).trim();

// If NEXT_PUBLIC_UPLOAD_URL isn't set, derive it from the API URL so the resume upload
// never silently falls back to localhost on a deployed site.
export const UPLOAD_URL = (
  process.env.NEXT_PUBLIC_UPLOAD_URL ||
  `${API_URL.replace(/\/graphql\/?$/, "")}/api/resume/upload`
).trim();

const httpLink = createHttpLink({ uri: API_URL });

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get("hirely_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Turn the browser's vague "Failed to fetch" into an actionable message.
const errorLink = onError(({ networkError }) => {
  if (networkError && !("statusCode" in networkError)) {
    networkError.message = `Cannot reach the API (${API_URL}). Check NEXT_PUBLIC_API_URL, that the backend is running, and CORS (FRONTEND_URL).`;
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
