---
title: "Security"
description: "How IbexWall is built to be trusted: plans and snapshots, signed plugins and releases, sandboxed plugins, confined services, and how to report a vulnerability."
updated: 2026-11-06
---

A security tool has to be safer than the computer it protects. This page lists what IbexWall does about that and what it does not claim.

## Changes you can see and undo

Nothing is changed without a plan. A plan lists the exact files, services and firewall rules, with a preview of the difference and a note on what could break. A snapshot is taken before it is applied. A change that could cut your network waits for your confirmation and undoes itself if you do not give it. History lists every change and undoes any of them.

## Plugins propose, the core executes

A plugin reads the system and describes a change. It cannot make one. Only the core applies changes, as root, through the plan, the snapshot and your approval. IbexWall edits only its own files (drop-ins with `ibexwall` in the name and its own firewall table) and never the ones your distribution or another program owns.

## Signed, sandboxed, confined

- Plugin manifests are signed. The daemon is built with the release public key and refuses a manifest that does not verify.
- Each of the 32 plugins runs in its own systemd unit: a dynamic user, no capabilities unless it declares them, a read-only system. The unit's score from `systemd-analyze security` is published for every plugin.
- On Debian and Ubuntu, AppArmor profiles confine the resolver, the assistant server and the plugins. On Fedora, an SELinux module does. Both are tested with enforcement on.

## Releases you can check

Every release has checksums, a signature for each file, a software bill of materials (CycloneDX) and a provenance statement. The build is reproducible: building the same commit twice, in different folders, gives identical files.

## What it does not do

IbexWall does not protect a computer from someone who already has root on it, and it cannot make an insecure program safe. It reduces the surface and tells you what is exposed. Its threat model is public in the [documentation](https://docs.ibexwall.com/concepts/security-model/).

## The release key

The key that signs releases will be published here and in the repository before version 1.0 is released. Until then the packages built by the project's tests are signed with a development key that is not valid for a release.

## Report a vulnerability

Use GitHub's private vulnerability reporting on the [repository](https://github.com/nubian-ibex/ibexwall/security). Please do not open a public issue for a security problem, and do not include secrets in a report. We aim to answer within a few days.
