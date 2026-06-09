/**
 * Placeholder worker for Kubernetes / docker-compose.
 * Replace with real job processing (embeddings, outbound webhooks, etc.).
 */
const intervalMs = Number(process.env.WORKER_HEARTBEAT_MS || 30_000);

setInterval(() => {
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify({
      level: "info",
      msg: "scout-worker heartbeat",
      ts: new Date().toISOString(),
    }),
  );
}, intervalMs);
