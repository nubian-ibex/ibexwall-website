---
title: "About IbexWall"
description: "IbexWall is a free and open source security center for Linux, built by the Nubian Ibex project. License, how it is built, and how to take part."
updated: 2026-11-06
---

IbexWall is a free and open source security center for Linux desktops, published under the GPL-3.0-or-later license by the Nubian Ibex project. It exists because checking a Linux computer, understanding the result and fixing it safely should not need a day of reading.

## Principles

- Show first, change second: every change is a plan you review and can undo.
- Say it plainly: each check and each setting is explained in words a non-expert can follow, and says what it can break.
- Keep it yours: no telemetry, no account, no lock-in. The data is on your computer and the code is open.
- Stay in your lane: IbexWall changes only its own files and leaves your distribution's alone.

## How it is built

The daemon, the command line, the secure DNS resolver and the assistant server are written in Rust. Network control per program uses eBPF, the firewall is nftables, and the pieces talk to each other over varlink, with polkit deciding who may do what. The window is a Svelte 5 interface inside Tauri 2. Plugins are one signed binary, started by systemd for each plugin in its own sandbox.

## Take part

- Read the [documentation](https://docs.ibexwall.com) and the [source](https://github.com/nubian-ibex/ibexwall).
- Translate: the app and this website are in English, Portuguese, Spanish, French and German, and adding a language needs no code. The [translation guide](https://docs.ibexwall.com/contributing/translating/) says how.
- Review a hardening setting: each page lists its sources. If something is wrong or out of date, open an issue.

## Languages

The program and this site follow your system language. Each page has a language switcher; a page that is not translated yet shows the English text and says so.
