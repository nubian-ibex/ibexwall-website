---
title: "SELinux vs AppArmor for a desktop user: what to know"
description: "Mandatory access control limits a hacked program. See which distributions use SELinux or AppArmor, how to check, and what to do when it blocks something."
slug: "selinux-vs-apparmor-for-a-desktop-user"
date: 2026-11-06
updated: 2026-11-06
tags: [selinux, apparmor, mac]
related_hardening: []
faq:
  - q: "What is the difference between SELinux and AppArmor?"
    a: "Both limit what a program may touch even when it runs with full rights. SELinux labels every file and process and uses a policy over labels. AppArmor writes rules by file path for each program."
  - q: "Should I turn SELinux or AppArmor off when something is blocked?"
    a: "No. Read the denial in the log, then fix the label or put just that one program in a permissive mode. Turning the whole system off removes protection for everything."
---

Normal Linux permissions answer one question: is this user allowed to open this file? Mandatory access control (MAC) adds a second one: is this particular program allowed to, whatever user it runs as? If a browser or a network service is compromised, MAC limits how far the intruder gets. Linux has two common systems for this, SELinux and AppArmor, and you almost certainly have one of them already.

## Which distribution uses which

- Fedora uses SELinux, enforcing by default.
- Ubuntu uses AppArmor, active by default.
- Debian has had AppArmor enabled by default since Debian 10, with its profile set smaller than Ubuntu's.
- Arch Linux enables neither by default. You can add either one, and it takes manual work.

You rarely choose. You use what your distribution maintains, because its policy and profiles are written and tested for that system's packages.

## How they differ

SELinux gives every file, process and port a label and writes a policy about which labels may act on which. It is thorough and fine-grained, and the labels live with the file, so moving or copying a file can leave it with the wrong label. AppArmor attaches a profile to a program and lists the paths and capabilities it may use. It is simpler to read and write, and it follows file names rather than labels. Neither is "more secure" in general. Their strength depends on the policy for each program, and what matters on a desktop is that the one your distribution ships is on.

## See whether it is on

SELinux (Fedora):

```sh
getenforce
sestatus
```

`Enforcing` is what you want. `Permissive` logs problems without stopping them, and `Disabled` is off.

AppArmor (Ubuntu, Debian):

```sh
sudo aa-status
```

It lists how many profiles are loaded and in enforce or complain mode. On Debian you may need the `apparmor` and `apparmor-utils` packages installed and the module enabled at boot; if `aa-status` says it is not loaded, the kernel needs `apparmor=1 security=apparmor` on its command line, and the Debian wiki describes the steps.

## When it blocks something

A program that works as root but fails under MAC, or a service that fails after you moved its data folder, is the typical story. The system is working: it stopped something the policy did not expect. The answer is to read the denial, not to switch protection off.

On SELinux, look for denials:

```sh
sudo ausearch -m AVC,USER_AVC -ts recent
```

On Fedora, the SETroubleshoot tool can explain them in words if its desktop alert or `sealert` is installed. The most common cause is a wrong label on files you moved, which `restorecon -Rv /path` fixes. For a service that must use a non-standard folder, give it the right label with `semanage fcontext` and then `restorecon`. If you need to test whether SELinux is the cause, `sudo setenforce 0` makes it permissive until the next restart, and `sudo setenforce 1` turns it back on. Do not leave it that way.

On AppArmor, denials appear in the kernel log:

```sh
sudo journalctl -k | grep -i 'apparmor="DENIED"'
```

You can put a single profile in complain mode with `sudo aa-complain /path/to/program`, and back with `sudo aa-enforce /path/to/program`. Or you can add a local override in `/etc/apparmor.d/local/` for the specific path the program needs, then reload the profile with `sudo apparmor_parser -r` on its file.

## Do you need to do anything

Mostly no. Keep it on, update your system, and read the log when something fails oddly. Do not disable it as a first step, because that removes a protection for every program in exchange for fixing one. If you run programs from outside the distribution's packages, such as a binary from a vendor's website, expect them to be less confined than packaged ones.

## Check it with IbexWall

IbexWall's own resolver, MCP server and plugins are confined by AppArmor profiles on Debian and Ubuntu and by an SELinux module on Fedora, shipped in separate packages (`ibexwall-apparmor` or `ibexwall-selinux`). The System posture screen reports the state of your system's protection, and you can review what each plugin may read and change on the Plugins screen. Any change is a plan you review and undo from History. Version 1.0 is in preparation.
