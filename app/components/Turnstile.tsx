"use client";

import Script from "next/script";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

/**
 * Cloudflare Turnstile human check, rendered explicitly so the page can reset
 * it: a token is single-use, and the form stays on screen after a failed
 * submission. The server verifies the token (lib/turnstile.ts).
 */

// Public by design; the matching secret lives only in the server's env.
export const TURNSTILE_SITE_KEY = "0x4AAAAAAE8hiW0lzJVzhbMR";

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
    render();
    return () => {
      if (window.turnstile && widgetId.current) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [render]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={render}
      />
      <div ref={container} />
    </>
  );
});

export default Turnstile;
