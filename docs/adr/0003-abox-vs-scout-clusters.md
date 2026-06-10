# ADR 0003: No Flux in repo; abox vs Scout deployment

## Status

Accepted

## Context

The hackathon references [abox](https://github.com/den-vasyliev/abox), which ships its own KinD stack and GitOps story. This repository previously duplicated a **Flux v2** install (`GitRepository` + Flux `Kustomization` under `platform/flux/`), which risked confusion and conflict if someone also ran abox or a second Flux bootstrap in the same cluster.

## Decision

1. **Remove Flux manifests from this repository.** No `platform/flux/`, no Flux CRs checked in here.
2. **Deploy Scout** with **`kubectl apply -k platform/kustomize/overlays/<env>`** and/or **Argo CD** (`platform/argocd/`).
3. **abox** remains an optional **separate** demo of the platform sandbox; document the split in [`docs/abox-and-scout-topology.md`](../abox-and-scout-topology.md).

## Consequences

- **Positive:** simpler repo; no second Flux source of truth; aligns with “Kustomize is the contract”, CD is optional Argo or CI.
- **Negative:** no pull-based Flux out of the box; teams that want Flux add it themselves or use abox’s stack for platform-only GitOps.

## References

- [`docs/abox-and-scout-topology.md`](../abox-and-scout-topology.md)
