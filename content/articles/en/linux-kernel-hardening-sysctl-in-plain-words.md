---
title: "Linux kernel hardening with sysctl, in plain words"
description: "What sysctl hardening is, which settings are safe to start with, which ones can break Flatpak, VPNs or IPv6, and how to apply and undo them cleanly."
slug: "linux-kernel-hardening-sysctl-in-plain-words"
date: 2026-11-06
updated: 2026-11-06
tags: [sysctl, kernel, hardening]
related_hardening: [kernel.kptr-restrict, kernel.dmesg-restrict, net.tcp-syncookies, kernel.user-namespaces]
faq:
  - q: "What is sysctl hardening?"
    a: "The kernel has settings you can change while it runs. Hardening means choosing stricter values, such as hiding kernel addresses from ordinary programs, so a flaw is harder to exploit."
  - q: "How do I undo a sysctl change?"
    a: "Delete the file you created in /etc/sysctl.d, then set the old value with sysctl -w or restart. Check the old value first and write it down."
---

Sysctl is the list of settings the running Linux kernel lets you change without recompiling it. Hardening with sysctl means picking stricter values for the ones that affect security. Each setting is small, and most are safe. A few can break software you use, so the sensible approach is to start with the harmless ones and test the rest one at a time.

## How it works

Read a value:

```sh
sysctl kernel.kptr_restrict
```

Change it until the next restart:

```sh
sudo sysctl -w kernel.kptr_restrict=2
```

Keep it across restarts by putting it in a file under `/etc/sysctl.d/`, whose files end in `.conf` and are read in name order:

```sh
echo 'kernel.kptr_restrict = 2' | sudo tee /etc/sysctl.d/90-example.conf
sudo sysctl --system
```

This works the same on Fedora, Ubuntu, Debian and Arch. Do not edit the files your distribution ships; add your own, so an update does not overwrite your work and you can remove it later. Because files are read in order, a later name wins when two set the same key.

## Safe ones to start with

These change little for a desktop and have a clear benefit.

- [`kernel.kptr_restrict`](/hardening/kernel.kptr-restrict/) hides kernel memory addresses from ordinary programs. Attackers use those addresses to aim an exploit.
- [`kernel.dmesg_restrict`](/hardening/kernel.dmesg-restrict/) lets only an administrator read the kernel log, which can show addresses and hardware details.
- [`net.ipv4.tcp_syncookies`](/hardening/net.tcp-syncookies/) keeps the machine answering when someone floods it with half-open connections. Many distributions already set it to 1.
- `fs.protected_symlinks`, `fs.protected_hardlinks`, `fs.protected_fifos` and `fs.protected_regular` block old tricks where an attacker plants a link or file in a shared folder like `/tmp` so a privileged program writes where they want. The catalog groups them as [protect shared folders](/hardening/fs.protected-files/).

Some are probably set already on your system. Reading the value first tells you.

## The ones that can break things

A stricter value can remove something that a program needs. Known cases:

- [`user.max_user_namespaces=0`](/hardening/kernel.user-namespaces/) removes a large part of the kernel's attack surface, and it also stops Flatpak, the Chromium and Firefox sandboxes, rootless containers and many AppImages from working. For most desktops this is too costly.
- `kernel.yama.ptrace_scope` raised to a stricter level means a debugger like `gdb` or `strace` cannot attach to a running program without extra rights. Developers notice quickly.
- `kernel.perf_event_paranoid` set high stops unprivileged profiling with `perf`.
- `net.ipv4.conf.all.rp_filter=1` drops packets that arrive on an interface the kernel would not use to reply. That can break some VPNs and machines with several network routes.
- Ignoring IPv6 router advertisements can leave IPv6 without an address on most home networks.
- `kernel.sysrq=0` removes the emergency keys for a frozen machine.
- Locking kexec cannot be undone until the next restart, and it affects crash dump tools.

The rule is simple: change one, use the computer for a day, and keep the rest for later.

## How to test a change

After each change, use the machine as you normally do. Open your browser, start a Flatpak app if you use them, connect to your VPN, plug in a device, build something. If you work remotely, keep a second session open. Problems from sysctl changes tend to show up as one program failing with a "permission denied" or "operation not permitted" error that has no obvious cause, so when that happens right after a change, suspect the change first. Changing one value at a time makes the culprit obvious, and it makes the undo a single line.

## Apply and undo

Note the current values before you change anything:

```sh
sysctl kernel.kptr_restrict kernel.dmesg_restrict
```

To undo a persistent change, remove the file and put the old value back, since deleting the file alone does not change the running kernel:

```sh
sudo rm /etc/sysctl.d/90-example.conf
sudo sysctl -w kernel.kptr_restrict=0
```

A restart also returns to whatever the remaining files and the kernel default say. If a setting stops something working and you do not know which, bisect: remove half of your file, run `sudo sysctl --system`, and test.

## Check it with IbexWall

The Hardening screen lists 26 kernel, network, filesystem and module settings, each with what it can break, and you tick the ones you want. The Kernel hardening plugin (system.sysctl) reads each value, compares it with the reference and applies your choice through a plan. The plan shows the exact file, which IbexWall writes as `/etc/sysctl.d/90-ibexwall.conf`, and the diff before anything happens. A snapshot is taken first, and History undoes it. Version 1.0 is in preparation.
