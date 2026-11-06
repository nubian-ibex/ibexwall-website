---
title: "Über IbexWall"
description: "IbexWall ist ein freies Open-Source-Sicherheitszentrum für Linux, entwickelt vom Projekt Nubian Ibex. Lizenz, Aufbau und wie Sie mitmachen können."
updated: 2026-11-06
---

IbexWall ist ein freies Open-Source-Sicherheitszentrum für Linux-Desktops. Das Projekt Nubian Ibex veröffentlicht es unter der Lizenz GPL-3.0-or-later. Es gibt IbexWall, weil das Prüfen eines Linux-Computers, das Verstehen des Ergebnisses und das sichere Beheben von Problemen keinen Tag Lesearbeit erfordern sollten.

## Grundsätze

- Erst zeigen, dann ändern: Jede Änderung ist ein Plan, den Sie prüfen und rückgängig machen können.
- Einfach sagen: Jede Prüfung und jede Einstellung wird in Worten erklärt, denen auch Laien folgen können, und sagt, was sie beeinträchtigen kann.
- In Ihrer Hand behalten: keine Telemetrie, kein Konto, keine Bindung. Die Daten liegen auf Ihrem Computer, und der Code ist offen.
- In der eigenen Spur bleiben: IbexWall ändert nur seine eigenen Dateien und lässt die Ihrer Distribution in Ruhe.

## Wie es gebaut ist

Der Daemon, die Kommandozeile, der Resolver für sicheres DNS und der Assistenten-Server sind in Rust geschrieben. Die Netzwerkkontrolle pro Programm nutzt eBPF, die Firewall ist nftables, die Teile sprechen über varlink miteinander, und polkit entscheidet, wer was darf. Das Fenster ist eine Svelte-5-Oberfläche in Tauri 2. Plugins sind ein einziges signiertes Programm, das systemd für jedes Plugin in einer eigenen Sandbox startet.

## Mitmachen

- Lesen Sie die [Dokumentation](https://docs.ibexwall.com) und den [Quellcode](https://github.com/nubian-ibex/ibexwall).
- Übersetzen: Die App und diese Website gibt es auf Englisch, Portugiesisch, Spanisch, Französisch und Deutsch, und eine weitere Sprache hinzuzufügen erfordert keinen Code. Die [Übersetzungsanleitung](https://docs.ibexwall.com/contributing/translating/) erklärt, wie.
- Eine Härtungseinstellung prüfen: Jede Seite nennt ihre Quellen. Wenn etwas falsch oder veraltet ist, eröffnen Sie ein Issue.

## Sprachen

Das Programm und diese Website folgen Ihrer Systemsprache. Jede Seite hat eine Sprachauswahl. Eine Seite, die noch nicht übersetzt ist, zeigt den englischen Text und weist darauf hin.
