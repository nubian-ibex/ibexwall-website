---
title: "Mandatory setup for a corporate Linux desktop"
description: "The checklist a company should enforce on every Linux desktop before it goes to an employee: disk encryption, Secure Boot, accounts, firewall, updates and SSH, and how IbexWall proves each one holds."
slug: "corporate-linux-desktop-mandatory-setup"
date: 2026-11-06
updated: 2026-11-06
tags: [corporate, installation, checklist, compliance]
related_hardening: []
---

A company rolling out Linux desktops usually writes a policy and then trusts that each machine follows it. This article turns that policy into a concrete checklist, and points to the IbexWall checks that prove each item actually holds on the machine.

## Disk encryption, before anything else

Encrypt the disk and the swap, and unlock with a TPM2-bound key where the firmware supports it, so the machine boots without a second password but still refuses a removed disk. Without encryption, every other control is moot: the data walks out the door with the laptop.

What IbexWall validates: `posture.disk_encryption` and `posture.swap_encryption` read the real state of the disk and swap, and report honestly when they cannot.

## Secure Boot and kernel lockdown

Turn on Secure Boot and enable kernel lockdown. Together they keep an attacker from booting a tampered kernel or loading an unsigned module from a running system.

What IbexWall validates: `posture.secure_boot` and `posture.lockdown`.

## Accounts: no empty passwords, no stray root, lockout on

A corporate desktop has exactly one administrator path, and it requires a password. Check that no account has an empty password, that only the intended accounts hold uid 0, and that failed logins lock the account.

What IbexWall validates: `accounts.empty_passwords`, `accounts.uid0` and `accounts.lockout`.

## sudo asks for a password, and logs

Configure sudo to require the user's password, and to log what it runs. A no-password sudo turns a stolen session into instant root; an unlogged sudo hides what was done.

What IbexWall validates: `posture.sudo_nopasswd` and `accounts.sudo_logging`.

## A firewall that denies inbound by default

Nothing should listen for new connections unless the company opened it. On Fedora that is firewalld, on Ubuntu ufw, and IbexWall works through whichever is present.

What IbexWall validates: `firewall.default_deny`, and the firewall screen closes what should not listen.

## Updates that install themselves

Enable automatic security updates so a known flaw is closed without waiting for a person. This is the cheapest control there is and the one attackers rely on you skipping.

What IbexWall validates: `posture.updates_automatic`, `updates.automatic` and `cves.security_updates`.

## SSH, if it is on at all

If a desktop accepts SSH, harden it: no root login, no password-only login, and no short keys. If it does not need SSH, turn it off.

What IbexWall validates: `ssh.hardening`.

## Backups, tested by restoring

No check can prove a backup works. The rule is: once a month, restore one file from the most recent backup to a scratch folder. Ransomware, a failing disk and a mistyped `rm` all end at the same place.

## Prove it, per machine

A policy that says "encrypt the disk" is not encryption. The value of IbexWall in a corporate rollout is that each machine can prove its own posture, and a fleet manager can collect a signed report (`ibexctl compliance export`) without IbexWall itself phoning home. The Compliance screen maps the machine against LGPD, NIST and ISO where the company needs evidence for an audit.
