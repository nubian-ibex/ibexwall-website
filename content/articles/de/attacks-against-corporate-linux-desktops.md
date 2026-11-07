---
title: "Bekannte Angriffe auf Linux-Desktops in Unternehmen, und wie man sie stoppt"
description: "Die dokumentierten Wege, wie Angreifer in Linux-Desktops in Firmen eindringen: Diebstahl von Zugangsdaten, Rechteausweitung, Persistenz und Lieferkette. Was jede stoppt, und wie IbexWall es validiert."
slug: "attacks-against-corporate-linux-desktops"
date: 2026-11-06
updated: 2026-11-06
tags: [angriffe, unternehmen, härtung, validierung]
related_hardening: []
---

Angreifer schreiben selten einen neuen Exploit für einen Linux-Desktop. Sie verwenden eine kurze Liste bekannter Techniken wieder, weil diese weiter funktionieren. Dieser Artikel listet die Techniken, was jede stoppt, und wie IbexWall aus „wir glauben, wir haben es gestoppt" eine Prüfung macht, die es aussagt.

## Diebstahl von Zugangsdaten und schwache Konten

Der häufigste Einstieg ist ein leeres oder wiederverwendetes Passwort, oder eine Maschine, auf der jemand ohne Passwort root werden kann. Auf einem Firmen-Desktop verschärft sich das Risiko durch offen gelassenes SSH und sudo, das kein Passwort verlangt.

Was es stoppt: keine leeren Passwörter, keine verirrte uid 0, Kontosperre, sudo, das ein Passwort verlangt, und gehärtetes SSH. IbexWall prüft all das: `accounts.empty_passwords`, `accounts.uid0`, `accounts.lockout`, `posture.sudo_nopasswd` und `ssh.hardening`.

## Rechteausweitung

Einmal drin als unprivilegierter Benutzer, weitet der Angreifer Rechte aus. Gängige Wege sind eine beschreibbare sensible Datei, ein setuid-Binary, ein alter Kernel mit bekannter Lücke oder eine entsperrte Sitzung.

Was es stoppt: zügiges Patchen, strikte Berechtigungen auf `/etc/shadow`, `/etc/passwd` und `/etc/sudoers` und automatische Bildschirmsperre. IbexWall prüft ausstehende Updates, Berechtigungen sensibler Dateien (`accounts.file_perms`), die sudo-Protokollierung und `session_lock.automatic`.

## Persistenz

Nach der Ausweitung will der Angreifer einen Neustart überleben. Dokumentierte Techniken sind Autostart-Einträge, cron, Shell-Startdateien und `LD_PRELOAD`. Ein sauberer Start, der still eine Hintertür nachlädt, ist das Ziel.

Was es stoppt: diese Stellen auf Änderungen beobachten. Das `endpoint.persistence` von IbexWall hasht Units, Timer, cron, Autostart, Shell-Start und `LD_PRELOAD` und meldet, was seit einer von dir akzeptierten Basis neu oder verändert ist.

## Lieferkette und das Unbekannte ausführen

Ein kompromittiertes Paket, ein geklontes Repository oder ein Skript aus einem Forum können Code pflanzen, der dann nach Hause telefoniert oder die Platte liest. Das ist weniger „Malware-Scan" als nur das auszuführen, dem du vertraust, und zu beobachten, was es erreicht.

Was es stoppt: Paketsignaturen, eine Firewall, die eingehend standardmäßig verweigert, und Netzwerkkontrolle pro Programm. IbexWall prüft, dass Paketsignaturen erzwungen werden (`updates.signatures`), dass die Firewall standardmäßig verweigert (`firewall.default_deny`), und fragt beim ersten Mal, wenn ein neues Programm das Netz erreicht.

## Der Punkt der Validierung

Keine dieser Verteidigungen ist neu. Schwierig ist, auf einer bestimmten Maschine zu wissen, welche wirklich gelten. Eine Richtlinie, die sagt „verschlüssle die Platte und sperre die Konten", ist keine Verschlüsselung. IbexWall macht aus jeder Verteidigung eine Prüfung, die den echten Zustand liest, ehrlich meldet, wenn sie ihn nicht lesen kann, und die Person das Fehlgeschlagene über einen geprüften, umkehrbaren Plan beheben lässt. Ein Unternehmen gewinnt eine Maschine, die ihre eigene Postur beweist, statt einer, der man nur gesagt hat, sicher zu sein.
