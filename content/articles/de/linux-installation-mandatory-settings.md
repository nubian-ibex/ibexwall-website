---
title: "Die Einstellungen, die bei der Linux-Installation stimmen müssen"
description: "Die Entscheidungen, die bei der Installation fallen, Festplattenverschlüsselung, Secure Boot, Konten und Partitionierung, die später schwer zu ändern sind, und wie IbexWall jede danach validiert."
slug: "linux-installation-mandatory-settings"
date: 2026-11-06
updated: 2026-11-06
tags: [installation, verschlüsselung, secure-boot, konten]
related_hardening: []
---

Die meisten Sicherheitsentscheidungen unter Linux fallen in der ersten Stunde, während der Installation, und sind danach lästig zu ändern. Dieser Artikel listet die, die von Anfang an stimmen müssen, und wie man sie danach mit IbexWall prüft.

## Verschlüssle die Platte während der Installation

Später zu verschlüsseln bedeutet meist neu zu installieren. Wähle während der Einrichtung die vollständige Festplattenverschlüsselung (LUKS) und verschlüssle auch den Swap, denn ein suspendierter Laptop schreibt das Speicherabbild unverschlüsselt in den Swap. Wo die Firmware es erlaubt, binde das Entsperren an das TPM2, damit die Maschine ohne zweites Passwort startet, aber eine entnommene Platte ablehnt.

Prüfe später: `posture.disk_encryption` und `posture.swap_encryption` von IbexWall.

## Aktiviere Secure Boot

Secure Boot ist eine Firmware-Einstellung, nicht auf jeder Distribution eine Installer-Checkbox, aber es ist während der Installation, dass man merkt, dass es aus ist. Aktiviere es und das Kernel-Lockdown, damit ein manipulierter Kernel oder ein unsigniertes Modul abgelehnt wird.

Prüfe später: `posture.secure_boot` und `posture.lockdown`.

## Wähle die Konten sorgfältig

Der erste Benutzer ist der Administrator. Gib ihm ein echtes Passwort, niemals ein leeres, und stelle sicher, dass nur das vorgesehene Konto uid 0 hält. Aktiviere die Kontosperre, damit ein Rater gebremst wird.

Prüfe später: `accounts.empty_passwords`, `accounts.uid0` und `accounts.lockout`.

## Lass sudo nach einem Passwort fragen

Manche Installer bieten sudo ohne Passwort aus Bequemlichkeit an. Lehne ab. Ein sudo, das nach einem Passwort fragt, ist der Unterschied zwischen „jemand hat die Platte gelesen" und „jemand ist root". Konfiguriere es so, dass es protokolliert, was es ausführt.

Prüfe später: `posture.sudo_nopasswd` und `accounts.sudo_logging`.

## Schalte die Firewall vom ersten Tag an ein

Eine Firewall, die eingehend standardmäßig verweigert, kostet bei der Installation nichts und verhindert Überraschungen. Fedora bringt firewalld, Ubuntu bringt ufw; schalte das ein, was da ist, bevor die Maschine das Netz sieht.

Prüfe später: `firewall.default_deny` und der Firewall-Bildschirm.

## Lass Updates allein laufen

Aktiviere automatische Sicherheitsupdates im Installer oder direkt danach. Eine Maschine, die sich selbst aktualisiert, schließt bekannte Lücken ohne einen Menschen dazwischen, und es ist die Kontrolle, bei der Angreifer darauf zählen, dass sie übersprungen wird.

Prüfe später: `posture.updates_automatic` und `cves.security_updates`.

## Die Entscheidungen, die schwer zu ändern sind

Festplattenverschlüsselung, Secure Boot und das Partitionslayout sind Entscheidungen des Installationszeitpunkts. Alles andere, Firewall, Konten, sudo und Updates, lässt sich später korrigieren, sollte aber nicht nötig sein. Die schweren von Anfang an richtig zu machen bedeutet, dass nur die leichten übrig bleiben.

## Prüfe alles mit IbexWall

Nach der Installation zeigt der Bildschirm Überblick von IbexWall einen Score und die Befunde dahinter, und die Systempostur listet jede Prüfung: Platte, Boot, Firewall, Konten, Updates und offene Ports. Jede Korrektur ist ein Plan, den du vorher prüfst, mit den genauen Dateien und was brechen kann, und der Verlauf kann sie rückgängig machen.
