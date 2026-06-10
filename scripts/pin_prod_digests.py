#!/usr/bin/env python3
"""
Resolve ghcr.io scout image digests for tag :prod (or $TAG) and write them into
platform/kustomize/overlays/prod/kustomization.yaml.

Requires: crane (recommended) — go install github.com/google/go-containerregistry/cmd/crane@latest
Fallback: docker (pull + docker inspect RepoDigests)

Env:
  REGISTRY  default ghcr.io
  ORG       default f0xberry
  TAG       default prod
"""
from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path


def run(cmd: list[str]) -> str:
    return subprocess.check_output(cmd, text=True).strip()


def crane_digest(registry: str, org: str, image: str, tag: str) -> str:
    ref = f"{registry}/{org}/{image}:{tag}"
    d = run(["crane", "digest", ref])
    return d if d.startswith("sha256:") else f"sha256:{d}"


def docker_digest(registry: str, org: str, image: str, tag: str) -> str:
    ref = f"{registry}/{org}/{image}:{tag}"
    run(["docker", "pull", "-q", ref])
    out = run(
        [
            "docker",
            "inspect",
            "--format={{index .RepoDigests 0}}",
            ref,
        ]
    )
    if "@" not in out:
        sys.exit(f"docker inspect did not return repo digest for {ref}: {out}")
    return out.split("@", 1)[1]


def resolve_digest(registry: str, org: str, image: str, tag: str) -> str:
    if shutil_which("crane"):
        return crane_digest(registry, org, image, tag)
    if shutil_which("docker"):
        return docker_digest(registry, org, image, tag)
    sys.exit(
        "Need `crane` or `docker` on PATH.\n"
        "  crane: go install github.com/google/go-containerregistry/cmd/crane@latest\n"
        "  For private GHCR: echo $GITHUB_TOKEN | crane auth login ghcr.io -u USER --password-stdin"
    )


def shutil_which(name: str) -> bool:
    from shutil import which

    return which(name) is not None


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    ky = root / "platform/kustomize/overlays/prod/kustomization.yaml"
    registry = os.environ.get("REGISTRY", "ghcr.io")
    org = os.environ.get("ORG", "f0xberry")
    tag = os.environ.get("TAG", "prod")

    pairs = [
        ("scout/api", "scout-api"),
        ("scout/web", "scout-web"),
        ("scout/worker", "scout-worker"),
    ]

    digests: dict[str, str] = {}
    for kname, image in pairs:
        digests[kname] = resolve_digest(registry, org, image, tag)

    text = ky.read_text(encoding="utf-8")
    for kname, image in pairs:
        d = digests[kname]
        if not d.startswith("sha256:"):
            d = f"sha256:{d}"
        ref = f"{registry}/{org}/{image}"
        pattern = (
            rf"(  - name: {re.escape(kname)}\n"
            rf"    newName: {re.escape(ref)}\n"
            rf"    digest: )(sha256:[0-9a-f]{{64}})"
        )
        new_text, n = re.subn(
            pattern,
            lambda m, digest=d: m.group(1) + digest,
            text,
            count=1,
        )
        if n != 1:
            sys.exit(
                f"Could not find digest block for {kname} / {image} in {ky} (expected one match, got {n})"
            )
        text = new_text

    ky.write_text(text, encoding="utf-8")
    print(f"Updated digests in {ky} for tag {tag!r} ({registry}/{org}/…)")


if __name__ == "__main__":
    main()
