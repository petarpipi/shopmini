import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
// jsdom does not implement scrolling; the app only uses it for page-top resets.
window.scrollTo = () => undefined;
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
