# overlay: `prod`

Production: **образы закреплены по digest** в `kustomization.yaml` (не по движущемуся тегу).

## Обновить digest после сборки в registry

Нужен **`crane`** (предпочтительно) или **`docker`**. Для приватного GHCR:

```bash
echo "$GITHUB_TOKEN" | crane auth login ghcr.io -u YOUR_GH_USER --password-stdin
```

Из корня репозитория (по умолчанию тег образа **`prod`**):

```bash
python3 scripts/pin_prod_digests.py
# или
./scripts/pin-prod-digests.sh
```

Другой тег (например после CI пуша `staging`):

```bash
TAG=staging python3 scripts/pin_prod_digests.py
```

Переменные **`REGISTRY`**, **`ORG`**, **`TAG`** переопределяют `ghcr.io` / `f0xberry` / `prod`.

После скрипта закоммить изменения в **`kustomization.yaml`** — это и есть «immutable deploy» в Git.

## Плейсхолдеры в git

Пока не запускали скрипт, в файле стоят **фиктивные** digest (`1111…`, `2222…`, `3333…`) — кластер **не сможет** скачать образы. Перед реальным продом обязательно выполните скрипт и закоммитьте реальные `sha256:`.

## PR

Ограничьте, кто может мержить в этот overlay (CODEOWNERS / branch protection).
