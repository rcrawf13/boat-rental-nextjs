import { setDefaultResultOrder } from "node:dns";
import { existsSync } from "node:fs";
import path from "node:path";
import { config as loadDotenv } from "dotenv";
import { createClient } from "@supabase/supabase-js";

/** Avoid `fetch failed` to Supabase on some Windows networks (IPv6 first). No-op on Vercel. */
if (!process.env.VERCEL) {
  try {
    setDefaultResultOrder("ipv4first");
  } catch {
    /* Node < 17 */
  }
}

let envLoaded = false;

function findProjectRoot(): string {
  let dir = process.cwd();
  for (;;) {
    if (existsSync(path.join(dir, "package.json"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return process.cwd();
    dir = parent;
  }
}

/** Load .env then .env.local from project root (Next may not have merged them in this worker yet). */
function ensureLocalEnvLoaded() {
  if (envLoaded) return;
  envLoaded = true;
  const root = findProjectRoot();
  const envFile = path.join(root, ".env");
  const localFile = path.join(root, ".env.local");
  if (existsSync(envFile)) {
    loadDotenv({ path: envFile, quiet: true });
  }
  if (existsSync(localFile)) {
    loadDotenv({ path: localFile, override: true, quiet: true });
  }
}

function env(name: string): string | undefined {
  ensureLocalEnvLoaded();
  const v = process.env[name];
  if (v === undefined) return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

function firstEnv(names: string[]): string | undefined {
  for (const n of names) {
    const v = env(n);
    if (v) return v;
  }
  return undefined;
}

/**
 * Server-only client. Prefer service role; falls back to anon/publishable keys
 * so local `.env` from Vite-style or Vercel naming still works (RLS must allow reads).
 */
export function createServiceRoleClient() {
  const url = firstEnv([
    "SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "VITE_SUPABASE_URL",
  ]);
  const key = firstEnv([
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SECRET_KEY",
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
  ]);
  if (!url || !key) {
    if (process.env.NODE_ENV === "development") {
      const root = findProjectRoot();
      console.warn(
        "[supabaseService] Missing Supabase env. cwd=%s root=%s hasEnv=%s hasLocal=%s",
        process.cwd(),
        root,
        existsSync(path.join(root, ".env")),
        existsSync(path.join(root, ".env.local"))
      );
    }
    throw new Error(
      "Missing Supabase URL or API key (set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY, or VITE_/NEXT_PUBLIC_ fallbacks)"
    );
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
