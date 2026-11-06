---
title: "Privacy"
description: "IbexWall has no telemetry, no account and no analytics. What it stores on your computer, what the resolver records, and how to check that nothing leaves."
updated: 2026-11-06
---

IbexWall does not collect data about you or your computer. There is no telemetry, no account, no analytics and no update check that phones home. This website uses no cookies, no analytics and no third-party requests; its fonts and images are served from the same address as the pages.

## What stays on your computer

- The state of the program (plans, History, the audit log) is in `/var/lib/ibexwall`, and its settings are in `/etc/ibexwall`. They are readable by root only where they should be.
- The audit log is a chain: each line carries the hash of the one before, so a removed or changed line is detected.
- The secure DNS resolver counts lookups and blocks. It never records the names you look up.

## What leaves your computer, and only when you ask

IbexWall uses the network when you tell it to: a DNS lookup you make goes to the resolver you chose, over an encrypted connection; a package update you run goes to your distribution. An AI assistant you connect can read a redacted status, over a connection you set up, with a key you can remove.

## Check it yourself

You do not have to take this on trust. Watch the connections with `ss -tup`, capture the traffic with `tcpdump`, or use the program's own per-program network view to see what each process contacts. The article [No telemetry in a security tool](/articles/no-telemetry-in-a-security-tool/) shows how.

## This website

The pages are static files. There are no cookies, no scripts from other sites and no tracking. Links to other sites, such as GitHub and the documentation, are ordinary links.
