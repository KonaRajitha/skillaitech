import { auth, defineMcp } from "@lovable.dev/mcp-js";
import echoTool from "./tools/echo";
import whoamiTool from "./tools/whoami";

// The OAuth issuer MUST be the direct Supabase host, not the .lovable.cloud proxy.
// VITE_SUPABASE_PROJECT_ID is inlined by Vite at build time.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "skill-ai-mcp",
  title: "Skill.Ai",
  version: "0.1.0",
  instructions:
    "Skill.Ai tools for AI clients. Use `echo` to verify connectivity and `whoami` to check the signed-in user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [echoTool, whoamiTool],
});
