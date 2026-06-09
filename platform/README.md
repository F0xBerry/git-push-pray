# `platform/` — infrastructure as code

Kubernetes manifests, GitOps, Helm/Kustomize, cluster config. **Not** application business logic.

## Layout

| Path | Purpose |
|------|---------|
| `kustomize/base/` | Shared Deployments, Services, ConfigMaps, etc. |
| `kustomize/overlays/{dev,staging,prod}/` | Environment-specific patches (replicas, resources, image tags, namespaces). |
| `flux/install/` | Flux: `GitRepository` + Flux `Kustomization` → тот же overlay. |
| `argocd/` | Argo CD: `Application` → тот же overlay. |

## CD: Flux или Argo CD

Один репозиторий, **одни** Kustomize-манифесты под `kustomize/overlays/`. Разница только в **контроллере**:

- **Flux** — см. `flux/README.md`, применить `platform/flux/install/dev/`.
- **Argo CD** — см. `argocd/README.md`, применить `platform/argocd/application-dev.yaml`.


1. CI builds and pushes a container image (digest or tag per commit).
2. GitOps controller reconciles `platform/kustomize/overlays/<env>` to the cluster.
3. Promote by PR: `dev` → `staging` → `prod` overlay changes only.

## Secrets

Never commit raw API keys. Use External Secrets Operator, Sealed Secrets, Vault, or AgentGateway — wire manifests here, values live in the cluster / secret store.
