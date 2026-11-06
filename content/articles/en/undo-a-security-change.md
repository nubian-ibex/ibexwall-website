---
title: "How to undo a security change on Linux, and recover a lockout"
description: "Take a snapshot before every change, roll back from History, see why network changes wait for confirmation, and recover when a rule locked you out."
slug: "undo-a-security-change"
date: 2026-11-06
updated: 2026-11-06
tags: [rollback, recovery, safety]
related_hardening: [kernel.kexec, net.rp-filter]
faq:
  - q: "How do I undo a firewall or DNS change that broke my network?"
    a: "From a local terminal or console, list recent changes and roll the last one back. If you made it with IbexWall and did not confirm it in time, it rolls back by itself."
  - q: "What if I am locked out of a remote machine?"
    a: "A change that could cut the network waits for confirmation and reverts if you do not confirm. For other tools, use the provider console, or a recovery boot, to remove the rule."
---

The best protection against a bad change is to be able to take it back. Before you edit a firewall, a DNS setting or a kernel parameter, save what is there now, change one thing, test it, and keep a way back that does not depend on the thing you are changing. This article covers the habit, and how IbexWall does it for you.

## Why a snapshot comes first

Most security changes are small edits to files: a line in `/etc/sysctl.d`, a drop-in for SSH, a nftables ruleset. If you copy the old file first, undoing is a copy back. When the change touches several things at once, a mistake in one makes it hard to remember what the others were.

By hand, the minimum is:

```sh
sudo cp -a /etc/ssh/sshd_config.d /root/sshd_config.d.bak
```

Edit, test, and only then close your old session. For firewall changes, the safe order is to open a second terminal, apply the rule, check you can still connect with a new connection, and keep the first terminal open until you have.

## Changes that can cut you off

Some changes take away the way you reached the machine: a firewall rule that blocks the SSH port, a DNS setting that points at a resolver you cannot reach, a VPN kill switch, a rule that isolates the host. The danger is not the change, it is that you cannot fix it from where you are.

IbexWall treats these differently. A change flagged as a network risk waits for you to confirm it, by default within 60 seconds. If you do not confirm, because you lost the connection or the page stopped answering, it rolls itself back. That is the point: the undo does not need you. If the daemon itself stops partway through, then when it starts again it reverts a change that was applying or waiting for confirmation.

You confirm from the interface, or on the command line:

```sh
ibexctl confirm <transaction-id>
```

## Undo from History

Every change IbexWall applies takes a snapshot first. The History screen lists them all, and undoing one restores what was there. The same from a terminal:

```sh
ibexctl history
ibexctl rollback <transaction-id>
```

Some changes are not fully reversible, and IbexWall says so before you apply them. For instance, [forbidding another kernel from being loaded](/hardening/kernel.kexec/) cannot be undone until the next restart. Others can break a particular setup, like [dropping packets with a forged sender address](/hardening/net.rp-filter/), which may not suit some VPNs and machines with several routes. The plan shows these warnings first.

## Recovering when you are locked out

If you used other tools, or the automatic revert did not help, work from the nearest place where you still have control.

1. Local machine: switch to a text console with Ctrl+Alt+F3, or use the desktop with the network off. You do not need the network to run a local command.
2. Virtual server: use the provider's web console, which does not go through the network you broke.
3. Remove the cause. For IbexWall's firewall rules, `ibexctl rollback` is the way. As a last resort, its table can be deleted, because it is a separate table that holds only its own rules: `sudo nft delete table inet ibexwall`. Do not delete tables you did not create.
4. For a sysctl file, remove it from `/etc/sysctl.d/` and set the old value with `sysctl -w`.
5. If nothing starts, boot a live system or the recovery entry, mount the root file system, and restore your copy of the file.

Afterwards, find out why it failed before you try again. Often it was one unexpected detail, like a second network interface.

## Keep a record

A rule of thumb that works for people and for tools: write down what you changed, why, and how to reverse it. IbexWall's History holds that, and every entry is written to an audit log whose lines are chained so that edits to old lines can be detected (`ibexctl audit verify`).

## Check it with IbexWall

The History screen lists changes and undoes them, and `ibexctl history` and `ibexctl rollback` do the same from a terminal. Every change is a plan you review first, with a snapshot you can restore, and network-risk changes wait for your confirmation or return by themselves. Emergency mode (endpoint.isolate), which cuts the network except for addresses you name, is also undone from History. Version 1.0 is in preparation.
