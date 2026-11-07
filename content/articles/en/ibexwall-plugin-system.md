---
title: "The IbexWall plugin system: 32 plugins, each in its own sandbox"
description: "Why IbexWall is built from signed plugins, how one binary serves all of them, and why each runs in its own sandbox where it can only do what its manifest says."
slug: "ibexwall-plugin-system"
date: 2026-11-06
updated: 2026-11-06
tags: [plugins, sandbox, architecture, signing]
related_hardening: []
---

A security tool is only as trustworthy as its weakest part. IbexWall splits the work into 32 plugins, each responsible for one thing, and confines each one. This article explains why and how.

## What the plugins do

The plugins fall into rough groups. System plugins check and harden the machine itself: posture, accounts, SSH, sysctl, mounts, updates, the audit daemon, coredumps and firmware. Network plugins handle DNS, the firewall, exposure, Wi-Fi, NTS time and VPN. Endpoint plugins run antivirus, integrity and rootkit scans, and isolate the machine in an emergency. There are also plugins for apps, USB devices, camera and microphone, and telemetry.

Some only check, some only control, many do both. A check reads the real state and reports findings; a control proposes operations, such as a sysctl change or a firewall rule, and the core applies them.

## One binary, many plugins

The plugins ship as one multicall binary under `/usr/libexec/ibexwall/ibexwall-plugins`, started under a different name for each plugin. The name tells it which manifest to read, so there is one build to sign and audit, not thirty-two.

## Signed, and tamper-proof

Each plugin carries a manifest: its id, its name and description in five languages, and, crucially, its privileges, the sysctl keys, file paths and capabilities it may touch. The manifest is signed, and the daemon is built with the release public key embedded. A plugin whose manifest was edited after signing is refused outright. This is what lets a packaged install trust exactly the plugins it shipped with, with no development key.

## Each in its own sandbox

Each plugin runs under systemd in its own unit, with a dynamic user, no home, a private temporary directory, and only the files and sysctl keys its manifest declared. It has no shell: the operations it proposes are typed values, not command lines, so a plugin cannot sneak in an arbitrary command.

## Plugins propose, the core executes

This is the rule that holds the whole design together. A plugin never changes the system itself. It proposes typed operations, and the core validates every one against the manifest, snapshots the state, and only then applies them. The plugin asks; the core decides. That separation is why a bug or a compromise in one plugin cannot silently reach the whole machine.
