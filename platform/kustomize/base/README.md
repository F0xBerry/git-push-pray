# Kustomize base

Shared Kubernetes objects for all environments.

Resources:

- `deployment-api.yaml` / `service-api.yaml` — Express API (`scout-api:3001`).
- `deployment-web.yaml` / `service-web.yaml` — nginx UI; `API_UPSTREAM=scout-api`.
- `deployment-worker.yaml` — placeholder worker.

Overlays under `../overlays/{dev,staging,prod}/` set **namespace** and **images** (`ghcr.io/f0xberry/...` — change to your registry).

Render:

```bash
kubectl kustomize platform/kustomize/overlays/dev
```

If you see warnings about `commonLabels` being deprecated, you can migrate to the `labels` field in a later PR (`kustomize edit fix`).
