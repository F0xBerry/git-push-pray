# Локальный kind без пуша в GHCR

Overlay `dev` подставляет образы вида `ghcr.io/f0xberry/scout-api:dev`. В **kind** узлы **не видят** твой Docker на хосте, пока образы **не загружены** в кластер (`kind load docker-image`).

## 1. Собери образы с теми же тегами, что в overlay

Из **корня репозитория**:

```bash
docker build -f Dockerfile.api -t ghcr.io/f0xberry/scout-api:dev .
docker build -f Dockerfile.web -t ghcr.io/f0xberry/scout-web:dev .
docker build -f Dockerfile.worker -t ghcr.io/f0xberry/scout-worker:dev .
```

## 2. Загрузи их в kind

Имя кластера — из `kind get clusters` (пример: `scout` или `kind`):

```bash
CLUSTER=scout   # подставь своё

kind load docker-image ghcr.io/f0xberry/scout-api:dev --name "$CLUSTER"
kind load docker-image ghcr.io/f0xberry/scout-web:dev --name "$CLUSTER"
kind load docker-image ghcr.io/f0xberry/scout-worker:dev --name "$CLUSTER"
```

После этого kubelet возьмёт образ **с ноды**, без pull из интернета (при `IfNotPresent` достаточно).

## 3. Примени манифесты и перезапусти rollout

```bash
kubectl apply -k platform/kustomize/overlays/dev
kubectl rollout restart deployment -n scout-dev --all
kubectl get pods -n scout-dev
```

## 4. Если всё ещё Failed

```bash
kubectl describe pod -n scout-dev -l app.kubernetes.io/name=scout-api
kubectl logs -n scout-dev -l app.kubernetes.io/name=scout-api --tail=50
```

Типично: **не тот тег**, образ **не загрузили** в тот кластер, или **CrashLoop** (тогда смотри логи приложения).

## 5. Когда будешь пушить в GHCR

Тогда `kind load` не нужен: CI пушит образы, overlay оставляешь как есть, в kind образы тянутся с registry (для приватного GHCR — `imagePullSecrets`).
