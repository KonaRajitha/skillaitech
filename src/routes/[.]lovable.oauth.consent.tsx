import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Minimal local typing for the beta supabase.auth.oauth namespace.
type OAuthClient = { name?: string; client_id?: string };
type OAuthAuthorizationDetails = {
  client?: OAuthClient;
  scope?: string;
  redirect_uri?: string;
  redirect_url?: string;
  redirect_to?: string;
};
type OAuthResult<T> = { data: T | null; error: { message: string } | null };
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult<OAuthAuthorizationDetails>>;
  approveAuthorization: (id: string) => Promise<OAuthResult<{ redirect_url?: string; redirect_to?: string }>>;
  denyAuthorization: (id: string) => Promise<OAuthResult<{ redirect_url?: string; redirect_to?: string }>>;
};

function oauthApi(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  // Browser-only: session lives in localStorage.
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) throw redirect({ to: "/auth", search: { next } });
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Could not load this authorization request</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {String((error as Error)?.message ?? error)}
        </p>
      </div>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauthApi().approveAuthorization(authorization_id)
      : await oauthApi().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an app";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-elegant">
        <h1 className="text-xl font-semibold tracking-tight">
          Connect {clientName} to Skill.Ai
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This lets {clientName} use Skill.Ai as you. It does not bypass Skill.Ai's permissions
          or backend policies.
        </p>
        {details?.scope ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Requested access: <span className="font-medium">{details.scope}</span>
          </p>
        ) : null}
        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="mt-6 flex gap-2">
          <button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-foreground text-background py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            Approve
          </button>
          <button
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 inline-flex items-center justify-center rounded-lg border border-border bg-background py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50 transition"
          >
            Deny
          </button>
        </div>
      </div>
    </main>
  );
}
