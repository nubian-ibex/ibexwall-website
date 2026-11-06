---
title: "Why a security tool should send nothing home, and how to check"
description: "A security tool sees your ports, apps and logs, so it should never phone home. See what IbexWall sends, which is nothing, and how to verify it yourself."
slug: "no-telemetry-in-a-security-tool"
date: 2026-11-06
updated: 2026-11-06
tags: [privacy, telemetry, trust]
related_hardening: []
faq:
  - q: "Does IbexWall send any data to its authors?"
    a: "No. There is no telemetry, no analytics and no account. Network traffic only happens when you ask for it, such as a DNS lookup you make or a package update you run."
  - q: "How can I verify that a program sends nothing?"
    a: "Watch its connections with ss or a packet capture while it runs, or apply a firewall rule that blocks its outbound traffic and see that nothing breaks."
---

A security tool reads things that most programs never see: which services listen on your machine, which programs connect where, which accounts exist, what your logs say. If such a tool also reported home, even in a "harmless" anonymous way, it would be a map of your system leaving the building. So the rule is simple: it should send nothing unless you ask. IbexWall follows that rule. It has no telemetry, no analytics, no accounts, and it does not phone home.

## Why it matters more here

Telemetry in an ordinary app tells the authors which button gets clicked. In a security tool, the same channel would carry facts like "this computer has an open SSH port and an old kernel". Data like that is useful to the one person who should not have it. Anonymising it is hard, because machine details are often unique enough to identify you. The simplest safe design is not to collect.

There is also trust. A tool that asks for root, reads system state and applies changes has to earn it. "Nothing leaves the machine" is a claim you can test, which is better than a privacy policy you have to believe.

## What IbexWall sends

Nothing on its own. The cases where network traffic exists are ones you cause:

- A DNS lookup you make. If you use the Secure DNS screen, the resolver forwards your lookups to the upstream you picked, because that is its job.
- A package update you run with your package manager.
- A remote assistant connection, if you enable it. The MCP server only accepts connections over TLS and only when you turn the remote option on.
- Downloads you ask for, such as block lists for the DNS filter.

The known-vulnerabilities check works offline, from the package manager's own cache. Nothing is sent anywhere for it.

## How to verify it yourself

You should not take our word for it, and you do not have to. Here are three ways.

List the connections a program has right now:

```sh
sudo ss -tupn | grep -i ibex
```

Watch the real network interface while you use it (find its name with `ip -br link`):

```sh
sudo tcpdump -ni wlan0 -w ibex.pcap
```

Open the file afterwards with `tcpdump -nr ibex.pcap` or Wireshark and look for destinations you do not recognise. Remember that your other programs also talk, so filter by the time you used IbexWall and by what you did.

The strongest test is a rule. Create a firewall rule that blocks outbound traffic for the program's user or the whole machine, use the tool, and see that it still works. Features that need the network by nature, like an upstream DNS server, will of course stop.

IbexWall's Apps and network screen shows which program talks to where, so it can also report on itself and on everything else on your machine.

## What to ask of any tool

The same questions work for every program you install, security tool or not. Does it need an account? Does it say what it sends and when? Does it keep working with the network blocked? Can you read the source or at least inspect the traffic? Is there an off switch that is honoured? A tool that cannot answer these plainly has told you something.

## Other telemetry on your system

Your distribution and some of your apps may send usage reports. That is a separate matter from the security tool, and you may or may not care. The Telemetry plugin (privacy.telemetry) lists what it finds so you can decide, and it only lists. For the wider habit of checking, see the [ten minute self-check](/articles/how-secure-is-my-linux-computer/).

## What does not go with it

Open source helps here. The code is on GitHub under GPL-3.0-or-later, so anyone can read how network access is used, and releases are planned to carry checksums, signatures, an SBOM and a provenance statement. The first release has not been published yet.

## Check it with IbexWall

Open Apps and network to see each program's connections, and Plugins to read what every plugin is allowed to read and change. Any change is a plan you review, with a snapshot and an undo in History. Version 1.0 is in preparation.
