---
title: "Pflicht-Einrichtung für einen Linux-Desktop im Unternehmen"
description: "Die Liste, die ein Unternehmen auf jedem Linux-Desktop durchsetzen sollte, bevor es ihn an Mitarbeiter gibt: Festplattenverschlüsselung, Secure Boot, Konten, Firewall, Updates und SSH, und wie IbexWall beweist, dass jeder Punkt hält."
slug: "corporate-linux-desktop-mandatory-setup"
date: 2026-11-06
updated: 2026-11-06
tags: [unternehmen, installation, checkliste, compliance]
related_hardening: []
---

Ein Unternehmen, das Linux-Desktops ausrollt, schreibt meist eine Richtlinie und vertraut dann darauf, dass jede Maschine sie befolgt. Dieser Artikel macht aus der Richtlinie eine konkrete Checkliste und zeigt die IbexWall-Prüfungen, die beweisen, dass jeder Punkt auf der Maschine wirklich hält.

## Festplattenverschlüsselung, vor allem anderen

Verschlüssle Festplatte und Swap, und entsperre mit einem an das TPM2 gebundenen Schlüssel, wo die Firmware es erlaubt, damit die Maschine ohne zweites Passwort startet, aber eine entnommene Platte trotzdem ablehnt. Ohne Verschlüsselung ist alles andere egal: Die Daten gehen mit dem Laptop zur Tür hinaus.

Was IbexWall validiert: `posture.disk_encryption` und `posture.swap_encryption` lesen den echten Zustand von Platte und Swap und sagen ehrlich, wenn sie es nicht können.

## Secure Boot und Kernel-Lockdown

Aktiviere Secure Boot und das Kernel-Lockdown. Zusammen verhindern sie, dass ein Angreifer einen manipulierten Kernel startet oder aus einem laufenden System ein unsigniertes Modul lädt.

Was IbexWall validiert: `posture.secure_boot` und `posture.lockdown`.

## Konten: keine leeren Passwörter, kein verirrtes root, Sperre an

Ein Unternehmens-Desktop hat genau einen Administratorweg, und er verlangt ein Passwort. Prüfe, dass kein Konto ein leeres Passwort hat, dass nur die vorgesehenen Konten uid 0 halten und dass fehlgeschlagene Anmeldungen das Konto sperren.

Was IbexWall validiert: `accounts.empty_passwords`, `accounts.uid0` und `accounts.lockout`.

## sudo fragt nach einem Passwort, und protokolliert

Konfiguriere sudo so, dass es das Passwort des Benutzers verlangt und protokolliert, was es ausführt. Ein sudo ohne Passwort macht aus einer gestohlenen Sitzung sofort root; ein sudo ohne Protokoll versteckt, was getan wurde.

Was IbexWall validiert: `posture.sudo_nopasswd` und `accounts.sudo_logging`.

## Eine Firewall, die eingehend standardmäßig verweigert

Nichts sollte auf neue Verbindungen lauschen, außer was das Unternehmen geöffnet hat. Unter Fedora ist es firewalld, unter Ubuntu ufw, und IbexWall arbeitet durch das hindurch, was da ist.

Was IbexWall validiert: `firewall.default_deny`, und der Firewall-Bildschirm schließt, was nicht lauschen sollte.

## Updates, die sich selbst installieren

Aktiviere automatische Sicherheitsupdates, damit eine bekannte Lücke geschlossen wird, ohne auf eine Person zu warten. Es ist die billigste Kontrolle überhaupt und die, bei der Angreifer darauf zählen, dass du sie überspringst.

Was IbexWall validiert: `posture.updates_automatic`, `updates.automatic` und `cves.security_updates`.

## SSH, wenn es überhaupt an ist

Wenn ein Desktop SSH annimmt, härte es: kein root-Login, kein reiner Passwort-Login und keine kurzen Schlüssel. Wenn es kein SSH braucht, schalte es aus.

Was IbexWall validiert: `ssh.hardening`.

## Backups, getestet durch Wiederherstellen

Keine Prüfung beweist, dass ein Backup funktioniert. Die Regel ist: einmal im Monat eine Datei aus dem neuesten Backup in einen Übungsordner wiederherstellen. Ransomware, eine sterbende Platte und ein vertipptes `rm` enden am selben Ort.

## Beweise es, pro Maschine

Eine Richtlinie, die sagt „verschlüssle die Platte", ist keine Verschlüsselung. Der Wert von IbexWall bei einem Unternehmens-Rollout ist, dass jede Maschine ihre eigene Postur beweist und ein Flottenmanager einen signierten Bericht einsammeln kann (`ibexctl compliance export`), ohne dass IbexWall selbst nach Hause telefoniert. Der Compliance-Bildschirm vergleicht die Maschine mit LGPD, NIST und ISO, wo das Unternehmen Beleg für ein Audit braucht.
