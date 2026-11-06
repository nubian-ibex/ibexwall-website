---
title: "Is Secure Boot worth it on Linux? What it covers and misses"
description: "Secure Boot checks that the code starting your computer is signed. See what it protects, what it does not, how shim and MOK work, and how to check yours."
slug: "is-secure-boot-worth-it-on-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [secure-boot, boot, firmware]
related_hardening: [kernel.kexec]
faq:
  - q: "Is Secure Boot worth enabling on Linux?"
    a: "Yes for most people. It stops unsigned boot code from running at start-up and lets the kernel turn on lockdown. It does not protect files once the system is running or a stolen, unencrypted disk."
  - q: "How do I check if Secure Boot is on?"
    a: "Run mokutil --sb-state. It prints SecureBoot enabled or disabled."
---

For most desktop users, yes: Secure Boot is worth turning on, and the main Linux distributions work with it. It closes one specific door, which is unsigned code running before your operating system starts. It does not make the running system safe, and it does not protect data on a disk that is not encrypted.

## What it does

When the computer starts, UEFI firmware can refuse to run anything whose signature it does not trust. With Secure Boot on, the firmware checks the boot loader, the boot loader checks the kernel, and the kernel can check the modules it loads. A tool that plants itself in the boot chain (a bootkit) has to be signed by a key the firmware trusts, or it does not run.

Another effect matters more day to day. When Secure Boot is on, the kernel can start in lockdown mode, which closes ways for root to change the running kernel, such as writing to kernel memory or loading unsigned modules.

## What it does not do

- It does not protect against malware that runs as you after the system has started.
- It does not encrypt anything. Someone with your laptop can still read an unencrypted disk. See [disk encryption with LUKS and TPM2](/articles/disk-encryption-on-linux-luks-and-tpm2/).
- It does not check your own files, scripts or the contents of your home folder.
- It depends on the firmware. A signed boot chain with outdated, vulnerable firmware or an old revoked boot loader is only as strong as the weakest part.
- It trusts the keys in your firmware, including the one that signs the common boot component, shim.

## Shim and MOK

Most firmware trusts a Microsoft key. Linux distributions cannot get every kernel signed by it, so they ship a small signed program called shim. The firmware trusts shim, and shim trusts the distribution's own key and a list the owner controls called MOK (Machine Owner Key).

MOK is how you run third-party kernel modules, such as some graphics or virtualisation drivers, with Secure Boot on. You sign the module (or let your distribution's tool do it), enroll the key with `mokutil --import`, reboot, and confirm the enrollment in the blue screen shown at start-up using the password you chose. Nothing is enrolled without you at the console, and that is the point.

If a module will not load and the log mentions "required key not available", it is unsigned for this key chain.

## Lockdown

Check which mode the kernel is in:

```sh
cat /sys/kernel/security/lockdown
```

The active mode is in brackets: `[none]`, `[integrity]` or `[confidentiality]`. Integrity blocks things that would let root modify the kernel. Confidentiality also blocks reading kernel secrets. Many distribution kernels select integrity when Secure Boot is on, but check yours rather than assume. Lockdown is the reason some old tools, including raw access to memory, stop working with Secure Boot enabled.

## How to check

```sh
mokutil --sb-state
```

Install `mokutil` first if the command is missing. On systemd systems, `bootctl status` also prints the Secure Boot state and shows the firmware setup. Where the machine has no UEFI (old BIOS or some virtual machines), neither will show a result and there is nothing to enable.

To turn it on, open the firmware setup (usually Del, F2 or F10 during start-up) and enable Secure Boot. On Arch Linux and some other setups you must first sign your own boot loader or use a tool such as `sbctl`, because the install does not ship signed binaries; follow the Arch Wiki's Secure Boot page rather than guessing the order of steps.

## Is it worth the effort

Where your distribution handles signing, the cost is one setting and an occasional key enrollment, and you gain protection against a class of persistent attacks and the lockdown mode. If you build custom kernels or rely on unsigned modules, the work is larger and the gain smaller. Disk encryption and updates deserve attention first.

## Check it with IbexWall

The System posture screen covers boot, disk, firewall and accounts, and the kernel hardening settings in the catalog explain what each change affects, such as the one that [forbids loading another kernel while running](/hardening/kernel.kexec/). IbexWall reads the state and tells you what to fix. Changes in it are plans you review and can undo from History. Version 1.0 is in preparation.
