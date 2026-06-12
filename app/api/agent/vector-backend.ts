import { config } from '../config.js';

export interface VectorBackendStatus {
  enabled: boolean;
  ok?: boolean;
  url?: string;
  detail?: string;
}

/** Optional Qdrant (or compatible) URL for Swimlane B — embeddings / profile cache. */
export async function getVectorBackendStatus(): Promise<VectorBackendStatus> {
  const base = config.qdrantUrl;
  if (!base) {
    return { enabled: false, detail: 'QDRANT_URL not set (optional: docker compose --profile vector + .env)' };
  }
  const root = base.replace(/\/$/, '');
  try {
    const res = await fetch(`${root}/`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    return { enabled: true, ok: res.ok, url: root, detail: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { enabled: true, ok: false, url: root, detail: msg };
  }
}
