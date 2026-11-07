---
title: "Das Plugin-System von IbexWall: 32 Plugins, jedes in seinem eigenen Sandbox"
description: "Warum IbexWall aus signierten Plugins besteht, wie ein einziges Binary sie alle bedient, und warum jedes in seinem eigenen Sandbox läuft, wo es nur das darf, was sein Manifest erklärt."
slug: "ibexwall-plugin-system"
date: 2026-11-06
updated: 2026-11-06
tags: [plugins, sandbox, architektur, signatur]
related_hardening: []
---

Ein Sicherheitswerkzeug ist nur so vertrauenswürdig wie sein schwächstes Teil. IbexWall teilt die Arbeit auf 32 Plugins auf, jedes für eine Sache zuständig, und sperrt jedes ein. Dieser Artikel erklärt das Warum und das Wie.

## Was die Plugins tun

Die Plugins fallen in grobe Gruppen. Die System-Plugins prüfen und härten die Maschine selbst: Postur, Konten, SSH, sysctl, Mounts, Updates, der Audit-Daemon, Coredumps und Firmware. Die Netzwerk-Plugins kümmern sich um DNS, Firewall, Exposition, WLAN, NTS-Zeit und VPN. Die Endpoint-Plugins führen Antivirus, Integritäts- und Rootkit-Scans aus und isolieren die Maschine im Notfall. Es gibt auch Plugins für Anwendungen, USB-Geräte, Kamera und Mikrofon sowie Telemetrie.

Manche prüfen nur, manche steuern nur, viele tun beides. Eine Prüfung liest den echten Zustand und meldet Befunde; eine Steuerung schlägt Operationen vor, etwa eine sysctl-Änderung oder eine Firewall-Regel, und der Core wendet sie an.

## Ein Binary, viele Plugins

Die Plugins werden als ein einziges Multicall-Binary unter `/usr/libexec/ibexwall/ibexwall-plugins` ausgeliefert, das für jedes Plugin unter einem anderen Namen startet. Der Name sagt, welches Manifest zu lesen ist, also gibt es einen einzigen Build zum Signieren und Auditieren, nicht zweiunddreißig.

## Signiert, und manipulationssicher

Jedes Plugin trägt ein Manifest: seine ID, Name und Beschreibung in fünf Sprachen und, entscheidend, seine Privilegien, die sysctl-Schlüssel, Dateipfade und Capabilities, die es berühren darf. Das Manifest ist signiert, und der Daemon wird mit dem eingebetteten öffentlichen Release-Schlüssel gebaut. Ein Plugin, dessen Manifest nach der Signatur geändert wurde, wird sofort abgelehnt. Das erlaubt einer gepackten Installation, genau den Plugins zu vertrauen, mit denen sie ausgeliefert wurde, ohne jeden Entwicklungsschlüssel.

## Jedes in seinem eigenen Sandbox

Jedes Plugin läuft unter systemd in einer eigenen Unit, mit dynamischem Benutzer, ohne Home, privatem temporärem Verzeichnis und nur den Dateien und sysctl-Schlüsseln, die sein Manifest erklärt hat. Es hat keine Shell: Die Operationen, die es vorschlägt, sind typisierte Werte, keine Kommandozeilen, also kann ein Plugin keinen beliebigen Befehl einschmuggeln.

## Plugins schlagen vor, der Core führt aus

Das ist die Regel, die das ganze Design trägt. Ein Plugin ändert das System niemals selbst. Es schlägt typisierte Operationen vor, und der Core validiert jede gegen das Manifest, macht einen Schnappschuss des Zustands, und erst dann wendet er sie an. Das Plugin fragt; der Core entscheidet. Diese Trennung ist der Grund, warum ein Bug oder eine Übernahme in einem einzelnen Plugin nicht still die ganze Maschine erreichen kann.
