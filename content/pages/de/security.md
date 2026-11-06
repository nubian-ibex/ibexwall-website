---
title: "Sicherheit"
description: "Wie IbexWall gebaut ist, um Vertrauen zu verdienen: Pläne und Wiederherstellungspunkte, signierte Plugins und Releases, Sandboxes, eingegrenzte Dienste und Meldung von Schwachstellen."
updated: 2026-11-06
---

Ein Sicherheitswerkzeug muss sicherer sein als der Computer, den es schützt. Diese Seite listet auf, was IbexWall dafür tut und was es nicht behauptet.

## Änderungen, die Sie sehen und rückgängig machen können

Nichts wird ohne Plan geändert. Ein Plan listet die genauen Dateien, Dienste und Firewall-Regeln auf, mit einer Vorschau auf den Unterschied und einem Hinweis, was kaputtgehen könnte. Vor dem Anwenden wird ein Wiederherstellungspunkt erstellt. Eine Änderung, die Ihr Netzwerk kappen könnte, wartet auf Ihre Bestätigung und macht sich selbst rückgängig, wenn Sie sie nicht geben. Der Verlauf listet jede Änderung auf und kann jede davon rückgängig machen.

## Plugins schlagen vor, der Kern führt aus

Ein Plugin liest das System und beschreibt eine Änderung. Es kann keine vornehmen. Nur der Kern wendet Änderungen an, als root, mit Plan, Wiederherstellungspunkt und Ihrer Zustimmung. IbexWall bearbeitet nur seine eigenen Dateien (Drop-ins mit `ibexwall` im Namen und eine eigene Firewall-Tabelle) und nie die, die Ihrer Distribution oder einem anderen Programm gehören.

## Signiert, in Sandboxes, eingegrenzt

- Plugin-Manifeste sind signiert. Der Daemon wird mit dem öffentlichen Release-Schlüssel gebaut und lehnt ein Manifest ab, das sich nicht verifizieren lässt.
- Jedes der 32 Plugins läuft in einer eigenen systemd-Unit: mit dynamischem Benutzer, ohne Capabilities, sofern es sie nicht deklariert, und mit schreibgeschütztem System. Die Bewertung der Unit durch `systemd-analyze security` wird für jedes Plugin veröffentlicht.
- Unter Debian und Ubuntu grenzen AppArmor-Profile den Resolver, den Assistenten-Server und die Plugins ein. Unter Fedora tut das ein SELinux-Modul. Beide werden mit aktivierter Durchsetzung getestet.

## Releases, die Sie prüfen können

Jedes Release hat Prüfsummen, eine Signatur für jede Datei, eine Software-Stückliste (CycloneDX) und eine Herkunftserklärung. Der Build ist reproduzierbar: Wer denselben Commit zweimal in verschiedenen Ordnern baut, erhält identische Dateien.

## Was es nicht tut

IbexWall schützt einen Computer nicht vor jemandem, der darauf bereits root-Rechte hat, und es kann kein unsicheres Programm sicher machen. Es verkleinert die Angriffsfläche und sagt Ihnen, was offenliegt. Das Bedrohungsmodell ist in der [Dokumentation](https://docs.ibexwall.com/concepts/security-model/) öffentlich.

## Der Release-Schlüssel

Der Schlüssel, der Releases signiert, wird vor der Veröffentlichung von Version 1.0 hier und im Repository veröffentlicht. Bis dahin sind die Pakete aus den Tests des Projekts mit einem Entwicklungsschlüssel signiert, der für ein Release nicht gültig ist.

## Eine Schwachstelle melden

Nutzen Sie die private Schwachstellenmeldung von GitHub im [Repository](https://github.com/nubian-ibex/ibexwall/security). Eröffnen Sie bitte kein öffentliches Issue für ein Sicherheitsproblem und fügen Sie keine Geheimnisse in eine Meldung ein. Wir wollen innerhalb weniger Tage antworten.
