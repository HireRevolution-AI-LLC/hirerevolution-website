"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

/**
 * Cloudflare Turnstile human check, rendered explicitly so the page can reset
 * it: a token is single-use, and the form stays on screen after a failed
 * submission. The server verifies the token (lib/turnstile.ts).
 */

// Public by design; the matching secret lives only in the server's env.
export const TURNSTILE_SITE_KEY = "0x4AAAAAAE8hiW0lzJVzhbMR";

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Loads Turnstile's script once, from the browser, after hydration.
 *
 * Not next/script: that also writes a <link rel="preload"> for the URL into
 * the server-rendered HTML, and a cross-origin script referenced from markup
 * without an `integrity` hash is what scanners report as unsafe SRI. It can't
 * be given one: Cloudflare updates api.js in place and requires it be fetched
 * as-is from that URL, so a pinned hash would break the form on their next
 * release (https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/).
 * Creating the element here keeps the URL out of the markup; what may load
 * it is still decided by script-src (lib/csp.ts).
 */
let scriptLoad: Promise<void> | null = null;
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptLoad ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      // Let a later mount try again instead of failing forever.
      scriptLoad = null;
      script.remove();
      reject(new Error("Turnstile script failed to load"));
    };
    document.head.appendChild(script);
  });
  return scriptLoad;
}

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export type TurnstileHandle = { reset: () => void };

type Props = {
  action: string;
  onToken: (token: string) => void;
};

const Turnstile = forwardRef<TurnstileHandle, Props>(function Turnstile({ action, onToken }, ref) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  const render = useCallback(() => {
    if (!window.turnstile || !container.current || widgetId.current) return;
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: TURNSTILE_SITE_KEY,
      action,
      // The site is light-only; don't follow the visitor's dark mode.
      theme: "light",
      callback: (token: string) => onTokenRef.current(token),
      "expired-callback": () => onTokenRef.current(""),
      "error-callback": () => onTokenRef.current(""),
    });
  }, [action]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      onTokenRef.current("");
      if (window.turnstile && widgetId.current) window.turnstile.reset(widgetId.current);
    },
  }));

  // The script may already be loaded (client-side navigation back to the page).
  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (!cancelled) render();
      })
      // No widget means no token, and the form already refuses to submit
      // without one -- the same state as a Turnstile error-callback.
      .catch(() => onTokenRef.current(""));
    return () => {
      cancelled = true;
      if (window.turnstile && widgetId.current) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [render]);

  return <div ref={container} />;
});

export default Turnstile;
