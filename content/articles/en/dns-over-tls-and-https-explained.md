---
title: "DNS over TLS and DNS over HTTPS explained, and how to check"
description: "Plain DNS shows every site you visit to your network. See what DoT and DoH change, how to pick a resolver, the captive portal catch and how to test yours."
slug: "dns-over-tls-and-https-explained"
date: 2026-11-06
updated: 2026-11-06
tags: [dns, privacy, encryption]
related_hardening: []
faq:
  - q: "What is the difference between DNS over TLS and DNS over HTTPS?"
    a: "Both encrypt the lookup. DoT uses its own port, 853, so a network can see that you use it. DoH travels on port 443 like ordinary web traffic, which makes it harder to tell apart or to block."
  - q: "Does encrypted DNS hide the sites I visit?"
    a: "It hides the lookup from your network, but not from the resolver you chose, and the connection to the site still shows its address and often its name."
---

Every time you open a site, your computer first asks a DNS resolver for its address. By default that question travels as plain text on port 53, so your Wi-Fi owner, your internet provider and anyone on the path can read which names you look up and can alter the answers. DNS over TLS (DoT) and DNS over HTTPS (DoH) wrap the same question in encryption.

## What plain DNS gives away

A lookup for `example.org` tells the listener that you are about to visit `example.org`, even though the page itself may be encrypted. A hostile network can also answer with a false address, which is how some captive pages and some attacks redirect you. Encryption fixes the listening and, because the resolver is authenticated by its certificate, the tampering on the path.

It does not make you anonymous. The resolver you choose sees every name you ask for, so you move trust from your network to that company. And when you connect to the site, its address is visible, and the name often is too.

## DoT versus DoH

- DoT sends DNS messages inside TLS on TCP port 853. It is simple, and a network operator can see that you use it and can block the port.
- DoH sends DNS messages as HTTPS requests on port 443. It blends with web traffic, so it is harder to block, and some browsers ship their own DoH client that bypasses the system resolver.

For a whole system, DoT is usually the easier choice because a resolver service can use it for every program. DoH inside one browser protects only that browser, and it can skip a local blocklist or split-DNS setup you rely on.

## Choosing a resolver

Well-known public resolvers with encrypted endpoints include Cloudflare (`1.1.1.1`, name `one.one.one.one`) and Quad9 (`9.9.9.9`, name `dns.quad9.net`). Quad9 filters known malicious domains by default; Cloudflare's plain service does not. Their documentation describes their logging and privacy policies, and you should read it before deciding. Your provider's resolver is another option, with the trade-off that it is the party you were trying to avoid. A resolver you run yourself gives the most control and the most upkeep.

## Turn it on with systemd-resolved

Fedora and Ubuntu use systemd-resolved by default. Debian and Arch have it available but not necessarily active. If it is yours, create a drop-in:

```ini
# /etc/systemd/resolved.conf.d/dot.conf
[Resolve]
DNS=9.9.9.9#dns.quad9.net 149.112.112.112#dns.quad9.net
DNSOverTLS=yes
```

Then run `sudo systemctl restart systemd-resolved`. With `DNSOverTLS=yes` lookups fail when the server cannot be reached over TLS. The value `opportunistic` tries TLS and falls back to plain DNS, which keeps you online but lets an attacker force the downgrade.

## The captive portal catch

Hotel and café Wi-Fi often intercept your first web request to show a login page. Strict encrypted DNS can break that, because the portal expects to answer plain lookups before you sign in. Typical symptoms: connected to Wi-Fi, no page opens. Common ways out are to sign in with `opportunistic` mode, to open the portal's address directly, or to turn strict mode off for that session and back on after.

## Check what yours does

```sh
resolvectl status
```

Look for `DNS Servers` and for `+DNSOverTLS` in the protocol line of the interface or global section. To see whether plain DNS still leaves the machine, watch port 53 on your real network interface (find its name with `ip -br link`, for example `wlan0` or `enp3s0`) while you browse:

```sh
sudo tcpdump -ni wlan0 port 53
```

Do not use `-i any`: programs talk to the local stub resolver on the loopback interface, and that traffic would show up and look like a leak. Silence on the real interface while pages load means lookups are not going out in the clear. You can also run `resolvectl query example.org` and check which server answered. If you use a VPN, its DNS settings may override yours for some names, so test with it on and off.

## Check it with IbexWall

The Secure DNS screen, backed by the net.dns plugin, encrypts lookups, blocks trackers and malware domains, and keeps browsers from bypassing it. It recognises an existing dnscrypt-proxy rather than fighting it. Changes are a plan you review and undo from History, and a DNS change that could leave you offline waits for your confirmation. Version 1.0 is in preparation. If a captive portal gets in the way, IbexWall can tell you that it detected one, but you still sign in yourself.
