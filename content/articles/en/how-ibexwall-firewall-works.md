---
title: "How IbexWall's firewall works: nftables plus per-program control"
description: "IbexWall uses two layers: nftables for inbound rules and eBPF to decide which programs may reach the network. How they fit together, and how a change stays reviewable."
slug: "how-ibexwall-firewall-works"
date: 2026-11-06
updated: 2026-11-06
tags: [firewall, eBPF, nftables, per-app]
related_hardening: []
---

A firewall answers two different questions: what may reach this machine from outside, and what may leave it. Most Linux firewalls only answer the first. IbexWall answers both with two layers, and makes each change a plan you review first.

## Layer one: inbound, through the distribution

For inbound traffic, IbexWall does not replace your firewall. On a machine with firewalld or ufw it drives that front-end; on a machine with neither it manages its own `inet ibexwall` nftables table. In both cases it writes only to its own table, never to a table another program owns.

The first thing to enable is default-deny inbound: nothing may listen for new connections unless you opened it. From there, the firewall screen shows what is reachable, what you opened, and lets you close it. A change is a plan that lists the exact rules, and History can put them back.

## Layer two: outbound, per program

The second question, what may leave the machine, is where the real control lives. IbexWall loads a small eBPF program that watches every connection a program tries to open. The first time a new program reaches the network, IbexWall asks: allow, block, or always allow. Your answer is remembered per program, per destination.

This is stronger than a port-based firewall, which only sees ports. A browser and a keylogger both use HTTPS on port 443; the port does not tell them apart. The per-program layer does, and it works over TCP, UDP and QUIC.

## Ask mode and the safety valve

A program you have not decided about can be held in Ask mode: its first connection waits until you answer, and older held connections are shown oldest first. A change that could cut your own network access is marked as risky and waits for your confirmation; if you do not confirm in time, it undoes itself.

## Why this stays reviewable

Every firewall change, inbound or per-program, goes through the same engine as every other change in IbexWall: a plan shows the operations, a snapshot is taken, and History can roll the change back. A firewall is only as good as the confidence you have in it, and confidence comes from being able to see and undo every rule.
