# Argo CD — Scout

Источник правды для манифестов — **`platform/kustomize/overlays/<env>`**. Argo CD сравнивает кластер с Git и синхронизирует.

## Быстрая установка (текущий kube-контекст)

Из корня репозитория:

```bash
chmod +x scripts/install-argocd.sh
./scripts/install-argocd.sh
```

Скрипт: создаёт `argocd`, ставит Argo CD **v2.13.5** (`kubectl apply -k … -n argocd` — upstream без `metadata.namespace` иначе уезжает в `default`), ждёт `argocd-server`, применяет `application-dev.yaml`, печатает начальный пароль `admin`.

Если уже запускал старую версию скрипта без `-n argocd`, часть объектов могла оказаться в **`default`**. Удали их или переустанови: `kubectl delete deployment,svc,sa,cm,secret -n default -l app.kubernetes.io/part-of=argocd` (осторожно, только если в `default` нет других приложений Argo).

### Вручную (без скрипта)

```bash
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -k platform/argocd/install -n argocd
kubectl rollout status deployment/argocd-server -n argocd --timeout=300s
kubectl apply -f platform/argocd/application-dev.yaml
```

Установка использует закреплённый манифест upstream + патч `server.insecure=true`, чтобы UI открывался по **HTTP** на `port-forward` без отдельного TLS (для локальной/внутренней среды; для прод смотри [документацию Argo CD](https://argo-cd.readthedocs.io/)).

## UI и логин

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:80
```

Браузер: **http://localhost:8080** — пользователь **`admin`**, пароль:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo
```

В UI открой приложение **scout-dev** → **Sync** (или жди auto-sync: в `application-dev.yaml` включены `automated` + `CreateNamespace=true`).

## Предпосылки

- Образы из overlay доступны из кластера (публичный GHCR или `imagePullSecrets` на Deployment’ах Scout).

## Файлы

| Путь | Назначение |
|------|------------|
| `install/kustomization.yaml` | Upstream `install.yaml` + JSON patch `server.insecure=true` |
| `application-dev.yaml` | `Application` → `platform/kustomize/overlays/dev` |

Перед применением при необходимости отредактируй **`application-dev.yaml`**: `spec.source.repoURL`, `targetRevision`.

Для **staging/prod** — скопируй `application-dev.yaml`, поменяй `metadata.name`, `spec.source.path`, `spec.destination.namespace`.

## Приватный Git

Настрой репозиторий в Argo (Settings → Repositories или Secret с label `argocd.argoproj.io/secret-type: repository`).
