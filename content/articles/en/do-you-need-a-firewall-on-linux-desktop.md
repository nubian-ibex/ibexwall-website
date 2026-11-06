---
title: "Do you need a firewall on a Linux desktop? What it does"
description: "A Linux desktop accepts everything by default. See what actually listens, how nftables, ufw and firewalld relate, and inbound versus per-program rules."
slug: "do-you-need-a-firewall-on-linux-desktop"
date: 2026-11-06
updated: 2026-11-06
tags: [firewall, nftables, network]
related_hardening: [net.tcp-syncookies, net.source-routing]
faq:
  - q: "Do I need a firewall on a Linux desktop?"
    a: "If nothing listens for outside connections, a firewall has little to block. It is still worth having as a safety net for services you install later, and on networks you do not trust."
  - q: "Are ufw, firewalld and nftables different firewalls?"
    a: "No. nftables is the packet filter in the kernel. ufw and firewalld are tools that write nftables or iptables rules for you with simpler commands."
---

A Linux desktop does not need a firewall to be usable, and many run without one. But it is a cheap safety net: if a program starts listening on a port later, whether through a package you install, a development server you forget about or a service a distribution enables, a firewall decides whether the network can reach it. The more useful question is what is listening right now.

## Default allow, in plain words

The Linux kernel filters nothing until rules are added. Fedora Workstation ships firewalld enabled. Ubuntu ships ufw but leaves it off. Debian and Arch install no firewall by default. So on a fresh Debian or Arch machine every port that a program opens is reachable from your network.

That is less alarming than it sounds, because a fresh desktop opens very few. Home routers also block unsolicited traffic from the internet. The risk is the local network: a café, a hotel, a shared flat, an office.

## See what listens

```sh
sudo ss -tulpn
```

The columns that matter are the local address and the program. `127.0.0.1` means only this computer can connect. `0.0.0.0` or `[::]` means any machine that can reach you. Typical honest entries on a desktop are the local DNS stub, the mDNS service (Avahi, UDP 5353) and the printer service (CUPS, which normally sits on loopback). Anything you do not recognise deserves a look.

You can also test from outside with `nmap` on another machine, which shows what the network actually sees rather than what the machine thinks it offers.

## nftables, ufw and firewalld

These are three layers, not three rivals.

- nftables is the filtering engine in the kernel, and `nft` is its command.
- ufw ("uncomplicated firewall") is a simple front end, common on Ubuntu. Typical use is `sudo ufw enable` and `sudo ufw allow 22/tcp`.
- firewalld is a front end built around zones such as `public` and `home`, used by Fedora. Typical use is `sudo firewall-cmd --list-all`.

Pick the one your distribution already uses. Running two front ends that both manage rules leads to confusing results. To read whatever is active, `sudo nft list ruleset` always works, because every front end ends up there or in the older iptables layer that now often sits on top of nftables.

## Inbound versus outbound

An inbound rule decides who can start a connection to you. For a desktop the sane default is to refuse unsolicited inbound traffic and allow replies to connections you started. All three tools do that out of the box when enabled.

Outbound filtering is a different job. The classic tools filter by address and port, not by program, so they cannot say "Firefox may connect, this unknown binary may not". Per-program outbound control needs the kernel to tell the filter which process owns a connection, which is what eBPF-based tools do. It is useful for noticing a program that talks to a server you did not expect. It is also more work to live with, because you answer a question the first time each program connects.

## When it matters most

Three situations raise the value of a firewall. You use public or shared networks often. You run development servers, databases or file shares that bind to every address by default, and forget them. Or you share a machine with other people, where one careless install can open a port for everyone. If none of these applies and `ss` shows nothing outside loopback, the firewall is a seatbelt you rarely use. Keeping it on costs very little.

## A reasonable setup

1. Use the front end your distribution ships and turn it on.
2. Keep the default of refusing unsolicited inbound connections.
3. Open a port only when you can name the service and why.
4. Look at `ss -tulpn` again after installing server software.
5. If you want to see outbound behaviour, add per-program monitoring on top rather than hand-writing rules.

On a laptop that moves between networks, zones or profiles help: firewalld's `public` zone is strict, and `home` is looser.

## Check it with IbexWall

The Firewall screen lists inbound rules and works through the firewall your system already uses, and the Apps and network screen shows which program talks to where and asks the first time a program connects. IbexWall keeps its own rules in `table inet ibexwall` and never edits your distribution's. Each change is a plan you review, with a snapshot you can undo from History, and a rule that could cut your connection waits for your confirmation. Version 1.0 is in preparation. For the wider picture, start with the [ten minute self-check](/articles/how-secure-is-my-linux-computer/).
