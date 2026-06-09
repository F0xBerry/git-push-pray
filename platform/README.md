# `platform/` — infrastructure as code

Kubernetes manifests, GitOps, Helm/Kustomize, cluster config. **Not** application business logic.

## Layout

| Path | Purpose |
|------|---------|
| `kustomize/base/` | Shared Deployments, Services, ConfigMaps, etc. |
| `kustomize/overlays/{dev,staging,prod}/` | Environment-specific patches (replicas, resources, image tags, namespaces). |
| `flux/` | Notes and example `GitRepository` / `Kustomization` snippets for Flux (or hand off to Argo CD equivalent). |

## Flow

1. CI builds and pushes a container image (digest or tag per commit).
2. GitOps controller reconciles `platform/kustomize/overlays/<env>` to the cluster.
3. Promote by PR: `dev` → `staging` → `prod` overlay changes only.

## Secrets

Never commit raw API keys. Use External Secrets Operator, Sealed Secrets, Vault, or AgentGateway — wire manifests here, values live in the cluster / secret store.
