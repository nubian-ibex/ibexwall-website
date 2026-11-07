---
title: "Antivirus unter Linux in Unternehmen: was noch funktioniert, und wie IbexWall hilft"
description: "Warum Antivirus unter Linux etwas anderes bedeutet, welche Scanner und Integritätswerkzeuge noch wirksam sind, und wie IbexWall daraus eine geprüfte, validierte Einrichtung macht."
slug: "antivirus-on-corporate-linux"
date: 2026-11-06
updated: 2026-11-06
tags: [antivirus, endpoint, integrität, rootkit, unternehmen]
related_hardening: []
---

Antivirus unter Linux ist eine andere Aufgabe als unter Windows, und sie gleich zu behandeln verschwendet Mühe. Dieser Artikel erklärt, was auf einem Linux-Desktop im Unternehmen wirklich wirksam ist und wo IbexWall hineinpasst.

## Warum die Aufgabe anders ist

Die meiste für Linux geschriebene Malware wird von einem Signaturscanner, der auf Windows-Dateien zielt, nicht erwischt, und die meiste Malware, die Desktops angreift, zielt immer noch auf Windows. Unter Linux liegt der Hauptwert des Scanners im Transit: ein Mail-Anhang, ein Download, ein geteilter Ordner, der eine Windows-Nutzlast zu einem Kollegen trägt. Die tieferen Linux-Risiken, eine Hintertür, ein Rootkit, ein verändertes Binary, werden von Integrität und Verhalten erwischt, nicht von einer Dateisignatur.

## Was unter Linux noch funktioniert

- ClamAV ist der Open-Source-Scanner. Er ist ehrlich darüber, signaturbasiert zu sein: Er erwischt bekannte Dateien, kein neues Verhalten. Auf einem Firmen-Desktop verdient er sich seinen Platz, indem er durchlaufende Dateien scannt, und er kann nach Zeitplan laufen.
- Die Dateiintegrität, über AIDE oder die eigene Verifikation des Paketmanagers (`rpm -Va`, `dpkg --verify`, `pacman -Qkk`), erwischt ein Programm-Binary, das sich auf der Platte geändert hat. Das ist das Signal, das unter Linux am meisten zählt.
- Rootkit-Scanner suchen versteckte Prozesse, Module und Ports, was eine Hintertür auf Kernel-Ebene verbirgt.
- Persistenz-Prüfungen beobachten die Stellen, an denen eine Hintertür überlebt: Autostart, cron, Shell-Start, `LD_PRELOAD`.

Die kommerziellen EDR-Agenten (CrowdStrike Falcon, SentinelOne, Microsoft Defender for Endpoint und andere) fügen Verhaltenserkennung und eine Konsole obendrauf. Sie sind wirksam, und sie sind auch ein verwalteter, zentraler Dienst.

## Was IbexWall damit macht

IbexWall installiert kein Antivirus, und es ist kein EDR. Es macht aus den wirksamen Teilen Plugins, die du sehen und steuern kannst:

- `endpoint.av` führt ClamAV und YARA über Ordner aus, die du wählst, nach dem Zeitplan, den du setzt, und macht aus dem, was die Scanner gedruckt haben, Befunde. Ein fehlender Scanner oder eine fehlende Basis wird gesagt, nicht versteckt.
- `endpoint.integrity` führt den Paketprüfer und AIDE aus, wenn eingerichtet, und meldet eine veränderte Programmdatei als hohe Schwere.
- `endpoint.rootkit` prüft die Zeichen, die ein Rootkit hinterlässt.
- `endpoint.persistence` beobachtet die Stellen, an denen sich eine Hintertür einrichten würde.

Weil jedes Plugin in einem Sandbox läuft und jeder Scan eine geprüfte, umkehrbare Änderung ist, sieht die Person am Schreibtisch das Ergebnis und kann handeln, was der Unterschied zwischen einem Antivirus, das still läuft, und einem, das wirklich gelesen wird, ist.

## Was das für die Linux-Einführung bedeutet

Ein Unternehmen, das zögert, Linux auf die Desktops zu bringen, stellt oft die falsche Frage, nämlich „hat Linux Antivirus wie Windows?". Die richtige Frage ist „können wir beweisen, dass jede Maschine gepatcht, verschlüsselt, gescannt und unverändert ist?". IbexWall beantwortet das auf der Maschine, ohne Konsole und ohne irgendwohin Daten zu senden, und übergibt dem Unternehmen einen Beleg, den es aufbewahren kann.
