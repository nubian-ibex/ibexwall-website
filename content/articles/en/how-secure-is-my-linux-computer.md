---
title: "How secure is my Linux computer? A 10 minute self-check"
description: "Check updates, disk encryption, firewall, Secure Boot, open ports, SSH, users and backups in about ten minutes, and learn what a security score means."
slug: "how-secure-is-my-linux-computer"
date: 2026-11-06
updated: 2026-11-06
tags: [checklist, basics, posture]
related_hardening: [mounts.tmp-noexec, fs.protected-files]
faq:
  - q: "How can I quickly check how secure my Linux computer is?"
    a: "Look at eight things: pending updates, disk encryption, firewall state, Secure Boot, listening ports, the SSH server, user accounts and backups. Each takes a minute or two with a single command."
  - q: "Does a high security score mean my computer is safe?"
    a: "No. A score counts the settings that were checked. It cannot see weak passwords, a phishing page you clicked, or software you installed on purpose."
---

Your Linux computer is probably in decent shape if it installs updates, has an encrypted disk, runs a firewall you can explain, and offers nothing to the network that you did not choose. You can check all of that in about ten minutes with the commands below. Where a command differs between distributions, the text says which.

## The eight checks

### 1. Updates

Most successful attacks use a flaw that already has a fix. See whether fixes are waiting:

```sh
# Fedora
sudo dnf check-upgrade
# Ubuntu and Debian
sudo apt update && apt list --upgradable
# Arch
checkupdates   # from the pacman-contrib package
```

If the list is long, update now. Then see whether security updates install themselves: Ubuntu and Debian use `unattended-upgrades`, Fedora uses `dnf-automatic` (dnf5 has its own automatic plugin), and Arch has no such tool because it is a rolling release that you update by hand.

### 2. Disk encryption

If someone takes your laptop, an unencrypted disk can be read by plugging it into another machine. Look at the layout:

```sh
lsblk -f
```

A `crypto_LUKS` line above your root file system means the disk is encrypted. Our article on [LUKS and TPM2](/articles/disk-encryption-on-linux-luks-and-tpm2/) covers what that does and does not protect.

### 3. Firewall

Check which one your system runs:

```sh
sudo nft list ruleset | head -40
sudo ufw status            # Ubuntu, if ufw is installed
sudo firewall-cmd --state  # Fedora, if firewalld is installed
```

Empty output from the first command and "inactive" from the others mean no filtering at all. Whether you need one is the subject of [another article](/articles/do-you-need-a-firewall-on-linux-desktop/).

### 4. Secure Boot

```sh
mokutil --sb-state
```

"SecureBoot enabled" means the firmware only starts signed boot software. The command is in the `mokutil` package on all four families. See [Is Secure Boot worth it on Linux](/articles/is-secure-boot-worth-it-on-linux/) for the limits.

### 5. Open ports

A port is a door a program holds open. List the ones waiting for connections:

```sh
sudo ss -tulpn
```

Anything listening on `127.0.0.1` or `::1` is only reachable from your own machine. Lines with `0.0.0.0`, `[::]` or `*` accept connections from the network. For each one, ask whether you know the program and want it there. If not, stop its service.

### 6. SSH

If you never log in to this computer from elsewhere, the SSH server should not run:

```sh
systemctl is-active sshd   # Fedora, Arch
systemctl is-active ssh    # Debian, Ubuntu
```

If you do use it, check the effective settings with `sudo sshd -T | grep -E 'permitrootlogin|passwordauthentication'`. Root login should be `no`, and keys are better than passwords.

### 7. Users

```sh
getent group sudo wheel
sudo awk -F: '$2 == "" {print $1}' /etc/shadow
```

The first lists who can become administrator (the group is `sudo` on Debian and Ubuntu, `wheel` on Fedora and Arch). The second prints accounts with an empty password field, and it should print nothing.

### 8. Backups

No command can tell you that your backup works. Open the most recent one and restore a single file to a scratch folder. If that fails, you found your most important problem. Ransomware, a failing disk and a mistyped `rm` all end at the same place.

## Where to start when the list is long

Do not try to fix everything in one evening. Update first, because it costs nothing and closes known flaws. Then deal with anything listening on the network that you do not recognise, then SSH and accounts. Disk encryption and Secure Boot usually need a reinstall or a visit to the firmware settings, so plan them for a weekend. Set up backups before any of the risky changes, not after.

## What a score means

A score out of 100 is a summary of settings that a program was able to read: is the firewall on, is the disk encrypted, are there pending updates. It is good for finding gaps and for seeing progress after you change something. It is not a verdict. It does not know that your password is `hunter2`, that you reuse it, or that you ran a script from a forum. Treat a low number as a to-do list and a high number as "the basics are covered", not "nothing can happen".

## Check it with IbexWall

The Overview screen of IbexWall shows a score and a list of what to fix, and System posture lists every check behind it (boot, disk, firewall, accounts, updates, open ports). Each fix is a plan you review first, with the exact files and what could break, and you can undo it from History. Version 1.0 is in preparation, so there is no download yet; see the docs at docs.ibexwall.com for progress.
