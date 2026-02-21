import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

// @ts-ignore
const handleRequest = createPagesFunctionHandler({
  // @ts-ignore
  build: import("../build"),
  getLoadContext: (context) => context.env,
  mode: process.env.NODE_ENV,
});

export function onRequest(context) {
  return handleRequest(context);
}
