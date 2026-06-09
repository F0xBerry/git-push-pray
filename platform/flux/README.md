# Flux (GitOps)

Point a `GitRepository` at this repo and a `Kustomization` at:

- `platform/kustomize/overlays/dev` (and separate resources for staging/prod).

Official Flux docs: <https://fluxcd.io/flux/>

Example (adjust branch/path/namespace):

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: scout
  namespace: flux-system
spec:
  interval: 1m
  url: https://github.com/YOUR_ORG/scout-devops-hackathon
  ref:
    branch: main
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: scout-dev
  namespace: flux-system
spec:
  interval: 10m
  path: ./platform/kustomize/overlays/dev
  prune: true
  sourceRef:
    kind: GitRepository
    name: scout
  targetNamespace: scout-dev
```
