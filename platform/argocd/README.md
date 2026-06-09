# Argo CD — Scout

Те же манифесты, что и для Flux: путь в Git **`platform/kustomize/overlays/<env>`**. Argo CD периодически **сравнивает** кластер с Git и синхронизирует.

## Предпосылки

- В кластере установлен **Argo CD** ([официальная установка](https://argo-cd.readthedocs.io/en/stable/getting_started/)).
- Образы из overlay доступны из кластера (публичный GHCR или `imagePullSecrets`).

## Установка Argo CD (кратко)

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Пароль админа и port-forward — см. [Get Started](https://argo-cd.readthedocs.io/en/stable/getting_started/).

## Подключить приложение (dev)

1. Отредактируй `application-dev.yaml`: `spec.source.repoURL` и при необходимости `targetRevision`.
2. Применить:

```bash
kubectl apply -f platform/argocd/application-dev.yaml
```

В UI Argo: приложение **scout-dev** → Sync.

## Файлы

| Файл | Назначение |
|------|------------|
| `application-dev.yaml` | `Application` на overlay **dev** (`path: platform/kustomize/overlays/dev`). |

Для **staging/prod** — скопируй файл, поменяй `metadata.name`, `spec.source.path`, `spec.destination.namespace`, опционально `project`.

## Сравнение с Flux

| | Flux | Argo CD |
|---|------|---------|
| Модель | Контроллеры в кластере тянут Git | Argo Application указывает на Git / Helm |
| Манифесты в репо | `GitRepository` + `Kustomization` (CR Flux) | `Application` (CR Argo) |
| Путь к манифестам | У нас: `platform/flux/install/dev/` | У нас: `platform/argocd/` |

Оба варианта CD используют **один** Kustomize: `platform/kustomize/overlays/...`.

## Приватный репозиторий

Создай credential в Argo (Settings → Repositories или Secret с label `argocd.argoproj.io/secret-type: repository`) и укажи в `Application` при необходимости.
