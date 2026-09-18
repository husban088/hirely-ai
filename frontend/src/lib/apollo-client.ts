import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";

// If the deployed site (not localhost) still points at a localhost API, the NEXT_PUBLIC_API_URL
// variable was missing when the app was built. Vercel bakes NEXT_PUBLIC_* values in at build time,
// so the fix is: set the variable, then redeploy.
if (
  typeof window !== "undefined" &&
  API_URL.includes("localhost") &&
  !["localhost", "127.0.0.1"].includes(window.location.hostname)
) {
  console.error(
    `[Hirely AI] NEXT_PUBLIC_API_URL is "${API_URL}" on a deployed site. ` +
      "Set it in Vercel > Settings > Environment Variables and redeploy.",
  );
}

const httpLink = createHttpLink({ uri: API_URL });

// Turns the vague browser message "Failed to fetch" into something that says what is wrong.
const errorLink = onError(({ networkError }) => {
  if (!networkError) return;
  const err = networkError as any;
  const status: number | undefined = err.statusCode;

  if (status) {
    const serverMessage =
      err.result?.errors?.[0]?.message || err.result?.message;
    if (serverMessage) {
      err.message = serverMessage;
    } else if (status === 401 || status === 403) {
      err.message = `API blocked the request (${status}). Check Vercel Deployment Protection on the backend project.`;
    } else if (status === 404) {
      err.message = `API URL not found (404). NEXT_PUBLIC_API_URL must end with /graphql: ${API_URL}`;
    } else if (status >= 500) {
      err.message = `Backend crashed (${status}). Open the backend project's Logs in Vercel to see why.`;
    } else {
      err.message = `API responded with status ${status} (${API_URL}).`;
    }
  } else {
    // No HTTP response at all: wrong/unreachable URL, backend crashed before answering, or CORS.
    err.message = `Cannot reach the API (${API_URL}). Check NEXT_PUBLIC_API_URL, that the backend is running, and CORS (FRONTEND_URL).`;
  }
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get("hirely_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
