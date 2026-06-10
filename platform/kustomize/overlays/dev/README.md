# overlay: `dev`

Development cluster / namespace. Image tags often point to `:main` or a moving tag; for production use immutable digests.

## Apply

Some `kubectl` versions race when creating `Namespace` and namespaced objects in one shot. If you see `namespaces "scout-dev" not found`, apply the namespace first, then the rest:

```bash
kubectl apply -f namespace.yaml
kubectl apply -k .
```

From repo root:

```bash
kubectl apply -f platform/kustomize/overlays/dev/namespace.yaml
kubectl apply -k platform/kustomize/overlays/dev
```
