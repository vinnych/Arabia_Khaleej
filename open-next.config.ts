/**
 * Arabia Khaleej — OpenNext Cloudflare Configuration
 * 
 * Why this configuration structure is required by @opennextjs/cloudflare:
 * 
 * The OpenNext build system validates that this config has the correct `override` fields
 * for Cloudflare Workers compatibility. Here's why each override exists:
 * 
 * 1. wrapper: "cloudflare-node"
 *    Why: Wraps the Next.js server with Cloudflare Workers' Node.js-compatible fetch handler.
 *    This is different from "cloudflare-edge" which is for pure Edge Runtime without Node.js compat.
 *    We use "cloudflare-node" because our wrangler.toml has `compatibility_flags = ["nodejs_compat"]`.
 * 
 * 2. converter: "edge"
 *    Why: Converts the Next.js request/response format to the Web Fetch API format used by Workers.
 *    The Workers runtime uses the standard Request/Response Web API, not Node.js's IncomingMessage.
 * 
 * 3. proxyExternalRequest: "fetch"
 *    Why: Routes external HTTP calls through the global fetch() available in Workers, instead of
 *    the Node.js http/https modules which are only available with nodejs_compat, not globally.
 * 
 * 4. incrementalCache: "dummy"
 *    Why: Disables ISR (Incremental Static Regeneration) caching. Our app is fully dynamic
 *    (all routes marked as `export const runtime = 'edge'`), so ISR is not used.
 *    A real cache would require Cloudflare KV or R2 binding for storage.
 * 
 * 5. tagCache: "dummy"
 *    Why: Disables cache tag-based invalidation (used for `revalidateTag()`). Our app doesn't
 *    use Next.js cache tags, so a dummy implementation is appropriate.
 * 
 * 6. queue: "direct"
 *    Why: "direct" mode processes background work synchronously within the same Worker invocation.
 *    This is the simplest mode and correct for our use case which has no background queuing needs.
 * 
 * 7. edgeExternals: ["node:crypto"]
 *    Why: The middleware runs in the Edge runtime and uses Web Crypto API (btoa, crypto.randomUUID).
 *    Declaring node:crypto here ensures it's treated as an external by the bundler,
 *    preventing it from being bundled when the Edge runtime already provides it natively.
 * 
 * 8. middleware: { external: true }
 *    Why: Keeps the middleware as a separate bundled unit from the main worker.
 *    This matches the Next.js middleware execution model where middleware runs before
 *    the main route handler, with its own isolated scope.
 */
import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "direct",
    },
  },
  edgeExternals: ["node:crypto"],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "direct",
    },
  },
};

export default config;
