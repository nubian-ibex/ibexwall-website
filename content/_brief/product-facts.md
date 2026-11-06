# IbexWall product facts (the one source for site, docs and articles)

Write only what is on this page or in the files named in your task. If a
claim is not here, do not invent it: leave it out or flag it in your reply.

## What it is

IbexWall is a free and open source (GPL-3.0-or-later) security center for Linux
desktops. It shows how secure a computer is (a score out of 100 and a list of
checks), explains in plain words what to fix, and fixes it with changes the
person reviews first and can undo. Org on GitHub: nubian-ibex. Site:
https://ibexwall.com. Docs: https://docs.ibexwall.com. Source:
https://github.com/nubian-ibex/ibexwall.

Status: version 1.0 is being prepared; there is no public release yet. Do not
say the packages are in COPR, a PPA, OBS or the AUR: they are planned. Say
"packages for each release" and point to the GitHub releases page and the docs.

## The promises

- Nothing is changed without a plan the person sees: the exact files, units,
  firewall rules, a preview of the diff, and what could break.
- Every change takes a snapshot first and can be undone from History. Changes
  that could cut the network wait for a confirmation and roll back by
  themselves if the person does not confirm in time.
- Plugins propose, the core executes. A plugin reads the system and describes
  a change; only the core (the daemon, as root) applies it, through the same
  plan, snapshot, approval and rollback.
- IbexWall only touches its own artifacts: its own nftables table
  (`table inet ibexwall`), drop-in files with `ibexwall` in the name. It never
  edits the distribution's files or another program's tables.
- Zero telemetry. Nothing leaves the machine unless the person asks for it
  (for example, a DNS lookup they make, or a package update they run). No
  accounts, no analytics, no phoning home.
- Everything is signed: plugin manifests are verified against the release key
  the daemon was built with; releases carry checksums, signatures, an SBOM and
  a provenance statement.
- The interface is available in English, Portuguese (Brazil), Spanish, French
  and German, follows the system language, and adding a language needs no code.

## What is in it (screens)

Overview (score and what to fix), Apps and network (which program talks to
where; ask on first connection), System posture (the list of checks),
Hardening (26 kernel, network, filesystem and module settings, ticked from a
list, each with what it can break), Firewall (inbound rules), Secure DNS
(encrypted lookups, tracker and malware blocking, split DNS, recognises an
existing dnscrypt-proxy), Plugins (what each can read and change), Connect an
AI (MCP: lets an AI assistant read the status and suggest changes; it can
never apply one), History (every change, undo), Settings (language, theme).
Command line: `ibexctl` (status, plugins, check, findings, plan, apply,
confirm, rollback, history, audit, events, apps, mcp, proposals, prompts,
firewall, tui). A terminal UI: `ibexctl tui`.

## How it is built

Rust (daemon `ibexwalld`, CLI `ibexctl`, resolver `ibexwall-dns`, MCP server
`ibexwall-mcp`, session agent `ibexwall-agent`), eBPF (aya) for per-program
network control, nftables, systemd, polkit, varlink between components.
Interface: Svelte 5 inside Tauri 2. Plugins are one signed multicall binary,
started by systemd per plugin, each in its own sandboxed unit (dynamic user,
no capabilities unless declared). Mandatory access control: AppArmor profiles
(Debian, Ubuntu) and an SELinux module (Fedora) confine the resolver, the MCP
server and the plugins.

## Where it runs

Fedora, Ubuntu 24.04 and 26.04, Debian, Arch Linux (tested in virtual
machines on each). Packages: `ibexwall` (daemon, CLI, plugins),
`ibexwall-desktop` (window, tray, session agent), `ibexwall-mcp`; plus
`ibexwall-apparmor` (Debian, Ubuntu) or `ibexwall-selinux` (Fedora).
Uninstall undoes what IbexWall changed and keeps your data until you purge.

## The 32 plugins

- apps.flatpak-network: Flatpak network access. Cuts the network access of a Flatpak app with a reversible override.
- apps.flatpak-perms: Flatpak permissions. Lists Flatpak apps that can reach your files, devices or the sandbox's own controls.
- device.usb: USB protection. Checks that new USB devices are blocked until you allow them (USBGuard), and builds the allow list from what is plugged in now.
- endpoint.av: Antimalware. Scans folders on demand or on a schedule with ClamAV and YARA, and reports what they find.
- endpoint.integrity: File integrity. Asks the package manager which installed files are not what it shipped, and AIDE when it is set up.
- endpoint.isolate: Emergency mode. Cuts the network except for the addresses you name, and is undone from History.
- endpoint.persistence: Persistence. Watches the places a program can use to stay on this computer (units, cron, autostart, shell start-up, LD_PRELOAD) and reports what changed.
- endpoint.rootkit: Rootkit scan. Runs rkhunter and chkrootkit, on demand or on a schedule, and reports what they flag. Their warnings need a person's review: they are not proof.
- net.dns: Secure DNS. Encrypts DNS lookups, blocks trackers and malware domains, and keeps browsers from bypassing it.
- net.exposure: Open ports, seen with nmap. Scans this computer's own addresses (never another machine) with nmap and lists which TCP ports answer, to compare with what you expect.
- net.firewall: Firewall. Controls which connections can reach this computer, through the firewall your system already uses.
- net.nts: Secure time (NTS). Checks that chrony takes the time from servers it can authenticate (NTS), and adds them.
- net.vpn: VPN and kill switch. Imports WireGuard profiles into NetworkManager and blocks all traffic outside the tunnel if it drops.
- net.wifi: Wi-Fi privacy. Checks that Wi-Fi uses a changed hardware address and that open networks are not remembered, and sets the address.
- privacy.camera-mic: Camera and microphone. Shows which programs are using the camera or the microphone right now.
- privacy.telemetry: Telemetry. Lists the usage reporting the distribution and some apps send, so you can decide about it.
- system.accounts: Accounts. Checks for accounts without a password, extra administrator accounts and sign-in lockout.
- system.assistant: AI assistants. What an AI assistant may read, plan or propose, and the access tokens for assistants on other machines.
- system.audit: Security audit. Shows the warnings and suggestions of Lynis when it is installed. IbexWall does not bundle or run it.
- system.coredump: Core dumps. Checks whether crash dumps (which can hold passwords and keys) are stored, and turns storage off.
- system.firmware: Firmware. Checks that the firmware update service (fwupd) is installed and refreshing its list.
- system.hardening: Hardening. Tells which of the recommended hardening settings this machine already has. It changes nothing; each setting is applied through the plugin that owns it.
- system.modules: Kernel modules. Stops groups of rarely needed kernel modules from being loaded, which shrinks what an attacker can reach through the kernel.
- system.mounts: Temporary mounts. Checks that /tmp and /dev/shm cannot run programs or hold setuid files, and sets it for the next boot.
- system.openscap: Security profile check (OpenSCAP). Checks this computer against a published security profile (for example ANSSI or CIS) with OpenSCAP and lists the rules that fail. It changes nothing.
- system.ports: Exposed ports. Lists services that accept connections from other computers.
- system.posture: System posture. Checks how well this computer is protected: boot, disk, firewall and accounts.
- system.session-lock: Screen lock. Checks that the desktop locks the screen by itself when you step away.
- system.ssh: SSH server. Checks the SSH server's settings (root login, empty passwords, forwarding) and tightens them with a drop-in.
- system.sysctl: Kernel hardening. Checks the kernel's security settings against the reference table, and applies them.
- system.updates: Automatic updates. Checks that security updates install themselves, and turns it on when the distro's tool is installed.
- vuln.cves: Known vulnerabilities. Lists the security updates your distribution has published for installed packages. Works offline from the package manager's own cache; nothing is sent anywhere.

## Voice

Calm, plain, short sentences, second person. Say what happens and what the
person can do. No hype, no fear, no jargon without a one-line explanation. No
marketing superlatives. Never use the em dash or the en dash; use commas,
colons, parentheses or two sentences. Prefer concrete examples to adjectives.
Do not sound like a template: vary sentence length, avoid stock phrases such as
"in today's world", "it's important to note", "dive into", "unlock", "robust",
"seamless", "leverage", "ensure". Do not use ASCII tables or horizontal rules.
