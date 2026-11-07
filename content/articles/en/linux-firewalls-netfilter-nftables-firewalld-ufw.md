---
title: "Linux firewalls: netfilter, nftables, firewalld and ufw"
description: "Every Linux firewall sits on the same kernel framework, netfilter. What iptables, nftables, firewalld and ufw are, how their interfaces differ, and what they share."
slug: "linux-firewalls-netfilter-nftables-firewalld-ufw"
date: 2026-11-06
updated: 2026-11-06
tags: [firewall, netfilter, nftables, firewalld, ufw]
related_hardening: []
---

Ask which firewall Linux uses and the answer changes by distribution: firewalld on Fedora, ufw on Ubuntu, raw nftables elsewhere. Underneath, they are all the same thing. This article separates the layers.

## The common ground: netfilter

Netfilter is the packet filtering framework inside the Linux kernel. Every firewall on Linux is a front-end that writes rules into netfilter. That is the single point they all share: whatever tool you use, the decision happens in the same kernel hooks, for every packet that passes through.

## The command layer

- iptables is the old userspace tool. It predates the current framework and is now in maintenance mode on most distributions.
- nftables is its modern replacement. It merges what used to be several tools (IPv4, IPv6, ARP, bridging) into one, with one `nft` command and one rule syntax.

Most people do not write iptables or nftables rules by hand. They use a front-end, which is where the interfaces diverge.

## The front-ends and their interfaces

- firewalld is the daemon on Fedora, RHEL and openSUSE. It thinks in zones (home, public, work) and services, and it applies changes at runtime without flushing existing connections. Its interfaces are `firewall-cmd` on the command line and the graphical `firewall-config`.
- ufw, the Uncomplicated Firewall, is the Debian and Ubuntu default. It is a thin layer over iptables or nftables with a much simpler syntax: `ufw allow 22/tcp`, `ufw enable`. Its GUI is `gufw`.
- Raw nftables is the choice on Arch and in containers, where a distribution does not impose a front-end and the administrator writes the table directly.

So the "different firewalls" are mostly different interfaces over one engine. The confusion is real because the syntax, the config files and the mental model differ, but the security property, a packet is allowed or dropped by a netfilter rule, is identical.

## What the UIs have in common

Every firewall UI, graphical or not, answers the same three questions: what is allowed in, what is allowed out, and is it on. firewalld asks by zone and service; ufw asks as a list of allow rules; a raw nftables table asks as chains of rules. They all also share the same failure mode: a rule mistake can lock you out of a remote machine, because the firewall does exactly what it was told.

## What IbexWall adds

IbexWall works through whatever is there. On a machine with firewalld or ufw it drives that front-end and leaves the distribution's own rules alone; on a machine with neither it manages its own `inet ibexwall` nftables table. Either way it only ever writes to its own table, never to a table another program owns.

Two things change for the person:

- Review before apply. You see the exact rules a change will add, what they will affect, and what could break, before anything is written. A change that could cut your network waits for your confirmation.
- Per-program control. On top of the firewall, IbexWall uses eBPF to decide which programs may reach the network, and asks the first time a new one tries.

The firewall stays the same netfilter it always was. What IbexWall changes is that it becomes a plan you review and can undo, instead of a command you run and hope.
