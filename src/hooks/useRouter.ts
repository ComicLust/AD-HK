"use client";

import { useCallback, useSyncExternalStore } from "react";

function getRoute(): string {
  if (typeof window === "undefined") return "/";
  if (window.location.hash.startsWith("#/")) {
    const cleanPath = window.location.hash.slice(1);
    window.history.replaceState({}, "", cleanPath);
    return cleanPath;
  }
  return window.location.pathname;
}

function subscribeToPathname(callback: () => void) {
  const handleNav = () => callback();
  window.addEventListener("pushstate", handleNav);
  window.addEventListener("popstate", handleNav);
  window.addEventListener("hashchange", handleNav);
  return () => {
    window.removeEventListener("pushstate", handleNav);
    window.removeEventListener("popstate", handleNav);
    window.removeEventListener("hashchange", handleNav);
  };
}

export function useRouter() {
  const route = useSyncExternalStore(
    subscribeToPathname,
    getRoute,
    () => "/"
  );

  const navigate = useCallback((path: string) => {
    // Automatically strip legacy hash tags if passed
    const cleanPath = path.startsWith("#") ? path.slice(1) : path;
    window.history.pushState({}, "", cleanPath || "/");
    window.dispatchEvent(new Event("pushstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return { route, navigate };
}
