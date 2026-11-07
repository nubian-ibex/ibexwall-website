---
title: "The settings to get right when you install Linux"
description: "The choices made at install time, disk encryption, Secure Boot, accounts and partitioning, that are hard to change later, and how IbexWall validates each one afterwards."
slug: "linux-installation-mandatory-settings"
date: 2026-11-06
updated: 2026-11-06
tags: [installation, encryption, secure-boot, accounts]
related_hardening: []
---

Most Linux security decisions are made in the first hour, during installation, and are annoying to change later. This article lists the ones to get right up front, and how to check them afterwards with IbexWall.

## Encrypt the disk during install

Encrypting after install usually means reinstalling. During setup, choose full-disk encryption (LUKS), and encrypt swap too, because a suspended laptop writes the memory image to swap in the clear. Where the firmware allows, bind the unlock to the TPM2 so the machine boots without a second password but refuses a removed disk.

Check later: IbexWall's `posture.disk_encryption` and `posture.swap_encryption`.

## Enable Secure Boot

Secure Boot is a firmware setting, not an installer checkbox on every distribution, but the installer is when you notice it is off. Turn it on and enable kernel lockdown so a tampered kernel or an unsigned module is refused.

Check later: `posture.secure_boot` and `posture.lockdown`.

## Choose the accounts carefully

The first user is the administrator. Give them a real password, never an empty one, and make sure only the intended account holds uid 0. Enable account lockout so a guesser is slowed to a stop.

Check later: `accounts.empty_passwords`, `accounts.uid0` and `accounts.lockout`.

## Make sudo ask

Some installers offer passwordless sudo for convenience. Decline it. sudo that asks for a password is the difference between "someone read the disk" and "someone is root". Configure it to log what it runs.

Check later: `posture.sudo_nopasswd` and `accounts.sudo_logging`.

## Turn the firewall on from day one

A firewall that denies inbound by default costs nothing at install and prevents surprises. Fedora ships firewalld, Ubuntu ships ufw; turn whichever is there on before the machine sees the network.

Check later: `firewall.default_deny` and the firewall screen.

## Let updates run automatically

Enable automatic security updates in the installer or right after. A machine that updates itself closes known flaws without a human in the loop, and it is the control attackers count on being skipped.

Check later: `posture.updates_automatic` and `cves.security_updates`.

## The choices that are hard to change

Disk encryption, Secure Boot and the partition layout are install-time decisions. Everything else, the firewall, accounts, sudo and updates, can be fixed later but should not need to be. Getting the hard ones right up front means the easy ones are the only ones left.

## Check it all with IbexWall

After install, the IbexWall Overview screen shows a score and the findings behind it, and System posture lists every check: disk, boot, firewall, accounts, updates and open ports. Each fix is a plan you review first, with the exact files and what could break, and you can undo it from History.
