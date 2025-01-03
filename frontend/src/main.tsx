import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { BrowserRouter } from "react-router";
import { RoutesWrapper } from "./Routes.tsx";
import { Navbar } from "./components/Navbar.tsx";

import "@fontsource/inter/100-italic.css";
import "@fontsource/inter/200-italic.css";
import "@fontsource/inter/300-italic.css";
import "@fontsource/inter/400-italic.css";
import "@fontsource/inter/500-italic.css";
import "@fontsource/inter/600-italic.css";
import "@fontsource/inter/700-italic.css";
import "@fontsource/inter/800-italic.css";
import "@fontsource/inter/900-italic.css";
import { QueryClientWrapper } from "./components/query-client-wrapper.tsx";
import { AuthInit } from "./components/auth-init.tsx";
import { AuthRefresher } from "./auth/auth-refresher.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthInit>
      <QueryClientWrapper>
        <AuthRefresher />
        <BrowserRouter>
          <ThemeProvider defaultTheme="dark" storageKey="site-theme">
            <div className="flex flex-col gap-y-8 h-svh w-svw items-center pb-5 px-4 sm:px-4 md:px-8 dark:selection:bg-gray-700 selection:bg-gray-300 relative">
              <Navbar />
              <div className="md:max-w-[80ch] w-full flex flex-col overflow-y-scroll h-full">
                <RoutesWrapper />
              </div>
            </div>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientWrapper>
    </AuthInit>
  </StrictMode>
);
