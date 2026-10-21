import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  ClientOnly,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { SplashCursor } from "@/components/SplashCursor";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Aiel Design & Printing Studio" },
      {
        name: "description",
        content: "Custom apparel, corporate gifts and merch — designed and printed by Aiel.",
      },
      { name: "author", content: "Aiel Design & Printing Studio" },
      { property: "og:title", content: "Aiel Design & Printing Studio" },
      {
        property: "og:description",
        content: "Custom apparel, corporate gifts and merch — designed and printed by Aiel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Manrope:wght@300;400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Synchronous Theme Initialization before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem('aiel_theme');
                var isL = t === 'light' || (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
                if (isL) {
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.colorScheme = 'light';
                } else {
                  document.documentElement.classList.remove('light');
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              } catch(e){}
            })();`,
          }}
        />
        {/* Inline CSS for initial paint splash loader & scroll lock */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html.loader-locked, body.loader-locked {
                overflow: hidden !important;
                height: 100% !important;
              }
              html.loader-dismissed #initial-loader,
              body.loader-dismissed #initial-loader,
              #initial-loader.dismissed {
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
                display: none !important;
              }
              #initial-loader {
                position: fixed;
                inset: 0;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: #0c0814;
                color: #f5f5f7;
                font-family: 'Syne', system-ui, -apple-system, sans-serif;
                transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), visibility 300ms cubic-bezier(0.16, 1, 0.3, 1);
                opacity: 1;
                visibility: visible;
              }
              html.light #initial-loader,
              [data-theme="light"] #initial-loader {
                background-color: #F7F7F4;
                color: #1A1A1A;
              }
              #initial-loader .loader-brand {
                font-family: 'Syne', sans-serif;
                font-size: clamp(3.2rem, 9vw, 6.5rem);
                font-weight: 800;
                letter-spacing: -0.04em;
                background: linear-gradient(100deg, #5b7fff, #a855f7 35%, #ec4899 65%, #f97316);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                line-height: 1;
              }
              #initial-loader .loader-sub {
                margin-top: 1rem;
                font-family: 'Syne', sans-serif;
                font-size: 0.65rem;
                letter-spacing: 0.55em;
                text-transform: uppercase;
                opacity: 0.65;
              }
              #initial-loader .loader-track {
                position: relative;
                margin-top: 2.2rem;
                height: 2px;
                width: 240px;
                max-width: 65vw;
                background: rgba(125, 125, 125, 0.2);
                border-radius: 9999px;
                overflow: hidden;
              }
              #initial-loader .loader-fill {
                position: absolute;
                inset: 0;
                width: 0%;
                background: linear-gradient(100deg, #5b7fff, #a855f7 35%, #ec4899 65%, #f97316);
                transition: width 120ms linear;
              }
              #initial-loader .loader-count {
                margin-top: 0.85rem;
                font-family: 'Syne', sans-serif;
                font-size: 0.75rem;
                letter-spacing: 0.1em;
                opacity: 0.55;
                font-variant-numeric: tabular-nums;
              }
              @media (prefers-reduced-motion: reduce) {
                #initial-loader {
                  transition: none !important;
                }
                #initial-loader .loader-fill {
                  transition: none !important;
                }
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* Root Loader HTML (rendered immediately from root shell before hydration) */}
        <div
          id="initial-loader"
          aria-label="Loading Aiel Studio"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              <div style="position: absolute; width: 45vw; height: 45vw; border-radius: 50%; background: radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%); filter: blur(40px); pointer-events: none;"></div>
              <div style="position: relative; overflow: hidden; text-align: center;">
                <span class="loader-brand">Aiel</span>
              </div>
              <p class="loader-sub">Design &amp; Printing Studio</p>
              <div class="loader-track">
                <div id="loader-progress-bar" class="loader-fill"></div>
              </div>
              <div id="loader-progress-text" class="loader-count">0%</div>
            `,
          }}
        />

        {/* Loader Lifecycle Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                document.documentElement.classList.add('loader-locked');
                document.body.classList.add('loader-locked');
                var start = performance.now();
                var minDuration = 600;
                var maxDuration = 4000;
                var dismissed = false;
                var bar = document.getElementById('loader-progress-bar');
                var text = document.getElementById('loader-progress-text');
                var loader = document.getElementById('initial-loader');

                function isReady() {
                  var fontsReady = document.fonts ? document.fonts.status === 'loaded' : true;
                  var isHome = window.location.pathname === '/' || window.location.pathname === '';
                  var threeDReady = !isHome || window.__AIEL_3D_READY === true;
                  var imgs = Array.from(document.images).slice(0, 4);
                  var imagesReady = true;
                  for (var i = 0; i < imgs.length; i++) {
                    if (!imgs[i].complete) { imagesReady = false; break; }
                  }
                  return fontsReady && threeDReady && imagesReady;
                }

                function dismiss() {
                  if (dismissed) return;
                  dismissed = true;
                  if (bar) bar.style.width = '100%';
                  if (text) text.textContent = '100%';
                  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  var fade = reduced ? 0 : 300;
                  setTimeout(function() {
                    document.documentElement.classList.add('loader-dismissed');
                    document.body.classList.add('loader-dismissed');
                    if (loader) {
                      loader.classList.add('dismissed');
                      loader.style.opacity = '0';
                      loader.style.pointerEvents = 'none';
                    }
                    setTimeout(function() {
                      if (loader) {
                        loader.style.display = 'none';
                        try { loader.parentNode && loader.parentNode.removeChild(loader); } catch(e){}
                      }
                      document.documentElement.classList.remove('loader-locked');
                      document.body.classList.remove('loader-locked');
                      try { sessionStorage.setItem('aiel_visited', '1'); } catch(e){}
                      window.__AIEL_LOADER_DONE = true;
                      window.dispatchEvent(new CustomEvent('aiel:loader-done'));
                    }, fade);
                  }, 80);
                }

                var timer = setInterval(function() {
                  var elapsed = performance.now() - start;
                  var ready = isReady();
                  var targetPercent = Math.min(95, (elapsed / 1200) * 90);
                  if (bar) bar.style.width = Math.round(targetPercent) + '%';
                  if (text) text.textContent = Math.round(targetPercent).toString().padStart(3, '0') + '%';

                  if ((ready && elapsed >= minDuration) || elapsed >= maxDuration) {
                    clearInterval(timer);
                    dismiss();
                  }
                }, 30);

                window.addEventListener('aiel:3d-ready', function() {
                  var elapsed = performance.now() - start;
                  if (elapsed >= minDuration) {
                    clearInterval(timer);
                    dismiss();
                  }
                });
              } catch(e) {
                var l = document.getElementById('initial-loader');
                if (l) l.style.display = 'none';
                document.documentElement.classList.remove('loader-locked');
                document.body.classList.remove('loader-locked');
              }
            })();`,
          }}
        />

        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NavigationProgressBar() {
  const isNavigating = useRouterState({
    select: (s) => s.status === "pending",
  });
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isNavigating) {
      setVisible(true);
      setProgress(25);
      const t1 = setTimeout(() => setProgress(70), 120);
      const t2 = setTimeout(() => setProgress(90), 280);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setProgress(100);
      const t3 = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 180);
      return () => clearTimeout(t3);
    }
  }, [isNavigating]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-hidden="true"
      className="fixed top-0 inset-x-0 h-[2.5px] z-[99999] pointer-events-none"
    >
      <div
        className="h-full bg-brand-gradient transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    const ensureDismissed = () => {
      const loader = document.getElementById("initial-loader");
      if (loader) {
        loader.style.display = "none";
        loader.remove?.();
      }
      document.documentElement.classList.remove("loader-locked");
      document.documentElement.classList.add("loader-dismissed");
      document.body.classList.remove("loader-locked");
      document.body.classList.add("loader-dismissed");
    };

    if (typeof window !== "undefined" && (window as any).__AIEL_LOADER_DONE) {
      ensureDismissed();
      return undefined;
    } else {
      window.addEventListener("aiel:loader-done", ensureDismissed);
      const timer = setTimeout(() => {
        (window as any).__AIEL_LOADER_DONE = true;
        window.dispatchEvent(new CustomEvent("aiel:loader-done"));
        ensureDismissed();
      }, 4200);
      return () => {
        window.removeEventListener("aiel:loader-done", ensureDismissed);
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationProgressBar />
      <ClientOnly fallback={null}>
        <SplashCursor />
      </ClientOnly>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
