# `platform/` — infrastructure as code

Kubernetes manifests, GitOps, Helm/Kustomize, cluster config. **Not** application business logic.

## Layout

| Path | Purpose |
|------|---------|
| `kustomize/base/` | Shared Deployments, Services, ConfigMaps, etc. |
| `kustomize/overlays/{dev,staging,prod}/` | Environment-specific patches (replicas, resources, image tags, namespaces). |
| `argocd/` | Argo CD: `Application` → тот же overlay (опционально). |

## Деплой

**Без GitOps-контроллера в репо:** применяй Kustomize напрямую:

```bash
kubectl apply -k platform/kustomize/overlays/dev
```

**С GitOps:** [Argo CD](argocd/README.md) — `platform/argocd/application-dev.yaml` указывает на тот же путь `platform/kustomize/overlays/<env>`.

Типичный поток:

1. CI собирает и пушит образы (тег/digest на коммит).
2. Либо пайплайн делает `kubectl apply -k …`, либо Argo CD синхронизирует Git с кластером.
3. Продвижение окружений — PR в overlay: `dev` → `staging` → `prod`.

## abox (hackathon sandbox)

[abox](https://github.com/den-vasyliev/abox) (`make run`) поднимает свой KinD и платформенный стек (в т.ч. свой сценарий GitOps). Как совмещать с этим репозиторием — [`docs/abox-and-scout-topology.md`](../docs/abox-and-scout-topology.md).

## Secrets

Never commit raw API keys. Use External Secrets Operator, Sealed Secrets, Vault, or AgentGateway — wire manifests here, values live in the cluster / secret store.
