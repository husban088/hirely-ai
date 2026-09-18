"use client";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#18181b",
            border: "1px solid rgba(0,79,142,0.15)",
          },
        }}
      />
    </ApolloProvider>
  );
}
