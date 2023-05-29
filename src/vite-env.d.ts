/// <reference types="vite/client" />

/* allows importing *.json files from ts(x) */
declare module "*.json" {
  const src: Record<string, unknown>;
  export default src;
}
