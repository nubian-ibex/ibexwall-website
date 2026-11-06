---
title: "Disk encryption on Linux: LUKS, TPM2 unlock, swap and sleep"
description: "What LUKS disk encryption protects against, how LUKS2 and TPM2 auto-unlock trade convenience for safety, the swap and hibernation gap, and how to check."
slug: "disk-encryption-on-linux-luks-and-tpm2"
date: 2026-11-06
updated: 2026-11-06
tags: [encryption, luks, tpm2]
related_hardening: []
faq:
  - q: "What does LUKS disk encryption protect against?"
    a: "It protects data at rest. If your laptop is lost, stolen or powered off and taken apart, the disk contents are unreadable without the passphrase or key."
  - q: "Is TPM2 auto-unlock as safe as typing a passphrase?"
    a: "It trades some safety for convenience. The disk opens without a passphrase when the boot chain matches, so someone who gets the powered-off machine in that state gets further. Adding a PIN narrows that."
---

Disk encryption protects your files when someone has the computer but not you. On Linux that is done with LUKS, a standard format that sits under the file system. You enter a passphrase at start-up, the disk unlocks, and the system runs as normal. It is the single most useful protection for a laptop that might be lost.

## What it protects, and what it does not

Protects against:

- A lost or stolen laptop or drive.
- Someone who removes the disk and reads it elsewhere.
- Data left on a disk you recycle or sell.

Does not protect against:

- Malware that runs while you are logged in. The disk is already unlocked then.
- Someone who gets your passphrase.
- A running machine seized while unlocked, or a hostile person with access to the machine and time to tamper with the unencrypted boot partition.

This is why it pairs with [Secure Boot](/articles/is-secure-boot-worth-it-on-linux/): one covers the stored data, the other the start-up code.

## LUKS2

LUKS has two versions. LUKS2 is the one current installers create. It stores more metadata, uses the Argon2id key derivation function, which is deliberately costly to guess against, and lets several key slots exist at once, so a passphrase, a recovery key and a TPM2 token can each unlock the same disk.

Check what you have:

```sh
lsblk -f
sudo cryptsetup luksDump /dev/nvme0n1p3
```

Replace the device with the one `lsblk` shows as `crypto_LUKS`. Look for `Version: 2` and the key slots. Older installs may be LUKS1; converting is possible but needs a backup first, so read `man cryptsetup` before attempting it.

## TPM2 unlock

A TPM2 is a chip in most modern computers that can keep a secret and only release it when the machine's measured state matches. With `systemd-cryptenroll` you can seal a disk key to it, so the machine starts without asking for the passphrase:

```sh
sudo systemd-cryptenroll --tpm2-device=auto --tpm2-pcrs=7 /dev/nvme0n1p3
```

PCR 7 reflects the Secure Boot configuration. Your initramfs must be able to use the TPM2 (it needs systemd-based unlocking), and the crypttab entry needs the option `tpm2-device=auto`. The exact steps differ between distributions, so follow your own distribution documentation.

The trade-off is real. The disk opens by itself for anyone who powers on the machine in the expected state, so the password prompt moves to the login screen. A weak user password then guards the data. Adding a PIN with `--tpm2-with-pin=yes` brings back a secret you type. Keep the original passphrase or a recovery key somewhere safe: a firmware update or a changed boot configuration can alter the measurements and the TPM will stop releasing the key.

## Swap and hibernation

Memory can reach the disk in two ways, and both can leak keys and documents if left unprotected.

- Swap space. If it is a plain partition, anything swapped out is readable. Put swap inside the encrypted volume, or use zram, which keeps swapped pages in memory.
- Hibernation. The whole memory image is written to swap and read back at resume, including the disk key. Hibernation is only as safe as the swap it uses, so swap must be on the encrypted volume, and the resume setting must be configured by you or the installer.

Many default installs of Fedora and Ubuntu place swap on encrypted storage or in zram, but "many" is not "yours". Check:

```sh
swapon --show
```

If a device is listed, confirm in `lsblk -f` that it sits under a `crypto_LUKS` parent.

## Core dumps

When a program crashes, the system may write its memory to disk, and that memory can hold passwords or keys. Even on an encrypted disk, those files are readable once you are logged in, so storing them only where you want them is a good habit.

## How to start

If your disk is not encrypted, the clean fix is a reinstall with encryption chosen in the installer. Encrypting in place is possible with tools such as `cryptsetup-reencrypt` but is risky; take a full backup first.

## Check it with IbexWall

System posture reports whether the disk is encrypted, and the Core dumps check (system.coredump) can turn crash dump storage off through a plan. IbexWall does not encrypt a disk for you or change LUKS keys; it points out the gap. Every change it does make is a plan you review, with a snapshot you can undo from History. Version 1.0 is in preparation.
