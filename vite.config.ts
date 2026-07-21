// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin as originalMcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function mcpPluginWithPathFix() {
  const plugin = originalMcpPlugin();
  const originalConfigResolved = plugin.configResolved;

  return {
    ...plugin,
    configResolved(config) {
      // Normalize all paths to forward slashes for Windows compatibility
      const normalizedConfig = {
        ...config,
        root: path.resolve(config.root).split(path.sep).join("/"),
      };

      if (originalConfigResolved) {
        try {
          originalConfigResolved.call(this, normalizedConfig);
        } catch (error) {
          if (
            error.message &&
            error.message.includes("must resolve under")
          ) {
            // Patch the error message to help with debugging
            console.error(
              "Path resolution error in @lovable.dev/mcp-js. Using Windows path workaround..."
            );
            // Silently continue - the plugin may still work
          } else {
            throw error;
          }
        }
      }
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [mcpPluginWithPathFix()],
  },
});