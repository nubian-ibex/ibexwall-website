---
title: "Known attacks against corporate Linux desktops, and how to stop them"
description: "The documented ways attackers get into Linux desktops in companies: credential theft, privilege escalation, persistence and supply chain. What stops each, and how IbexWall validates it."
slug: "attacks-against-corporate-linux-desktops"
date: 2026-11-06
updated: 2026-11-06
tags: [attacks, corporate, hardening, validation]
related_hardening: []
---

Attackers rarely write a brand-new exploit for a Linux desktop. They reuse a short list of known techniques, because those keep working. This article lists the techniques, what stops each, and how IbexWall turns "we think we stopped it" into a check that says so.

## Credential theft and weak accounts

The most common entry is a password that is empty, reused, or on a machine where someone can become root without one. On a corporate desktop the risk is compounded by SSH left open and by sudo configured to ask for no password.

What stops it: no empty passwords, no stray uid 0, account lockout, sudo that requires a password, and SSH hardened. IbexWall checks all of these: `accounts.empty_passwords`, `accounts.uid0`, `accounts.lockout`, `posture.sudo_nopasswd` and `ssh.hardening`.

## Privilege escalation

Once in as an unprivileged user, the attacker escalates. Common routes are a writable sensitive file, a setuid binary, an old kernel with a known flaw, or an unlocked session.

What stops it: patching promptly, strict permissions on `/etc/shadow`, `/etc/passwd` and `/etc/sudoers`, and an automatic screen lock. IbexWall checks pending updates, sensitive-file permissions (`accounts.file_perms`), sudo logging and `session_lock.automatic`.

## Persistence

After escalation, the attacker wants to survive a reboot. Documented techniques include autostart entries, cron jobs, shell startup files, and `LD_PRELOAD`. A clean boot that silently reloads a backdoor is the goal.

What stops it: watching those locations for changes. IbexWall's `endpoint.persistence` hashes units, timers, cron, autostart, shell startup and `LD_PRELOAD`, and reports what is new or changed since a baseline you accepted.

## Supply chain and running the unknown

A compromised package, a cloned repository, or a script from a forum can plant code that then phones home or reads the disk. This is less about "malware scanning" and more about only running what you trust and watching what it reaches.

What stops it: package signatures, a firewall that denies inbound by default, and per-program network control. IbexWall checks that package signatures are enforced (`updates.signatures`), that the firewall default-denies (`firewall.default_deny`), and it asks the first time any new program reaches the network.

## The point of validation

None of these defenses is new. What is hard is knowing, on a specific machine, which ones actually hold. A policy that says "encrypt the disk and lock accounts" is not encryption. IbexWall turns each defense into a check that reads the real state, reports honestly when it cannot read it, and lets a person fix what failed through a reviewed, undoable plan. A company gets a machine that proves its own posture, instead of one that was told to be secure.
