---
title: "Get IbexWall"
description: "IbexWall 1.0 is in preparation. See how releases will be published and signed, how to check a download, and how to build from source today."
updated: 2026-11-06
---

IbexWall 1.0 is not released yet. This page says what a release will contain, how to check it, and how to build the program yourself in the meantime.

## What a release contains

Each release is a set of files on the [GitHub releases page](https://github.com/nubian-ibex/ibexwall/releases):

- packages for Fedora (RPM), Ubuntu and Debian (DEB) and Arch Linux;
- the source code at the tagged commit;
- checksums, a signature for every file, a software bill of materials and a provenance statement describing how the files were built.

The packages are split so you install only what you need: `ibexwall` (the daemon, the command line and the plugins), `ibexwall-desktop` (the window, the tray icon and the session agent), `ibexwall-mcp` (the server for AI assistants), and one confinement package for your system: `ibexwall-apparmor` on Debian and Ubuntu, `ibexwall-selinux` on Fedora.

## Supported systems

Fedora, Ubuntu 24.04 and 26.04, Debian and Arch Linux. Every release is installed, used, upgraded, removed and purged in a virtual machine for each of them before it is published.

## Check what you downloaded

Download the files of the release into one folder and check the signature of the list of checksums, then every checksum, then every signature:

```sh
git clone https://github.com/nubian-ibex/ibexwall
cd ibexwall
cargo xtask verify-release /path/to/the/folder /path/to/the/folder/ibexwall-release.pub
```

The files use the minisign format, so `minisign -V` works on a single file too. The public key is also published on the [security page](/security/); compare the two before you trust a signature. The [release guide](https://docs.ibexwall.com/reference/release-verification/) explains each file.

## Build from source

You need the Rust toolchain named in `rust-toolchain.toml`, and for the window the Node.js tooling and the WebKitGTK development packages.

```sh
git clone https://github.com/nubian-ibex/ibexwall
cd ibexwall
cargo build --release --workspace
```

Try it without changing your system: `scripts/dev-sandbox.sh` starts the daemon and the window in a sandbox that never touches your files, services or firewall. The developer guide is at [docs.ibexwall.com](https://docs.ibexwall.com/contributing/).

## What the install does

Installing creates the system users and directories, switches on the sockets that start the daemon and the plugins when needed, and starts them. It applies no security change: every change is still a plan that you review. Removing the packages undoes what IbexWall changed through each change's snapshot and keeps your data until you purge.
