# Flux GitOps — Scout

Манифесты в `install/<env>/` подключают репозиторий к кластеру и заставляют Flux **подтягивать** `platform/kustomize/overlays/<env>` и применять изменения автоматически.

## Предпосылки

1. **Kubernetes-кластер** (локально: kind / k3d / minikube, или облако).
2. **Образы** `scout-api`, `scout-web`, `scout-worker` уже в registry (например GHCR), теги совпадают с `images:` в overlay — иначе Pod’ы не стартуют.
3. **Публичный репозиторий** на GitHub — для `GitRepository` секрет не нужен. Если репо **приватное** — создай Secret с PAT и добавь в `GitRepository` поле `spec.secretRef` (см. [Flux docs](https://fluxcd.io/flux/components/source/gitrepositories/#secret-reference)).

## 1. Установить Flux в кластер

На машине с `kubectl` и правами админа к кластеру:

```bash
# CLI: https://fluxcd.io/flux/installation/
brew install fluxcd/tap/flux   # macOS

flux check --pre
flux install --namespace=flux-system --components=source-controller,kustomize-controller
```

Проверка:

```bash
kubectl get pods -n flux-system
```

## 2. Подключить этот репозиторий (dev)

Подставь свой URL/ветку при форке (сейчас в манифестах: `https://github.com/F0xBerry/git-push-pray`, ветка `main`).

```bash
kubectl apply -f platform/flux/install/dev/
```

Проверка статуса:

```bash
flux get sources git
flux get kustomizations
kubectl get pods -n scout-dev
```

Ожидание готовности:

```bash
flux reconcile source git scout -n flux-system
flux reconcile kustomization scout-dev-apps -n flux-system --with-source
```

## 3. Что лежит в `install/dev/`

| Файл | Назначение |
|------|------------|
| `gitrepository.yaml` | Откуда тянуть Git (interval, URL, branch). |
| `scout-kustomization.yaml` | Какой **path** в репо рендерить (`./platform/kustomize/overlays/dev`), `prune`, `targetNamespace: scout-dev`, health для api/web. |

## 4. Staging / prod

Скопируй `install/dev/` → `install/staging/` и `install/prod/`, поменяй:

- имя `Kustomization` (например `scout-staging-apps`);
- `spec.path` → `./platform/kustomize/overlays/staging` или `prod`;
- `spec.targetNamespace` → `scout-staging` / `scout-prod`;
- `healthChecks` namespace в соответствии.

Один `GitRepository` `scout` обычно достаточно на все окружения.

## 5. Приватный GHCR (образы)

Если образы в GHCR **приватные**, добавь `imagePullSecrets` в Deployments (patch в overlay) и создай `Secret` типа `kubernetes.io/dockerconfigjson` в `scout-dev`.

## 6. Альтернатива: `flux bootstrap`

Для «официального» bootstrap Flux сам пишет в репо и настраивает deploy key:

```bash
flux bootstrap github \
  --owner=F0xBerry \
  --repository=git-push-pray \
  --branch=main \
  --path=./platform/flux/bootstrap
```

Тогда путь `path` должен существовать в репо — это другой layout (Flux кладёт `gotk-sync.yaml` в указанную папку). Текущие файлы в `install/dev/` можно перенести под тот `path` после bootstrap или применять вручную как выше.

## Ссылки

- [Flux — Get Started](https://fluxcd.io/flux/get-started/)
- [GitRepository](https://fluxcd.io/flux/components/source/gitrepositories/)
- [Kustomization (Flux)](https://fluxcd.io/flux/components/kustomize/kustomizations/)
