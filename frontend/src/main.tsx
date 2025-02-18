import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { BrowserRouter } from "react-router";
import { RoutesWrapper } from "./Routes.tsx";
import { Navbar } from "./components/Navbar.tsx";
import { QueryClientWrapper } from "./components/query-client-wrapper.tsx";
import { AuthInit } from "./auth/auth-init.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { Seo } from "./components/Seo.tsx";
import { Footer } from "./components/Footer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Seo
      title="Emil"
      description="Welcome to my portfolio. I blog regularly here. Check-in with the Guestbook when you leave, thanks!"
    />
    <AuthInit>
      <QueryClientWrapper>
        <BrowserRouter>
          <ThemeProvider defaultTheme="dark" storageKey="site-theme">
            <Toaster />
            <div className="text-sm leading-7 flex flex-col gap-y-8 min-h-svh w-full items-center px-4 sm:px-0 md:px-0 dark:selection:bg-yellow-700 selection:bg-gray-300 relative">
              <Navbar />
              <div className="md:max-w-[80ch] w-full flex flex-col h-full mb-5">
                <RoutesWrapper />
                <hr />
                <span className="mt-6">
                  <Footer />
                </span>
              </div>
            </div>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientWrapper>
    </AuthInit>
  </StrictMode>
);
