import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Notifications } from "@mantine/notifications";

import AuthProvider from "./features/auth/providers/AuthContext.tsx";

import ErrorBoundary from "./ErrorBoundary.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <AuthProvider>
            <BrowserRouter>
              <Notifications position="top-right" zIndex={2077} />
              <App />
            </BrowserRouter>
          </AuthProvider>
        </MantineProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
