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
import { AuthInit } from "./auth/auth-init.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthInit>
      <QueryClientWrapper>
        <BrowserRouter>
          <ThemeProvider defaultTheme="dark" storageKey="site-theme">
            <Toaster />
            <div className="text-sm leading-7 flex flex-col gap-y-8 min-h-svh w-svw items-center px-4 sm:px-0 md:px-0 dark:selection:bg-yellow-700 selection:bg-gray-300 relative">
              <Navbar />
              <div className="md:max-w-[80ch] w-full flex flex-col h-full mb-5">
                <RoutesWrapper />
              </div>
            </div>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientWrapper>
    </AuthInit>
  </StrictMode>
);
